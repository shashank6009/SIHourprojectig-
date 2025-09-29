import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { normalizeJD } from '@/lib/jd/normalize';
import { z } from 'zod';

const IngestBatchRequestSchema = z.object({
  batchId: z.string().uuid(),
  items: z.array(z.object({
    url: z.string().url().optional(),
    text: z.string().optional(),
    company: z.string().optional(),
    role: z.string().optional(),
  })).min(1).max(parseInt(process.env.BATCH_MAX_ITEMS || '25')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, items } = IngestBatchRequestSchema.parse(body);

    // Verify batch exists and belongs to user
    const { data: batch, error: batchError } = await supabaseServer
      .from('resume_batches')
      .select('id, user_id, status')
      .eq('id', batchId)
      .single();

    if (batchError || !batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    if (batch.status !== 'created') {
      return NextResponse.json(
        { error: 'Batch is not in created status' },
        { status: 400 }
      );
    }

    // Deduplicate items by URL
    const uniqueItems = items.filter((item, index, self) => 
      !item.url || self.findIndex(i => i.url === item.url) === index
    );

    const batchItems = [];
    const errors = [];

    // Process each item
    for (const item of uniqueItems) {
      try {
        // Normalize JD if URL provided
        let normalizedData = {
          company: item.company,
          role: item.role,
          jdText: item.text,
          keywords: [] as string[],
        };

        if (item.url && !item.text) {
          try {
            const normalized = await normalizeJD({ url: item.url });
            normalizedData = {
              company: normalized.company || item.company,
              role: normalized.role || item.role,
              jdText: normalized.jdText,
              keywords: normalized.keywords,
            };
          } catch (normalizeError) {
            errors.push({
              item: item,
              error: `Failed to normalize JD: ${normalizeError instanceof Error ? normalizeError.message : 'Unknown error'}`,
            });
            continue;
          }
        } else if (item.text) {
          // Extract keywords from provided text
          const normalized = await normalizeJD({ text: item.text });
          normalizedData.keywords = normalized.keywords;
        }

        batchItems.push({
          batch_id: batchId,
          company: normalizedData.company,
          role: normalizedData.role,
          jd_url: item.url,
          jd_text: normalizedData.jdText,
          keywords: normalizedData.keywords,
          status: 'queued',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (itemError) {
        errors.push({
          item: item,
          error: `Failed to process item: ${itemError instanceof Error ? itemError.message : 'Unknown error'}`,
        });
      }
    }

    // Insert batch items
    if (batchItems.length > 0) {
      const { error: insertError } = await supabaseServer
        .from('resume_batch_items')
        .insert(batchItems);

      if (insertError) {
        console.error('Error inserting batch items:', insertError);
        return NextResponse.json(
          { error: 'Failed to insert batch items' },
          { status: 500 }
        );
      }
    }

    // Update batch total count
    const { error: updateError } = await supabaseServer
      .from('resume_batches')
      .update({
        total: batchItems.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', batchId);

    if (updateError) {
      console.error('Error updating batch total:', updateError);
    }

    return NextResponse.json({
      success: true,
      totalItems: batchItems.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully ingested ${batchItems.length} items${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
    });
  } catch (error) {
    console.error('Error in ingest batch:', error);
    
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
