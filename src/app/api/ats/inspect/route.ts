import { NextRequest, NextResponse } from 'next/server';
import { analyzeJobURL } from '@/lib/ats';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const InspectRequestSchema = z.object({
  jdUrl: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jdUrl } = InspectRequestSchema.parse(body);

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Analyze the job URL
    const atsInfo = analyzeJobURL(jdUrl);

    // Track the ATS inspection
    await trackEvent({
      userId,
      event: 'ATS_CHECKLIST_VIEWED',
      metadata: {
        ats: atsInfo.ats,
        url: jdUrl,
      },
    });

    return NextResponse.json({
      ats: atsInfo.ats,
      applyUrl: atsInfo.applyUrl,
      checklist: atsInfo.checklist,
    });
  } catch (error) {
    console.error('Error inspecting ATS:', error);
    
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
