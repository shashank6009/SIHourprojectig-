import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { vaultFetch } from '@/lib/privacy-vault';
import { logProcessing } from '@/lib/processing-log';
import { z } from 'zod';

const ExportRequestSchema = z.object({
  // No additional fields required for export
});

export async function POST(request: NextRequest) {
  try {
    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Create DSR request record
    const { data: dsrRequest, error: dsrError } = await supabaseServer
      .from('dsr_requests')
      .insert({
        user_id: userId,
        type: 'EXPORT',
        status: 'running',
      })
      .select()
      .single();

    if (dsrError) {
      throw new Error(`Failed to create DSR request: ${dsrError.message}`);
    }

    try {
      // Assemble user data bundle
      const userBundle: any = {
        exportInfo: {
          userId,
          timestamp: new Date().toISOString(),
          version: process.env.POLICY_VERSION || '2025-09-28',
        },
        data: {},
      };

      // Fetch resumes and versions
      const { data: resumes } = await supabaseServer
        .from('resumes')
        .select('*')
        .eq('user_id', userId);

      const { data: resumeVersions } = await supabaseServer
        .from('resume_versions')
        .select('*')
        .in('resume_id', resumes?.map(r => r.id) || []);

      userBundle.data.resumes = resumes || [];
      userBundle.data.resumeVersions = resumeVersions || [];

      // Fetch job targets
      const { data: jobTargets } = await supabaseServer
        .from('job_targets')
        .select('*')
        .eq('user_id', userId);

      userBundle.data.jobTargets = jobTargets || [];

      // Fetch comments
      const { data: comments } = await supabaseServer
        .from('resume_comments')
        .select('*')
        .in('resume_version_id', resumeVersions?.map(v => v.id) || []);

      userBundle.data.comments = comments || [];

      // Fetch batches and items
      const { data: batches } = await supabaseServer
        .from('resume_batches')
        .select('*')
        .eq('user_id', userId);

      const { data: batchItems } = await supabaseServer
        .from('resume_batch_items')
        .select('*')
        .in('batch_id', batches?.map(b => b.id) || []);

      userBundle.data.batches = batches || [];
      userBundle.data.batchItems = batchItems || [];

      // Fetch analytics (aggregated)
      const { data: analytics } = await supabaseServer
        .from('resume_events')
        .select('*')
        .eq('user_id', userId);

      userBundle.data.analytics = analytics || [];

      // Fetch consents
      const { data: consents } = await supabaseServer
        .from('consents')
        .select('*')
        .eq('user_id', userId);

      userBundle.data.consents = consents || [];

      // Fetch processing logs (redacted)
      const { data: processingLogs } = await supabaseServer
        .from('processing_logs')
        .select('*')
        .eq('user_id', userId);

      userBundle.data.processingLogs = processingLogs || [];

      // Fetch PII vault (decrypted)
      const piiVault = await vaultFetch(userId);
      userBundle.data.piiVault = piiVault;

      // Save to Supabase storage
      const fileName = `dsr/${userId}/${new Date().toISOString().split('T')[0]}_export.json`;
      const { data: uploadData, error: uploadError } = await supabaseServer.storage
        .from('resumes')
        .upload(fileName, JSON.stringify(userBundle, null, 2), {
          contentType: 'application/json',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Failed to upload export: ${uploadError.message}`);
      }

      // Create signed URL
      const { data: signedUrlData } = await supabaseServer.storage
        .from('resumes')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 1 week

      // Update DSR request
      await supabaseServer
        .from('dsr_requests')
        .update({
          status: 'done',
          result_url: signedUrlData?.signedUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', dsrRequest.id);

      // Log processing activity
      await logProcessing({
        userId,
        action: 'EXPORT',
        lawfulBasis: 'consent',
        subjectId: dsrRequest.id,
        metadata: {
          recordCount: Object.keys(userBundle.data).reduce((sum, key) => {
            return sum + (Array.isArray(userBundle.data[key]) ? userBundle.data[key].length : 1);
          }, 0),
        },
      });

      return NextResponse.json({
        success: true,
        requestId: dsrRequest.id,
        status: 'done',
        downloadUrl: signedUrlData?.signedUrl,
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
    console.error('Error in DSR export:', error);
    return NextResponse.json(
      { error: 'Internal server error during export' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    const { data: dsrRequest, error } = await supabaseServer
      .from('dsr_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', userId)
      .single();

    if (error || !dsrRequest) {
      return NextResponse.json(
        { error: 'DSR request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      requestId: dsrRequest.id,
      type: dsrRequest.type,
      status: dsrRequest.status,
      resultUrl: dsrRequest.result_url,
      createdAt: dsrRequest.created_at,
      updatedAt: dsrRequest.updated_at,
    });
  } catch (error) {
    console.error('Error fetching DSR status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
