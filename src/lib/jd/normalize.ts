/**
 * JD Normalization Module
 * Handles URL fetching, text extraction, and keyword extraction for job descriptions
 */

export interface NormalizedJD {
  company?: string;
  role?: string;
  jdText: string;
  keywords: string[];
}

/**
 * Extract text from HTML content
 */
function extractTextFromHTML(html: string): string {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract company name from HTML or text using heuristics
 */
function extractCompany(html: string, text: string): string | undefined {
  // Try to extract from title tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1].toLowerCase();
    // Common patterns: "Software Engineer at Company Name", "Company Name - Job Title"
    const atMatch = title.match(/(?:at|@)\s*([^|\-\n]+)/);
    if (atMatch) {
      return atMatch[1].trim().replace(/[^\w\s]/g, '').trim();
    }
    
    const dashMatch = title.match(/^([^|\-\n]+)\s*[-|]/);
    if (dashMatch) {
      return dashMatch[1].trim().replace(/[^\w\s]/g, '').trim();
    }
  }

  // Try to extract from h1 tag
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    const h1 = h1Match[1].toLowerCase();
    const atMatch = h1.match(/(?:at|@)\s*([^|\-\n]+)/);
    if (atMatch) {
      return atMatch[1].trim().replace(/[^\w\s]/g, '').trim();
    }
  }

  // Try to extract from meta description
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaMatch) {
    const meta = metaMatch[1].toLowerCase();
    const atMatch = meta.match(/(?:at|@)\s*([^|\-\n]+)/);
    if (atMatch) {
      return atMatch[1].trim().replace(/[^\w\s]/g, '').trim();
    }
  }

  // Fallback: look for common company patterns in text
  const companyPatterns = [
    /(?:at|@)\s*([A-Z][a-zA-Z\s&]+(?:Inc|Corp|LLC|Ltd|Company|Technologies|Systems|Solutions|Group|Partners)?)/i,
    /([A-Z][a-zA-Z\s&]+(?:Inc|Corp|LLC|Ltd|Company|Technologies|Systems|Solutions|Group|Partners)?)\s*(?:is|seeks|looking)/i,
  ];

  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match && match[1].length > 2 && match[1].length < 50) {
      return match[1].trim();
    }
  }

  return undefined;
}

/**
 * Extract role/job title from HTML or text using heuristics
 */
function extractRole(html: string, text: string): string | undefined {
  // Try to extract from title tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    // Common patterns: "Software Engineer at Company", "Company - Software Engineer"
    const roleMatch = title.match(/^([^|@\-]+?)(?:\s*(?:at|@|\-))/);
    if (roleMatch) {
      return roleMatch[1].trim();
    }
    
    const dashMatch = title.match(/[^\-\|]+[\-\|]\s*([^\-\|]+)/);
    if (dashMatch) {
      return dashMatch[1].trim();
    }
  }

  // Try to extract from h1 tag
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    const h1 = h1Match[1];
    const roleMatch = h1.match(/^([^|@\-]+?)(?:\s*(?:at|@|\-))/);
    if (roleMatch) {
      return roleMatch[1].trim();
    }
  }

  // Fallback: look for common job title patterns in text
  const jobTitlePatterns = [
    /(?:position|role|title)[:\s]+([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator|Director|Lead|Senior|Junior)?)/i,
    /(?:looking for|seeking|hiring)\s+([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator|Director|Lead|Senior|Junior)?)/i,
  ];

  for (const pattern of jobTitlePatterns) {
    const match = text.match(pattern);
    if (match && match[1].length > 3 && match[1].length < 50) {
      return match[1].trim();
    }
  }

  return undefined;
}

/**
 * Extract keywords from text using simple tokenization and frequency analysis
 */
function extractKeywords(text: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'a', 'an', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'can', 'may', 'must', 'shall', 'might', 'could', 'would', 'should', 'will',
    'not', 'no', 'yes', 'all', 'any', 'some', 'many', 'much', 'few', 'little',
    'more', 'most', 'less', 'least', 'other', 'another', 'each', 'every', 'both',
    'either', 'neither', 'one', 'two', 'first', 'second', 'last', 'next', 'previous',
    'new', 'old', 'good', 'bad', 'great', 'small', 'large', 'big', 'long', 'short',
    'high', 'low', 'early', 'late', 'fast', 'slow', 'easy', 'hard', 'simple', 'complex',
    'important', 'necessary', 'possible', 'available', 'required', 'preferred',
    'experience', 'skills', 'ability', 'knowledge', 'understanding', 'familiarity',
    'responsibilities', 'duties', 'tasks', 'projects', 'team', 'work', 'job', 'position',
    'role', 'company', 'organization', 'department', 'office', 'location', 'remote',
    'full', 'time', 'part', 'contract', 'permanent', 'temporary', 'salary', 'benefits',
    'opportunity', 'career', 'growth', 'development', 'learning', 'training',
    'bachelor', 'master', 'degree', 'diploma', 'certification', 'license',
    'years', 'year', 'months', 'month', 'weeks', 'week', 'days', 'day',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december'
  ]);

  // Tokenize and clean text
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length >= 3 && 
      word.length <= 20 && 
      !stopWords.has(word) &&
      !/^\d+$/.test(word) // Filter out pure numbers
    );

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Sort by frequency and return top 25 unique keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([word]) => word);
}

/**
 * Normalize job description from URL or text
 */
export async function normalizeJD(input: { url?: string; text?: string }): Promise<NormalizedJD> {
  let jdText = input.text || '';
  let html = '';

  // If URL provided, fetch and extract text
  if (input.url && !input.text) {
    try {
      const response = await fetch(input.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ResumeCoPilot/1.0)',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job description from URL: ${response.status}`);
      }

      html = await response.text();
      jdText = extractTextFromHTML(html);

      // Limit text length to prevent excessive processing
      if (jdText.length > 20000) {
        jdText = jdText.substring(0, 20000) + '... [truncated]';
      }
    } catch (fetchError) {
      throw new Error(`Failed to fetch job description from URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
    }
  }

  if (!jdText || jdText.trim().length === 0) {
    throw new Error('No job description text available');
  }

  // Extract company and role using heuristics
  const company = extractCompany(html, jdText);
  const role = extractRole(html, jdText);

  // Extract keywords
  const keywords = extractKeywords(jdText);

  return {
    company,
    role,
    jdText: jdText.trim(),
    keywords,
  };
}
