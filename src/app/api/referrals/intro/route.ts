import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { pushEmailDraft, trackEmailDraft } from '@/lib/push';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const IntroRequestSchema = z.object({
  referralId: z.string().uuid(),
  company: z.string().min(1),
  role: z.string().min(1),
  recruiterEmail: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralId, company, role, recruiterEmail } = IntroRequestSchema.parse(body);

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Get referral details
    const { data: referral, error: referralError } = await supabaseServer
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .eq('user_id', userId)
      .single();

    if (referralError || !referral) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    // Generate intro message using template
    const defaultMessage = process.env.REFERRAL_DEFAULT_MESSAGE || 
      "Hi <Name>, could you intro me to <Recruiter> for <Company> - <Role>? I've attached a tailored resume.";

    const subject = `Introduction request for ${role} at ${company}`;
    const emailBody = defaultMessage
      .replace(/<Name>/g, referral.person_name)
      .replace(/<Recruiter>/g, recruiterEmail || 'the hiring team')
      .replace(/<Company>/g, company)
      .replace(/<Role>/g, role);

    // If recruiter email provided, send draft
    let draftResult = null;
    if (recruiterEmail) {
      draftResult = await pushEmailDraft({
        userId,
        to: recruiterEmail,
        subject,
        body: emailBody,
        attachments: [], // Could add resume attachments here
      });

      await trackEmailDraft(userId, draftResult, 0);
    }

    // Track the intro draft event
    await trackEvent({
      userId,
      event: 'REFERRAL_INTRO_DRAFTED',
      metadata: {
        referralId,
        company,
        role,
        hasRecruiterEmail: !!recruiterEmail,
        draftProvider: draftResult?.provider || 'none',
      },
    });

    return NextResponse.json({
      subject,
      body: emailBody,
      draftResult,
    });
  } catch (error) {
    console.error('Error creating intro draft:', error);
    
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
