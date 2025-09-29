import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { runBatch } from '@/lib/batch/runner';
import { z } from 'zod';

const RunBatchRequestSchema = z.object({
  batchId: z.string().uuid(),
  concurrency: z.number().int().min(1).max(5).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, concurrency = 2 } = RunBatchRequestSchema.parse(body);

    // Verify batch exists and belongs to user
    const { data: batch, error: batchError } = await supabaseServer
      .from('resume_batches')
      .select('id, user_id, status, total')
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

    if (batch.total === 0) {
      return NextResponse.json(
        { error: 'Batch has no items to process' },
        { status: 400 }
      );
    }

    // Start batch processing asynchronously
    setImmediate(async () => {
      try {
        await runBatch(batchId, { concurrency });
      } catch (error) {
        console.error(`Error running batch ${batchId}:`, error);
      }
    });

    return NextResponse.json({
      started: true,
      batchId,
      concurrency,
      message: 'Batch processing started',
    });
  } catch (error) {
    console.error('Error in run batch:', error);
    
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
