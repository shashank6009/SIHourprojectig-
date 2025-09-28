import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireConsent } from '@/lib/policy-gate';
import { logProcessing } from '@/lib/processing-log';

// TODO: Phase 2 - Add proper authentication (currently using mock userId)
const mockUserId = '00000000-0000-0000-0000-000000000000';

const ResumeDataSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    location: z.string().min(1),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }),
  summary: z.string().min(1),
  experience: z.array(z.object({
    company: z.string().min(1),
    position: z.string().min(1),
    duration: z.string().min(1),
    description: z.string(),
    achievements: z.array(z.string()),
  })),
  education: z.array(z.object({
    institution: z.string().min(1),
    degree: z.string().min(1),
    year: z.string().min(1),
    gpa: z.string().optional(),
    relevant_courses: z.array(z.string()).optional(),
  })),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    languages: z.array(z.string()).optional(),
  }),
  projects: z.array(z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    technologies: z.array(z.string()),
    link: z.string().url().optional(),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
  })).optional(),
});

const GenerateRequestSchema = z.object({
  resumeData: ResumeDataSchema,
  enhanceWithAI: z.boolean().optional().default(true),
  targetRole: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData, enhanceWithAI, targetRole } = GenerateRequestSchema.parse(body);

    // Check consent for LLM processing
    const consentCheck = await requireConsent(mockUserId, ['LLM_PROCESSING']);
    if (!consentCheck.ok) {
      return NextResponse.json(
        { 
          error: 'Consent required for AI processing',
          missingConsents: consentCheck.missing 
        },
        { status: 403 }
      );
    }

    // Log processing activity
    await logProcessing({
      userId: mockUserId,
      action: 'RESUME_GENERATION',
      lawfulBasis: 'consent',
      consentVersion: consentCheck.version,
      scopesUsed: ['LLM_PROCESSING'],
      metadata: {
        hasAIEnhancement: enhanceWithAI,
        targetRole,
        sectionsCount: {
          experience: resumeData.experience.length,
          education: resumeData.education.length,
          projects: resumeData.projects.length,
          skills: resumeData.skills.technical.length + resumeData.skills.soft.length,
        },
        region: consentCheck.region,
      },
    });

    // Enhance resume with AI if requested
    let enhancedResume = resumeData;
    
    if (enhanceWithAI) {
      enhancedResume = await enhanceResumeWithAI(resumeData, targetRole);
    }

    // Generate ATS score
    const atsScore = calculateATSScore(enhancedResume);

    // Create structured resume content
    const structuredResume = {
      ...enhancedResume,
      atsScore,
      generatedAt: new Date().toISOString(),
      version: '1.0',
      metadata: {
        enhancedWithAI: enhanceWithAI,
        targetRole,
        consentVersion: consentCheck.version,
        region: consentCheck.region,
      },
    };

    return NextResponse.json({
      success: true,
      data: structuredResume,
    });

  } catch (error) {
    console.error('Resume generation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function enhanceResumeWithAI(resumeData: any, targetRole?: string): Promise<any> {
  // TODO: Phase 3 - Replace with actual LLM calls
  // For now, we'll do basic enhancements
  
  const enhanced = { ...resumeData };

  // Enhance summary with target role context
  if (targetRole && enhanced.summary) {
    enhanced.summary = `${enhanced.summary} Seeking opportunities in ${targetRole} roles.`;
  }

  // Enhance experience descriptions with action verbs
  enhanced.experience = enhanced.experience.map((exp: any) => ({
    ...exp,
    description: enhanceDescription(exp.description),
    achievements: exp.achievements.map((achievement: string) => enhanceAchievement(achievement)),
  }));

  // Enhance project descriptions
  enhanced.projects = enhanced.projects.map((project: any) => ({
    ...project,
    description: enhanceDescription(project.description),
  }));

  return enhanced;
}

function enhanceDescription(description: string): string {
  if (!description) return description;
  
  // Add action verbs and make descriptions more impactful
  const actionVerbs = ['Developed', 'Implemented', 'Designed', 'Led', 'Managed', 'Optimized', 'Created', 'Built'];
  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  
  if (!description.toLowerCase().startsWith('developed') && 
      !description.toLowerCase().startsWith('implemented') &&
      !description.toLowerCase().startsWith('designed')) {
    return `${randomVerb} ${description.toLowerCase()}`;
  }
  
  return description;
}

function enhanceAchievement(achievement: string): string {
  if (!achievement) return achievement;
  
  // Add quantifiable results if not present
  if (!/\d+/.test(achievement)) {
    const quantifiers = ['significantly', 'by 25%', 'by 50%', 'by 100%', 'dramatically'];
    const randomQuantifier = quantifiers[Math.floor(Math.random() * quantifiers.length)];
    return `${achievement} ${randomQuantifier}`;
  }
  
  return achievement;
}

function calculateATSScore(resumeData: any): number {
  let score = 0;
  
  // Base score
  score += 20;
  
  // Personal info completeness
  if (resumeData.personalInfo.fullName) score += 10;
  if (resumeData.personalInfo.email) score += 10;
  if (resumeData.personalInfo.phone) score += 10;
  if (resumeData.personalInfo.location) score += 5;
  
  // Summary quality
  if (resumeData.summary && resumeData.summary.length > 50) score += 15;
  
  // Experience
  score += Math.min(resumeData.experience.length * 10, 30);
  
  // Education
  score += Math.min(resumeData.education.length * 5, 15);
  
  // Skills
  score += Math.min(resumeData.skills.technical.length * 2, 20);
  score += Math.min(resumeData.skills.soft.length * 1, 10);
  
  // Projects
  score += Math.min(resumeData.projects.length * 5, 15);
  
  // Bonus for having all sections
  if (resumeData.experience.length > 0 && 
      resumeData.education.length > 0 && 
      resumeData.skills.technical.length > 0) {
    score += 10;
  }
  
  return Math.min(score, 100);
}
