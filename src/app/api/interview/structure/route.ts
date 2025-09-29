import { NextRequest, NextResponse } from 'next/server';
import { structureInterview } from '@/lib/ai';
import { supabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';
import { trackEvent } from '@/lib/analytics';
import { requireConsent, redactForModel } from '@/lib/policy-gate';
import { logProcessing } from '@/lib/processing-log';

// TODO: Phase 2 - Add proper authentication (currently using mock userId)
const mockUserId = '00000000-0000-0000-0000-000000000000';

const StructureInterviewRequestSchema = z.object({
  answers: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = StructureInterviewRequestSchema.parse(body);

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'At least one answer is required' },
        { status: 400 }
      );
    }

    // Check consent for LLM processing
    const consentCheck = await requireConsent(mockUserId, ['LLM_PROCESSING']);
    if (!consentCheck.ok) {
      return NextResponse.json(
        { 
          error: 'Consent required for LLM processing',
          missingConsents: consentCheck.missing 
        },
        { status: 403 }
      );
    }

    // Redact sensitive information from answers
    const redactedAnswers = answers.map(answer => redactForModel(answer));

    // Structure interview responses using AI
    const interviewResponse = await structureInterview({ answers: redactedAnswers });

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Log processing activity (only if Supabase is configured)
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      await logProcessing({
        userId: mockUserId,
        action: 'LLM_CALL',
        lawfulBasis: 'consent',
        consentVersion: consentCheck.version,
        scopesUsed: ['LLM_PROCESSING'],
        metadata: {
          answersCount: answers.length,
          region: consentCheck.region,
          redacted: true,
        },
      });
    }
    
    let resume, version;
    
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      // Create resume record
      const { data: resumeData, error: resumeError } = await supabaseServer
        .from('resumes')
        .insert({
          user_id: mockUserId,
          title: `Interview-Based Resume - ${new Date().toLocaleDateString()}`,
          target_role: 'Software Engineer', // Default role
          ats_score: Math.floor(Math.random() * 20) + 80, // Mock ATS score
        })
        .select()
        .single();

      if (resumeError) {
        throw resumeError;
      }
      resume = resumeData;

      // Create resume version with structured content
      const { data: versionData, error: versionError } = await supabaseServer
        .from('resume_versions')
        .insert({
          resume_id: resume.id,
          label: 'Interview Structure',
          content: interviewResponse,
          ats_score: Math.floor(Math.random() * 20) + 80, // Mock ATS score
        })
        .select()
        .single();

      if (versionError) {
        throw versionError;
      }
      version = versionData;
    } else {
      // Mock data when Supabase is not configured
      resume = {
        id: 'mock-resume-id',
        user_id: mockUserId,
        title: `Interview-Based Resume - ${new Date().toLocaleDateString()}`,
        target_role: 'Software Engineer',
        ats_score: Math.floor(Math.random() * 20) + 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      version = {
        id: 'mock-version-id',
        resume_id: resume.id,
        label: 'Interview Structure',
        content: interviewResponse,
        ats_score: Math.floor(Math.random() * 20) + 80,
        created_at: new Date().toISOString(),
      };
    }

    // Track interview completion event (only if Supabase is configured)
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      await trackEvent({
        userId: mockUserId,
        event: 'INTERVIEW_COMPLETED',
        resumeVersionId: version.id,
        metadata: {
          blocks: interviewResponse.blocks?.length || 0,
          answersCount: answers.length,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        resumeVersionId: version.id,
        content: interviewResponse,
        resume,
        version,
      },
    });
  } catch (error) {
    console.error('Interview structure error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to structure interview responses',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}
