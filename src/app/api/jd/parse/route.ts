import { NextRequest, NextResponse } from 'next/server';
import { extractFromJD } from '@/lib/ai';
import { z } from 'zod';

// TODO: Phase 2 - Add proper authentication and rate limiting
const ParseJDRequestSchema = z.object({
  url: z.string().url().optional(),
  jdText: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, jdText } = ParseJDRequestSchema.parse(body);

    if (!url && !jdText) {
      return NextResponse.json(
        { error: 'Either URL or JD text is required' },
        { status: 400 }
      );
    }

    let finalJdText = jdText;

    // If URL provided, fetch and extract text
    if (url && !jdText) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ResumeCoPilot/1.0)',
          },
        });
        
        if (!response.ok) {
          return NextResponse.json(
            { error: 'Failed to fetch job description from URL' },
            { status: 400 }
          );
        }

        const html = await response.text();
        // Basic text extraction - remove HTML tags and clean up
        finalJdText = html
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<style[^>]*>.*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Limit text length
        if (finalJdText.length > 20000) {
          finalJdText = finalJdText.substring(0, 20000) + '... [truncated]';
        }
      } catch (fetchError) {
        return NextResponse.json(
          { error: 'Failed to fetch job description from URL' },
          { status: 400 }
        );
      }
    }

    const result = await extractFromJD({ url, text: finalJdText });

    // Enhanced keyword extraction
    const enhancedKeywords = extractKeywords(finalJdText || '');

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        jdText: finalJdText,
        keywords: [...(result.keywords || []), ...enhancedKeywords].slice(0, 25), // Limit to 25
      },
    });
  } catch (error) {
    console.error('JD parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse job description' },
      { status: 500 }
    );
  }
}

/**
 * Extract keywords from job description text
 */
function extractKeywords(text: string): string[] {
  if (!text) return [];

  // Remove common words and extract meaningful tokens
  const commonWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'this', 'that', 'these', 'those', 'we', 'you', 'they', 'he', 'she', 'it',
    'our', 'your', 'their', 'his', 'her', 'its', 'my', 'me', 'us', 'them'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length >= 3 && 
      !commonWords.has(word) && 
      !/^\d+$/.test(word) // Exclude pure numbers
    );

  // Count frequency and return unique words
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}
