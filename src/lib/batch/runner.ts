/**
 * Batch Processing Orchestrator
 * Handles processing of resume batches with AI coaching, PDF generation, and outreach content
 */

import React from 'react';
import { coachAndTailor } from "@/lib/ai";
import { renderPdfBuffer } from "@/lib/pdf/render";
import { normalizeJD } from "@/lib/jd/normalize";
import { generateCoverLetter, generateEmailTemplate, generateInMailTemplate } from "@/lib/prompts/outreach";
import { TemplateCoverLetter } from "@/lib/pdf/templates/cover";
import { pdf } from '@react-pdf/renderer';
import { supabaseServer } from "@/lib/supabase-server";
import { trackEvent, trackModelRun } from "@/lib/analytics";
import { InterviewResponse, ResumeBlock } from "@/types/resume";

interface ProcessBatchItemOptions {
  concurrency?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Process a single batch item
 */
export async function processBatchItem(itemId: string): Promise<void> {
  try {
    console.log(`Processing batch item: ${itemId}`);

    // 1) Load batch_item + the latest InterviewResponse blocks for this user
    const { data: item, error: itemError } = await supabaseServer
      .from('resume_batch_items')
      .select(`
        *,
        resume_batches!inner(user_id)
      `)
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      throw new Error(`Failed to load batch item: ${itemError?.message}`);
    }

    const userId = item.resume_batches.user_id;

    // Get the most recent resume version for this user
    const { data: resumeVersions, error: versionError } = await supabaseServer
      .from('resume_versions')
      .select('*')
      .eq('resume_id', (await getLatestResumeId(userId)))
      .order('created_at', { ascending: false })
      .limit(1);

    if (versionError || !resumeVersions || resumeVersions.length === 0) {
      throw new Error(`No resume versions found for user: ${versionError?.message}`);
    }

    const latestVersion = resumeVersions[0];
    const blocks = latestVersion.content?.blocks || [];

    if (blocks.length === 0) {
      throw new Error('No resume blocks found in the latest version');
    }

    // 2) Normalize JD → {company, role, jdText, keywords}
    const normalizedJD = await normalizeJD({
      url: item.jd_url,
      text: item.jd_text,
    });

    // Update item with normalized data
    await supabaseServer
      .from('resume_batch_items')
      .update({
        company: normalizedJD.company || item.company,
        role: normalizedJD.role || item.role,
        jd_text: normalizedJD.jdText,
        keywords: normalizedJD.keywords,
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    // 3) coachAndTailor(blocks, jd) → rewrittenBlocks, atsScore, gapSuggestions
    const coachingResult = await coachAndTailor({
      blocks: blocks as ResumeBlock[],
      jd: {
        text: normalizedJD.jdText,
        keywords: normalizedJD.keywords,
      },
    });

    // 4) Create new ResumeVersion labeled `Tailored for <company|role>`
    const tailoredVersion = {
      resume_id: latestVersion.resume_id,
      label: `Tailored for ${normalizedJD.company || normalizedJD.role || 'Position'}`,
      content: {
        blocks: coachingResult.rewrittenBlocks.map(block => ({
          id: block.id,
          type: 'experience' as const,
          title: 'Tailored Experience',
          details: block.bullets,
        })),
        rationale: `Tailored for ${normalizedJD.company || normalizedJD.role || 'position'} based on job requirements`,
        tailoredContent: {
          rewrittenBlocks: coachingResult.rewrittenBlocks,
          atsScore: coachingResult.atsScore,
          gapSuggestions: coachingResult.gapSuggestions,
          jdKeywords: normalizedJD.keywords,
          jdText: normalizedJD.jdText,
        },
      } as InterviewResponse,
      ats_score: coachingResult.atsScore,
      created_at: new Date().toISOString(),
    };

    const { data: newVersion, error: versionCreateError } = await supabaseServer
      .from('resume_versions')
      .insert(tailoredVersion)
      .select()
      .single();

    if (versionCreateError || !newVersion) {
      throw new Error(`Failed to create tailored version: ${versionCreateError?.message}`);
    }

    // 5) Generate cover letter text via AI
    const coverLetterText = await generateCoverLetter(
      blocks,
      normalizedJD.jdText,
      normalizedJD.company,
      normalizedJD.role
    );

    // Track model run for cover letter generation
    await trackModelRun({
      userId,
      resumeVersionId: newVersion.id,
      provider: 'openai', // TODO: Get from AI config
      model: 'gpt-4o-mini', // TODO: Get from AI config
      promptKey: `SYSTEM_COVER@${new Date().toISOString().split('T')[0]}`,
      atsScore: coachingResult.atsScore,
    });

    // 6) Render PDFs
    // a) Resume PDF using chosen template ("classic" default)
    const resumePdfBuffer = await renderPdfBuffer({
      content: newVersion.content,
      options: { template: 'classic' },
      meta: {
        fullName: 'Your Name', // TODO: Get from user profile
        targetRole: normalizedJD.role,
      },
    });

    // b) Cover letter → new minimal PDF template
    const coverPdfDoc = pdf(
      React.createElement(TemplateCoverLetter, {
        text: coverLetterText,
        meta: {
          name: 'Your Name', // TODO: Get from user profile
          contact: {
            email: 'your.email@example.com',
            phone: '+1 (555) 123-4567',
          },
        },
      })
    );
    const coverPdfBuffer = await coverPdfDoc.toBuffer();

    // 7) Store PDFs to Supabase storage; collect signed URLs
    const resumePdfPath = `resumes/${userId}/${itemId}/resume.pdf`;
    const coverPdfPath = `resumes/${userId}/${itemId}/cover.pdf`;

    // Upload resume PDF
    const { error: resumeUploadError } = await supabaseServer.storage
      .from('resumes')
      .upload(resumePdfPath, resumePdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (resumeUploadError) {
      throw new Error(`Failed to upload resume PDF: ${resumeUploadError.message}`);
    }

    // Upload cover letter PDF
    const { error: coverUploadError } = await supabaseServer.storage
      .from('resumes')
      .upload(coverPdfPath, coverPdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (coverUploadError) {
      throw new Error(`Failed to upload cover letter PDF: ${coverUploadError.message}`);
    }

    // Get signed URLs
    const { data: resumeUrl } = supabaseServer.storage
      .from('resumes')
      .getPublicUrl(resumePdfPath);

    const { data: coverUrl } = supabaseServer.storage
      .from('resumes')
      .getPublicUrl(coverPdfPath);

    // 8) Compose outreach texts
    const emailText = generateEmailTemplate(
      normalizedJD.company,
      normalizedJD.role,
      coachingResult.rewrittenBlocks.slice(0, 3).map(block => block.bullets[0])
    );

    const inmailText = generateInMailTemplate(
      normalizedJD.company,
      normalizedJD.role,
      coachingResult.rewrittenBlocks[0]?.bullets[0]
    );

    // 9) Update batch_item: status=done, ats_score, resume_version_id, assets
    const assets = {
      resumePdf: resumeUrl.publicUrl,
      coverPdf: coverUrl.publicUrl,
      emailTxt: emailText,
      inmailTxt: inmailText,
    };

    const { error: updateError } = await supabaseServer
      .from('resume_batch_items')
      .update({
        status: 'done',
        ats_score: coachingResult.atsScore,
        resume_version_id: newVersion.id,
        assets,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    if (updateError) {
      throw new Error(`Failed to update batch item: ${updateError.message}`);
    }

    // Track batch item completion
    await trackEvent({
      userId,
      event: 'BATCH_ITEM_COMPLETED',
      resumeVersionId: newVersion.id,
      metadata: {
        atsScore: coachingResult.atsScore,
        company: normalizedJD.company,
        role: normalizedJD.role,
        batchId: item.batch_id,
      },
    });

    // 10) Optional: POST to N8N_WEBHOOK_URL with item payload
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemId,
            company: normalizedJD.company,
            role: normalizedJD.role,
            atsScore: coachingResult.atsScore,
            assets,
            status: 'completed',
          }),
        });
      } catch (webhookError) {
        console.warn('Failed to send webhook notification:', webhookError);
        // Don't fail the entire process for webhook errors
      }
    }

    console.log(`Successfully processed batch item: ${itemId}`);
  } catch (error) {
    console.error(`Error processing batch item ${itemId}:`, error);

    // Update item with error status
    await supabaseServer
      .from('resume_batch_items')
      .update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    throw error;
  }
}

/**
 * Run batch processing with concurrency control
 */
export async function runBatch(
  batchId: string,
  opts: ProcessBatchItemOptions = {}
): Promise<void> {
  const { concurrency = 2, maxRetries = 3, retryDelay = 1000 } = opts;

  try {
    // Update batch status to running
    await supabaseServer
      .from('resume_batches')
      .update({
        status: 'running',
        updated_at: new Date().toISOString(),
      })
      .eq('id', batchId);

    // Get queued items
    const { data: items, error: itemsError } = await supabaseServer
      .from('resume_batch_items')
      .select('id')
      .eq('batch_id', batchId)
      .eq('status', 'queued')
      .order('created_at', { ascending: true });

    if (itemsError || !items) {
      throw new Error(`Failed to load batch items: ${itemsError?.message}`);
    }

    console.log(`Processing ${items.length} items in batch ${batchId} with concurrency ${concurrency}`);

    // Process items with concurrency control
    const results = await processWithConcurrency(
      items.map(item => item.id),
      processBatchItem,
      concurrency,
      maxRetries,
      retryDelay
    );

    // Update batch statistics
    const processed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    const finalStatus = failed === 0 ? 'completed' : (processed > 0 ? 'completed' : 'failed');

    await supabaseServer
      .from('resume_batches')
      .update({
        status: finalStatus,
        processed,
        failed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', batchId);

    console.log(`Batch ${batchId} completed: ${processed} processed, ${failed} failed`);
  } catch (error) {
    console.error(`Error running batch ${batchId}:`, error);

    // Update batch status to failed
    await supabaseServer
      .from('resume_batches')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', batchId);

    throw error;
  }
}

/**
 * Helper function to get the latest resume ID for a user
 */
async function getLatestResumeId(userId: string): Promise<string> {
  const { data: resumes, error } = await supabaseServer
    .from('resumes')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !resumes || resumes.length === 0) {
    throw new Error(`No resumes found for user: ${error?.message}`);
  }

  return resumes[0].id;
}

/**
 * Process items with concurrency control and retry logic
 */
async function processWithConcurrency<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  concurrency: number,
  maxRetries: number,
  retryDelay: number
): Promise<{ success: boolean; item: T; error?: Error }[]> {
  const results: { success: boolean; item: T; error?: Error }[] = [];
  const queue = [...items];

  const processItem = async (item: T): Promise<void> => {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await processor(item);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          console.log(`Retry ${attempt}/${maxRetries} for item:`, item);
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    }
    
    throw lastError;
  };

  const workers: Promise<void>[] = [];
  
  for (let i = 0; i < concurrency; i++) {
    workers.push(
      (async () => {
        while (queue.length > 0) {
          const item = queue.shift();
          if (!item) break;

          try {
            await processItem(item);
            results.push({ success: true, item });
          } catch (error) {
            results.push({
              success: false,
              item,
              error: error instanceof Error ? error : new Error('Unknown error'),
            });
          }
        }
      })()
    );
  }

  await Promise.all(workers);
  return results;
}
