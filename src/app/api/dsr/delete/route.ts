import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { vaultDeleteUser } from '@/lib/privacy-vault';
import { logProcessing } from '@/lib/processing-log';
import { z } from 'zod';

const DeleteRequestSchema = z.object({
  confirm: z.boolean().refine(val => val === true, {
    message: 'Confirmation must be true to proceed with deletion',
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { confirm } = DeleteRequestSchema.parse(body);

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Create DSR request record
    const { data: dsrRequest, error: dsrError } = await supabaseServer
      .from('dsr_requests')
      .insert({
        user_id: userId,
        type: 'DELETE',
        status: 'running',
      })
      .select()
      .single();

    if (dsrError) {
      throw new Error(`Failed to create DSR request: ${dsrError.message}`);
    }

    try {
      const deletionSummary = {
        piiVault: 0,
        resumes: 0,
        resumeVersions: 0,
        jobTargets: 0,
        comments: 0,
        batches: 0,
        batchItems: 0,
        analytics: 0,
        tokens: 0,
        referrals: 0,
        consents: 0,
        processingLogs: 0,
      };

      // Delete PII vault
      deletionSummary.piiVault = await vaultDeleteUser(userId);

      // Delete resumes and related data
      const { data: resumes } = await supabaseServer
        .from('resumes')
        .select('id')
        .eq('user_id', userId);

      if (resumes && resumes.length > 0) {
        const resumeIds = resumes.map(r => r.id);

        // Delete resume versions
        const { count: versionCount } = await supabaseServer
          .from('resume_versions')
          .delete()
          .in('resume_id', resumeIds);
        deletionSummary.resumeVersions = versionCount || 0;

        // Delete comments
        const { count: commentCount } = await supabaseServer
          .from('resume_comments')
          .delete()
          .in('resume_version_id', resumeIds);
        deletionSummary.comments = commentCount || 0;

        // Delete resumes
        const { count: resumeCount } = await supabaseServer
          .from('resumes')
          .delete()
          .eq('user_id', userId);
        deletionSummary.resumes = resumeCount || 0;
      }

      // Delete job targets
      const { count: jobTargetCount } = await supabaseServer
        .from('job_targets')
        .delete()
        .eq('user_id', userId);
      deletionSummary.jobTargets = jobTargetCount || 0;

      // Delete batches and items
      const { data: batches } = await supabaseServer
        .from('resume_batches')
        .select('id')
        .eq('user_id', userId);

      if (batches && batches.length > 0) {
        const batchIds = batches.map(b => b.id);

        // Delete batch items
        const { count: batchItemCount } = await supabaseServer
          .from('resume_batch_items')
          .delete()
          .in('batch_id', batchIds);
        deletionSummary.batchItems = batchItemCount || 0;

        // Delete batches
        const { count: batchCount } = await supabaseServer
          .from('resume_batches')
          .delete()
          .eq('user_id', userId);
        deletionSummary.batches = batchCount || 0;
      }

      // Delete analytics
      const { count: analyticsCount } = await supabaseServer
        .from('resume_events')
        .delete()
        .eq('user_id', userId);
      deletionSummary.analytics = analyticsCount || 0;

      // Delete integration tokens
      const { count: tokenCount } = await supabaseServer
        .from('integration_tokens')
        .delete()
        .eq('user_id', userId);
      deletionSummary.tokens = tokenCount || 0;

      // Delete referrals
      const { count: referralCount } = await supabaseServer
        .from('referrals')
        .delete()
        .eq('user_id', userId);
      deletionSummary.referrals = referralCount || 0;

      // Delete consents
      const { count: consentCount } = await supabaseServer
        .from('consents')
        .delete()
        .eq('user_id', userId);
      deletionSummary.consents = consentCount || 0;

      // Delete processing logs
      const { count: logCount } = await supabaseServer
        .from('processing_logs')
        .delete()
        .eq('user_id', userId);
      deletionSummary.processingLogs = logCount || 0;

      // Insert tombstone in processing logs
      await supabaseServer
        .from('processing_logs')
        .insert({
          user_id: userId,
          action: 'DELETE',
          lawful_basis: 'consent',
          subject_id: userId,
          metadata: {
            deletionSummary,
            timestamp: new Date().toISOString(),
          },
        });

      // Update DSR request
      await supabaseServer
        .from('dsr_requests')
        .update({
          status: 'done',
          updated_at: new Date().toISOString(),
        })
        .eq('id', dsrRequest.id);

      // Log processing activity
      await logProcessing({
        userId,
        action: 'DELETE',
        lawfulBasis: 'consent',
        subjectId: dsrRequest.id,
        metadata: {
          totalRecordsDeleted: Object.values(deletionSummary).reduce((sum, count) => sum + count, 0),
          deletionSummary,
        },
      });

      return NextResponse.json({
        success: true,
        requestId: dsrRequest.id,
        status: 'done',
        deletionSummary,
      });
    } catch (error) {
      // Update DSR request with error
      await supabaseServer
        .from('dsr_requests')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', dsrRequest.id);

      throw error;
    }
  } catch (error) {
    console.error('Error in DSR delete:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error during deletion' },
      { status: 500 }
    );
  }
}
