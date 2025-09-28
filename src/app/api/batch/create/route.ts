import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const CreateBatchRequestSchema = z.object({
  label: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label } = CreateBatchRequestSchema.parse(body);

    // Get user from session (you'll need to implement proper auth)
    // For now, using a placeholder user ID
    const userId = 'placeholder-user-id'; // TODO: Get from auth session

    // Create batch
    const { data: batch, error } = await supabaseServer
      .from('resume_batches')
      .insert({
        user_id: userId,
        label,
        total: 0,
        processed: 0,
        failed: 0,
        status: 'created',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating batch:', error);
      return NextResponse.json(
        { error: 'Failed to create batch' },
        { status: 500 }
      );
    }

    // Track batch creation
    await trackEvent({
      userId,
      event: 'BATCH_CREATED',
      metadata: {
        batchId: batch.id,
        label: batch.label,
      },
    });

    return NextResponse.json({
      batchId: batch.id,
      label: batch.label,
      status: batch.status,
      createdAt: batch.created_at,
    });
  } catch (error) {
    console.error('Error in create batch:', error);
    
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
