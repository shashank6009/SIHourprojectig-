import { NextRequest, NextResponse } from 'next/server';
import { coachAndTailor } from '@/lib/ai';
import { supabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';
import { trackEvent } from '@/lib/analytics';
import { requireConsent, redactForModel, enforceRegion } from '@/lib/policy-gate';
import { logProcessing } from '@/lib/processing-log';

// TODO: Phase 2 - Add proper authentication (currently using mock userId)
const mockUserId = '00000000-0000-0000-0000-000000000000';

const TailorRequestSchema = z.object({
  resumeVersionId: z.string().uuid(),
  jd: z.object({
    url: z.string().url().optional(),
    text: z.string().optional(),
    skills: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeVersionId, jd } = TailorRequestSchema.parse(body);

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

    // Check region enforcement
    const regionEnforcement = enforceRegion('openai', consentCheck.region);
    if (regionEnforcement === 'deny') {
      return NextResponse.json(
        { error: 'LLM processing not allowed in your region' },
        { status: 403 }
      );
    }

    // Look up the base ResumeVersion
    const { data: baseVersion, error: versionError } = await supabaseServer
      .from('resume_versions')
      .select('*, resumes(*)')
      .eq('id', resumeVersionId)
      .single();

    if (versionError || !baseVersion) {
      return NextResponse.json(
        { error: 'Resume version not found' },
        { status: 404 }
      );
    }

    // Resolve JD text and keywords
    let jdText = jd.text;
    let keywords = jd.keywords || [];

    if (jd.url && !jdText) {
      try {
        const response = await fetch(jd.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ResumeCoPilot/1.0)',
          },
        });
        
        if (response.ok) {
          const html = await response.text();
          jdText = html
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<style[^>]*>.*?<\/style>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (jdText.length > 20000) {
            jdText = jdText.substring(0, 20000) + '... [truncated]';
          }
        }
      } catch (fetchError) {
        console.error('Failed to fetch JD from URL:', fetchError);
      }
    }

    if (!jdText) {
      return NextResponse.json(
        { error: 'Job description text is required' },
        { status: 400 }
      );
    }

    // Extract keywords if not provided
    if (keywords.length === 0) {
      const words = jdText
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= 3)
        .filter(word => !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word));

      const wordCount = new Map<string, number>();
      words.forEach(word => {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      });

      keywords = Array.from(wordCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([word]) => word);
    }

    // Get blocks from the base version
    const blocks = baseVersion.content?.blocks || [];
    if (blocks.length === 0) {
      return NextResponse.json(
        { error: 'No resume blocks found in the base version' },
        { status: 400 }
      );
    }

    // Limit blocks to prevent excessive processing
    const limitedBlocks = blocks.slice(0, 20);

    // Redact sensitive information
    const redactedJdText = redactForModel(jdText);
    const redactedBlocks = limitedBlocks.map(block => ({
      ...block,
      details: block.details?.map(detail => redactForModel(detail)) || []
    }));

    // Call AI coaching (or use local fallback if region enforcement requires it)
    let coachingResult;
    if (regionEnforcement === 'route_local') {
      // Use local heuristic fallback
      coachingResult = {
        rewrittenBlocks: redactedBlocks.map(block => ({
          id: block.id,
          bullets: block.details || [],
          matchedKeywords: keywords.slice(0, 3),
          missingKeywords: keywords.slice(3, 6),
        })),
        atsScore: 75, // Default score for local processing
        gapSuggestions: ['Consider adding more relevant keywords from the job description'],
      };
    } else {
      coachingResult = await coachAndTailor({
        blocks: redactedBlocks,
        jd: { text: redactedJdText, keywords },
      });
    }

    // Log processing activity
    await logProcessing({
      userId: mockUserId,
      action: 'LLM_CALL',
      lawfulBasis: 'consent',
      consentVersion: consentCheck.version,
      scopesUsed: ['LLM_PROCESSING'],
      subjectId: resumeVersionId,
      metadata: {
        region: consentCheck.region,
        regionEnforcement,
        redacted: true,
        blocksCount: limitedBlocks.length,
        jdLength: jdText.length,
      },
    });

    // Create tailored content
    const tailoredContent = {
      rewrittenBlocks: coachingResult.rewrittenBlocks,
      atsScore: coachingResult.atsScore,
      gapSuggestions: coachingResult.gapSuggestions,
      jdKeywords: keywords,
      jdText,
    };

    // Create new ResumeVersion with tailored content
    const versionLabel = `Tailored for ${keywords.slice(0, 3).join(', ')}` || 'Tailored Version';
    
    const { data: newVersion, error: newVersionError } = await supabaseServer
      .from('resume_versions')
      .insert({
        resume_id: baseVersion.resume_id,
        label: versionLabel,
        content: {
          ...baseVersion.content,
          tailoredContent,
        },
        ats_score: coachingResult.atsScore,
      })
      .select()
      .single();

    if (newVersionError) {
      throw newVersionError;
    }

    // Track JD alignment event
    const totalMatched = coachingResult.rewrittenBlocks.reduce((sum, block) => sum + block.matchedKeywords.length, 0);
    const totalMissing = coachingResult.rewrittenBlocks.reduce((sum, block) => sum + block.missingKeywords.length, 0);

    await trackEvent({
      userId: mockUserId,
      event: 'JD_ALIGNED',
      resumeVersionId: newVersion.id,
      metadata: {
        atsScore: coachingResult.atsScore,
        matchedKeywords: totalMatched,
        missingKeywords: totalMissing,
        blocksCount: coachingResult.rewrittenBlocks.length,
        jdKeywordsCount: keywords.length,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        newVersionId: newVersion.id,
        atsScore: coachingResult.atsScore,
        rewrittenBlocks: coachingResult.rewrittenBlocks,
        gapSuggestions: coachingResult.gapSuggestions,
        jdKeywords: keywords,
        versionLabel,
      },
    });
  } catch (error) {
    console.error('Tailor error:', error);
    return NextResponse.json(
      { error: 'Failed to tailor resume' },
      { status: 500 }
    );
  }
}
