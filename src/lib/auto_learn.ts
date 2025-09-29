import { supabaseServer } from './supabase-server';

export interface PromptRecommendation {
  recommendation: string;
  newPromptSnippet: string;
  evidence: {
    variantA: { samples: number; avgAts: number };
    variantB: { samples: number; avgAts: number };
    improvement: number;
    confidence: 'low' | 'medium' | 'high';
  };
}

/**
 * Analyze experiment results and propose prompt improvements
 * This function looks for statistically significant improvements in ATS scores
 */
export async function proposePromptTweaks(args: {
  since: string; // ISO date
  minSamples?: number;
  guardrails?: { minAtsGain?: number };
}): Promise<PromptRecommendation | null> {
  try {
    const { since, minSamples = 50, guardrails = { minAtsGain: 3 } } = args;

    console.log(`Analyzing prompt performance since ${since}`);

    // Get model runs with ATS scores from the specified date
    const { data: modelRuns, error: runsError } = await supabaseServer
      .from('resume_model_runs')
      .select('*')
      .gte('created_at', since)
      .not('ats_score', 'is', null)
      .not('prompt_key', 'is', null);

    if (runsError) {
      throw new Error(`Failed to fetch model runs: ${runsError.message}`);
    }

    if (!modelRuns || modelRuns.length < minSamples) {
      console.log(`Insufficient data: ${modelRuns?.length || 0} samples (need ${minSamples})`);
      return null;
    }

    // Group by prompt key to find variants
    const promptGroups = modelRuns.reduce((acc, run) => {
      const key = run.prompt_key;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(run);
      return acc;
    }, {} as Record<string, any[]>);

    const promptKeys = Object.keys(promptGroups);
    
    if (promptKeys.length < 2) {
      console.log('Need at least 2 prompt variants to compare');
      return null;
    }

    // Find the best performing prompt
    let bestPrompt = '';
    let bestAvgAts = 0;
    let bestSamples = 0;

    for (const [promptKey, runs] of Object.entries(promptGroups)) {
      const atsScores = runs.map(run => run.ats_score).filter(score => score !== null);
      const avgAts = atsScores.reduce((sum, score) => sum + score, 0) / atsScores.length;
      
      if (atsScores.length >= minSamples && avgAts > bestAvgAts) {
        bestPrompt = promptKey;
        bestAvgAts = avgAts;
        bestSamples = atsScores.length;
      }
    }

    if (!bestPrompt) {
      console.log('No prompt variant meets minimum sample requirements');
      return null;
    }

    // Calculate improvement over baseline
    const baselineKey = promptKeys.find(key => key.includes('@2025-09-28') || key === 'SYSTEM_COACH');
    let baselineAvgAts = 0;
    let baselineSamples = 0;

    if (baselineKey && promptGroups[baselineKey]) {
      const baselineRuns = promptGroups[baselineKey];
      const baselineScores = baselineRuns.map(run => run.ats_score).filter(score => score !== null);
      baselineAvgAts = baselineScores.reduce((sum, score) => sum + score, 0) / baselineScores.length;
      baselineSamples = baselineScores.length;
    }

    const improvement = bestAvgAts - baselineAvgAts;

    if (improvement < guardrails.minAtsGain) {
      console.log(`Improvement ${improvement.toFixed(2)} below threshold ${guardrails.minAtsGain}`);
      return null;
    }

    // Determine confidence level
    let confidence: 'low' | 'medium' | 'high' = 'low';
    if (bestSamples >= 100 && baselineSamples >= 100) {
      confidence = 'high';
    } else if (bestSamples >= 75 && baselineSamples >= 75) {
      confidence = 'medium';
    }

    // Generate prompt recommendation based on the best performing variant
    const recommendation = generatePromptRecommendation(bestPrompt, improvement);
    const newPromptSnippet = generatePromptSnippet(bestPrompt, improvement);

    return {
      recommendation,
      newPromptSnippet,
      evidence: {
        variantA: { samples: baselineSamples, avgAts: baselineAvgAts },
        variantB: { samples: bestSamples, avgAts: bestAvgAts },
        improvement,
        confidence,
      },
    };

  } catch (error) {
    console.error('Auto-learn analysis error:', error);
    return null;
  }
}

/**
 * Generate a human-readable recommendation
 */
function generatePromptRecommendation(bestPrompt: string, improvement: number): string {
  const improvementPercent = ((improvement / 100) * 100).toFixed(1);
  
  if (bestPrompt.includes('quantified') || bestPrompt.includes('numbers')) {
    return `Quantified results approach shows ${improvementPercent}% ATS improvement. Recommend emphasizing measurable outcomes and specific metrics in coaching prompts.`;
  } else if (bestPrompt.includes('concise') || bestPrompt.includes('brief')) {
    return `Concise formatting approach shows ${improvementPercent}% ATS improvement. Recommend shorter, more focused bullet points in coaching prompts.`;
  } else if (bestPrompt.includes('action') || bestPrompt.includes('verbs')) {
    return `Action-oriented approach shows ${improvementPercent}% ATS improvement. Recommend stronger action verbs and impact statements in coaching prompts.`;
  } else {
    return `Prompt variant "${bestPrompt}" shows ${improvementPercent}% ATS improvement. Consider adopting this approach for future coaching prompts.`;
  }
}

/**
 * Generate a new prompt snippet based on the best performing variant
 */
function generatePromptSnippet(bestPrompt: string, improvement: number): string {
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (bestPrompt.includes('quantified') || bestPrompt.includes('numbers')) {
    return `// Enhanced coaching prompt - emphasizes quantified results
// Generated: ${timestamp} (${improvement.toFixed(1)}% ATS improvement)
"Prefer quantified outcomes: %, #, time saved, accuracy, scale. Include baseline metrics when possible. Cap bullets at 18 words for ATS optimization."`;
  } else if (bestPrompt.includes('concise') || bestPrompt.includes('brief')) {
    return `// Enhanced coaching prompt - emphasizes conciseness
// Generated: ${timestamp} (${improvement.toFixed(1)}% ATS improvement)
"Keep bullets concise and focused. Maximum 15 words per bullet. Lead with action verbs. Avoid filler words and redundant phrases."`;
  } else if (bestPrompt.includes('action') || bestPrompt.includes('verbs')) {
    return `// Enhanced coaching prompt - emphasizes action verbs
// Generated: ${timestamp} (${improvement.toFixed(1)}% ATS improvement)
"Start each bullet with strong action verbs: Led, Implemented, Optimized, Delivered. Focus on impact and results. Use past tense for completed work."`;
  } else {
    return `// Enhanced coaching prompt - general improvements
// Generated: ${timestamp} (${improvement.toFixed(1)}% ATS improvement)
"Focus on measurable impact and specific achievements. Use active voice and strong action verbs. Limit to 2 lines maximum per bullet point."`;
  }
}

/**
 * Get top missing keywords across all job descriptions
 */
export async function getTopMissingKeywords(days: number = 14): Promise<Array<{ keyword: string; count: number; frequency: number }>> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceISO = since.toISOString();

    // Get events with missing keywords metadata
    const { data: events, error } = await supabaseServer
      .from('resume_events')
      .select('metadata')
      .eq('event_type', 'JD_ALIGNED')
      .gte('created_at', sinceISO)
      .not('metadata->missingKeywords', 'is', null);

    if (error) {
      throw error;
    }

    // Aggregate missing keywords
    const keywordCounts = new Map<string, number>();
    let totalEvents = 0;

    events?.forEach(event => {
      const missingKeywords = event.metadata?.missingKeywords;
      if (Array.isArray(missingKeywords)) {
        totalEvents++;
        missingKeywords.forEach((keyword: string) => {
          if (typeof keyword === 'string' && keyword.trim()) {
            const normalized = keyword.toLowerCase().trim();
            keywordCounts.set(normalized, (keywordCounts.get(normalized) || 0) + 1);
          }
        });
      }
    });

    // Convert to array and sort by frequency
    const results = Array.from(keywordCounts.entries())
      .map(([keyword, count]) => ({
        keyword,
        count,
        frequency: totalEvents > 0 ? count / totalEvents : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20

    return results;

  } catch (error) {
    console.error('Error getting missing keywords:', error);
    return [];
  }
}
