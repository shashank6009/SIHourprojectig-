import { NextRequest, NextResponse } from 'next/server';
import { purgeExpired, getRetentionStats } from '@/jobs/retention';

export async function POST(request: NextRequest) {
  try {
    // Check for cron key authorization
    const cronKey = request.headers.get('X-CRON-KEY');
    const expectedKey = process.env.CRON_KEY;

    if (!cronKey || cronKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Run retention job
    const result = await purgeExpired();

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in retention job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for cron key authorization
    const cronKey = request.headers.get('X-CRON-KEY');
    const expectedKey = process.env.CRON_KEY;

    if (!cronKey || cronKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get retention statistics
    const stats = await getRetentionStats();

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching retention stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
