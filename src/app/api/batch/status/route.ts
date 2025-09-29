import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';

const StatusRequestSchema = z.object({
  batchId: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json(
        { error: 'batchId parameter is required' },
        { status: 400 }
      );
    }

    // Verify batch exists and belongs to user
    const { data: batch, error: batchError } = await supabaseServer
      .from('resume_batches')
      .select('*')
      .eq('id', batchId)
      .single();

    if (batchError || !batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Get batch items
    const { data: items, error: itemsError } = await supabaseServer
      .from('resume_batch_items')
      .select('id, company, role, status, ats_score, assets, error, created_at, updated_at')
      .eq('batch_id', batchId)
      .order('created_at', { ascending: true });

    if (itemsError) {
      console.error('Error fetching batch items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch batch items' },
        { status: 500 }
      );
    }

    // Calculate summary statistics
    const summary = {
      total: batch.total,
      processed: batch.processed,
      failed: batch.failed,
      queued: items?.filter(item => item.status === 'queued').length || 0,
      processing: items?.filter(item => item.status === 'processing').length || 0,
      done: items?.filter(item => item.status === 'done').length || 0,
      status: batch.status,
      createdAt: batch.created_at,
      updatedAt: batch.updated_at,
    };

    // Format items for response
    const formattedItems = items?.map(item => ({
      id: item.id,
      company: item.company,
      role: item.role,
      status: item.status,
      atsScore: item.ats_score,
      assets: item.assets,
      error: item.error,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) || [];

    return NextResponse.json({
      summary,
      items: formattedItems,
    });
  } catch (error) {
    console.error('Error in batch status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
