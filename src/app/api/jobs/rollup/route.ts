import { NextRequest, NextResponse } from 'next/server';
import { rollupMetricsForDay } from '@/jobs/metrics-rollup';

export async function POST(req: NextRequest) {
  try {
    // Validate cron key for security
    const cronKey = req.headers.get('X-CRON-KEY');
    const expectedKey = process.env.CRON_KEY;
    
    if (!expectedKey) {
      return NextResponse.json(
        { error: 'CRON_KEY not configured' },
        { status: 500 }
      );
    }
    
    if (cronKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid cron key' },
        { status: 401 }
      );
    }

    // Get date from request body or default to yesterday
    const body = await req.json().catch(() => ({}));
    const targetDate = body.date;

    // Roll up metrics for the specified date (or yesterday if not provided)
    const result = await rollupMetricsForDay(targetDate);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Rollup job error:', error);
    return NextResponse.json(
      { error: 'Failed to run rollup job' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Allow manual trigger for testing (with same security)
    const cronKey = req.headers.get('X-CRON-KEY');
    const expectedKey = process.env.CRON_KEY;
    
    if (!expectedKey) {
      return NextResponse.json(
        { error: 'CRON_KEY not configured' },
        { status: 500 }
      );
    }
    
    if (cronKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid cron key' },
        { status: 401 }
      );
    }

    // Get date from query params
    const url = new URL(req.url);
    const targetDate = url.searchParams.get('date');

    // Roll up metrics
    const result = await rollupMetricsForDay(targetDate || undefined);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Rollup job error:', error);
    return NextResponse.json(
      { error: 'Failed to run rollup job' },
      { status: 500 }
    );
  }
}
