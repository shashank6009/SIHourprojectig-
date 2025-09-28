import { NextRequest, NextResponse } from 'next/server';
import { pushEmailDraft, trackEmailDraft } from '@/lib/push';
import { supabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';
import { requireConsent } from '@/lib/policy-gate';
import { logProcessing } from '@/lib/processing-log';

const DraftRequestSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  attachments: z.array(z.object({
    filename: z.string(),
    url: z.string().url(),
  })).optional(),
  resumeVersionId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { to, subject, body, attachments = [], resumeVersionId } = DraftRequestSchema.parse(requestBody);

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Check consent for outreach email
    const consentCheck = await requireConsent(userId, ['OUTREACH_EMAIL']);
    if (!consentCheck.ok) {
      return NextResponse.json(
        { 
          error: 'Consent required for email outreach',
          missingConsents: consentCheck.missing 
        },
        { status: 403 }
      );
    }

    let finalAttachments = attachments;

    // If resumeVersionId provided, fetch resume assets
    if (resumeVersionId) {
      try {
        const { data: version, error } = await supabaseServer
          .from('resume_versions')
          .select('content')
          .eq('id', resumeVersionId)
          .single();

        if (!error && version) {
          // Add resume and cover letter links as attachments
          finalAttachments = [
            ...attachments,
            {
              filename: 'resume.pdf',
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${userId}/${resumeVersionId}/resume.pdf`,
            },
            {
              filename: 'cover_letter.pdf',
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${userId}/${resumeVersionId}/cover.pdf`,
            },
          ];
        }
      } catch (error) {
        console.warn('Failed to fetch resume assets:', error);
      }
    }

    // Push email draft
    const result = await pushEmailDraft({
      userId,
      to,
      subject,
      body,
      attachments: finalAttachments,
    });

    // Track the event
    await trackEmailDraft(userId, result, finalAttachments.length);

    // Log processing activity
    await logProcessing({
      userId,
      action: 'EMAIL_DRAFT',
      lawfulBasis: 'consent',
      consentVersion: consentCheck.version,
      scopesUsed: ['OUTREACH_EMAIL'],
      subjectId: resumeVersionId,
      metadata: {
        region: consentCheck.region,
        provider: result.provider,
        attachmentCount: finalAttachments.length,
      },
    });

    // Update batch item outreach status if resumeVersionId provided
    if (resumeVersionId) {
      try {
        const { data: batchItem } = await supabaseServer
          .from('resume_batch_items')
          .select('id, assets')
          .eq('resume_version_id', resumeVersionId)
          .single();

        if (batchItem) {
          const assets = batchItem.assets as any || {};
          const trackerEvents = assets.trackerEvents || [];
          
          trackerEvents.push({
            status: 'Outreach Drafted',
            timestamp: new Date().toISOString(),
            provider: result.provider,
            draftId: result.id,
          });

          await supabaseServer
            .from('resume_batch_items')
            .update({
              assets: { ...assets, trackerEvents },
              updated_at: new Date().toISOString(),
            })
            .eq('id', batchItem.id);
        }
      } catch (error) {
        console.warn('Failed to update batch item outreach status:', error);
      }
    }

    return NextResponse.json({
      ok: true,
      provider: result.provider,
      draftId: result.id,
    });
  } catch (error) {
    console.error('Error creating email draft:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
