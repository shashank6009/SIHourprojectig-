import { NextRequest, NextResponse } from 'next/server';
import { draftResume } from '@/lib/ai';
import { supabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';

// TODO: Phase 2 - Add proper authentication (currently using mock userId)
const mockUserId = '00000000-0000-0000-0000-000000000000';

const DraftResumeRequestSchema = z.object({
  profile: z.any(),
  targetRole: z.string().optional(),
  jd: z.object({
    skills: z.array(z.string()),
    keywords: z.array(z.string()),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, targetRole, jd } = DraftResumeRequestSchema.parse(body);

    // Generate resume content using AI
    const draftResult = await draftResume({ profile, targetRole, jd });

    // Create resume record
    const { data: resume, error: resumeError } = await supabaseServer
      .from('resumes')
      .insert({
        user_id: mockUserId,
        title: `${targetRole || 'Resume'} - ${new Date().toLocaleDateString()}`,
        target_role: targetRole,
        ats_score: Math.floor(Math.random() * 20) + 80, // Mock ATS score
      })
      .select()
      .single();

    if (resumeError) {
      throw resumeError;
    }

    // Create resume version
    const { data: version, error: versionError } = await supabaseServer
      .from('resume_versions')
      .insert({
        resume_id: resume.id,
        label: 'Initial Draft',
        content: draftResult.content,
        ats_score: Math.floor(Math.random() * 20) + 80, // Mock ATS score
      })
      .select()
      .single();

    if (versionError) {
      throw versionError;
    }

    return NextResponse.json({
      success: true,
      data: {
        resume,
        version,
        rationale: draftResult.rationale,
      },
    });
  } catch (error) {
    console.error('Resume draft error:', error);
    return NextResponse.json(
      { error: 'Failed to draft resume' },
      { status: 500 }
    );
  }
}
