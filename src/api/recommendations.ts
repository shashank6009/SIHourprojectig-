import apiClient from './client';

// Type definitions
export interface HealthCheckResponse {
  status: string;
}

export interface RecommendationScores {
  success_probability: number;
  skill_match?: number;
  employability_boost?: number;
  fairness_adjustment?: number;
}

export interface CourseSuggestion {
  skill: string;
  platform: string;
  course_name: string;
  link: string;
}

export interface Recommendation {
  internship_id: string;
  title: string;
  organization_name: string;
  domain: string;
  location: string;
  duration: string;
  stipend: string | number;
  rank: number;
  scores: RecommendationScores;
  explain_reasons?: string[];
  course_suggestions?: CourseSuggestion[];
}

export interface RecommendationsResponse {
  student_id: string;
  total_recommendations: number;
  requested_count: number;
  recommendations: Recommendation[];
}

// Utility function to safely convert string to number
const safeParseNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Utility function to process recommendations and convert numeric strings
const processRecommendations = (recommendations: Record<string, unknown>[]): Recommendation[] => {
  return recommendations.map((rec) => ({
    internship_id: rec.internship_id as string,
    title: rec.title as string,
    organization_name: rec.organization_name as string,
    domain: rec.domain as string,
    location: rec.location as string,
    duration: rec.duration as string,
    stipend: safeParseNumber(rec.stipend),
    rank: safeParseNumber(rec.rank),
    scores: {
      success_probability: safeParseNumber(rec.scores?.success_probability),
      skill_match: rec.scores?.skill_match ? safeParseNumber(rec.scores.skill_match) : undefined,
      employability_boost: rec.scores?.employability_boost ? safeParseNumber(rec.scores.employability_boost) : undefined,
      fairness_adjustment: rec.scores?.fairness_adjustment ? safeParseNumber(rec.scores.fairness_adjustment) : undefined,
    },
  }));
};

// Health check function
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Get recommendations function
export const getRecommendations = async (
  studentId: string,
  topN: number = 5
): Promise<RecommendationsResponse> => {
  try {
    const response = await apiClient.get(`/recommendations/${studentId}`, {
      params: { top_n: topN }
    });

    const data = response.data;
    
    // Process the response to convert numeric strings
    const processedData: RecommendationsResponse = {
      student_id: data.student_id,
      total_recommendations: safeParseNumber(data.total_recommendations),
      requested_count: safeParseNumber(data.requested_count),
      recommendations: processRecommendations(data.recommendations || []),
    };

    return processedData;
  } catch (error) {
    console.error('Get recommendations failed:', error);
    throw error;
  }
};

// Additional utility function to get success probability for a specific internship
export const getSuccessProbability = async (
  studentId: string,
  internshipId: string
): Promise<{ success_probability: number }> => {
  try {
    const response = await apiClient.get(`/success/${studentId}/${internshipId}`);
    return {
      success_probability: safeParseNumber(response.data.success_probability),
    };
  } catch (error) {
    console.error('Get success probability failed:', error);
    throw error;
  }
};
