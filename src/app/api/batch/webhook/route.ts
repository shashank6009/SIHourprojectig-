import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';

const WebhookRequestSchema = z.object({
  itemId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = WebhookRequestSchema.parse(body);

    // Get batch item
    const { data: item, error: itemError } = await supabaseServer
      .from('resume_batch_items')
      .select(`
        *,
        resume_batches!inner(user_id)
      `)
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Batch item not found' },
        { status: 404 }
      );
    }

    if (item.status !== 'done') {
      return NextResponse.json(
        { error: 'Batch item is not completed' },
        { status: 400 }
      );
    }

    // Send webhook notification
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    const webhookPayload = {
      itemId: item.id,
      batchId: item.batch_id,
      company: item.company,
      role: item.role,
      atsScore: item.ats_score,
      assets: item.assets,
      status: item.status,
      completedAt: item.updated_at,
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook notification sent successfully',
      itemId,
    });
  } catch (error) {
    console.error('Error in webhook:', error);
    
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
