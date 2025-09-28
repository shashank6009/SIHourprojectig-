import { NextRequest, NextResponse } from 'next/server';
import { pushCalendarEvent, trackCalendarEvent } from '@/lib/push';
import { z } from 'zod';

const CalendarRequestSchema = z.object({
  title: z.string().min(1),
  datetimeISO: z.string().datetime(),
  notes: z.string().optional(),
  attendees: z.array(z.string().email()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, datetimeISO, notes, attendees = [] } = CalendarRequestSchema.parse(body);

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Calculate end time (default 30 minutes)
    const startDate = new Date(datetimeISO);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    // Push calendar event
    const result = await pushCalendarEvent({
      userId,
      title,
      startISO: datetimeISO,
      endISO: endDate.toISOString(),
      description: notes,
      attendees,
    });

    // Track the event
    await trackCalendarEvent(userId, result);

    // Update batch item outreach status if this is a follow-up
    try {
      const { data: batchItems } = await supabaseServer
        .from('resume_batch_items')
        .select('id, assets')
        .eq('user_id', userId)
        .eq('status', 'done')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (batchItems && batchItems.length > 0) {
        const batchItem = batchItems[0];
        const assets = batchItem.assets as any || {};
        const trackerEvents = assets.trackerEvents || [];
        
        trackerEvents.push({
          status: 'Follow-up Scheduled',
          timestamp: new Date().toISOString(),
          provider: result.provider,
          eventId: result.id,
          scheduledDate: datetimeISO,
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
      console.warn('Failed to update batch item follow-up status:', error);
    }

    return NextResponse.json({
      ok: true,
      provider: result.provider,
      eventId: result.id,
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    
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
