import { supabaseServer } from './supabase-server';
import { hashUserId, sanitizeMetadata } from './privacy';

export type EventType = 
  | "INTERVIEW_COMPLETED" 
  | "JD_ALIGNED" 
  | "PDF_EXPORTED" 
  | "COMMENT_ADDED" 
  | "COMMENT_RESOLVED" 
  | "MENTOR_APPROVED"
  | "BATCH_CREATED"
  | "BATCH_ITEM_COMPLETED"
  | "BATCH_EXPORTED"
  | "EMAIL_DRAFT_CREATED"
  | "FOLLOWUP_SCHEDULED"
  | "ATS_CHECKLIST_VIEWED"
  | "REFERRAL_INTRO_DRAFTED"
  | "REFERRAL_IMPORTED"
  | "CONSENT_GRANTED"
  | "CONSENT_REVOKED"
  | "DSR_EXPORT_REQUESTED"
  | "DSR_DELETE_REQUESTED"
  | "PRIVACY_REGION_SET";

export interface EventMetadata {
  [key: string]: any;
}

/**
 * Track user events for analytics and continuous improvement
 * All PII is hashed and metadata is sanitized for privacy
 */
export async function trackEvent(args: {
  userId: string;
  event: EventType;
  resumeVersionId?: string;
  metadata?: EventMetadata;
}): Promise<void> {
  try {
    const { userId, event, resumeVersionId, metadata = {} } = args;
    
    // Hash user ID for privacy
    const userHash = hashUserId(userId);
    
    // Sanitize metadata to remove PII and limit size
    const sanitizedMetadata = sanitizeMetadata(metadata);
    
    // Insert event into database
    const { error } = await supabaseServer
      .from('resume_events')
      .insert({
        user_hash: userHash,
        resume_version_id: resumeVersionId || null,
        event_type: event,
        metadata: sanitizedMetadata,
      });
    
    if (error) {
      console.error('Failed to track event:', error);
      // Don't throw - analytics failures shouldn't break user flows
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Silently fail to avoid breaking user experience
  }
}

/**
 * Get user events for a specific time range
 * Used for analytics and debugging
 */
export async function getUserEvents(
  userId: string,
  startDate?: string,
  endDate?: string,
  eventType?: EventType
): Promise<any[]> {
  try {
    const userHash = hashUserId(userId);
    
    let query = supabaseServer
      .from('resume_events')
      .select('*')
      .eq('user_hash', userHash)
      .order('created_at', { ascending: false });
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    const { data, error } = await query.limit(100);
    
    if (error) {
      console.error('Failed to fetch user events:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
}

/**
 * Get aggregated metrics for a date range
 */
export async function getMetrics(
  startDate: string,
  endDate: string,
  userHash?: string
): Promise<any[]> {
  try {
    let query = supabaseServer
      .from('resume_metrics_daily')
      .select('*')
      .gte('day', startDate)
      .lte('day', endDate)
      .order('day', { ascending: false });
    
    if (userHash) {
      query = query.eq('user_hash', userHash);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Failed to fetch metrics:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
}

/**
 * Track model run for audit and improvement
 */
export async function trackModelRun(args: {
  userId: string;
  resumeVersionId?: string;
  provider: string;
  model: string;
  promptKey: string;
  tokensIn?: number;
  tokensOut?: number;
  atsScore?: number;
  missingKeywords?: number;
}): Promise<void> {
  try {
    const { userId, resumeVersionId, provider, model, promptKey, tokensIn, tokensOut, atsScore, missingKeywords } = args;
    
    const userHash = hashUserId(userId);
    
    const { error } = await supabaseServer
      .from('resume_model_runs')
      .insert({
        user_hash: userHash,
        resume_version_id: resumeVersionId || null,
        provider,
        model,
        prompt_key: promptKey,
        tokens_in: tokensIn || 0,
        tokens_out: tokensOut || 0,
        ats_score: atsScore || null,
        missing_keywords: missingKeywords || 0,
      });
    
    if (error) {
      console.error('Failed to track model run:', error);
    }
  } catch (error) {
    console.error('Model run tracking error:', error);
  }
}
