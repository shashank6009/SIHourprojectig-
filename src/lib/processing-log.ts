/**
 * Processing Log Service
 * Handles immutable logging of data processing activities
 */

import { supabaseServer } from './supabase-server';
import { redactSensitive } from './crypto';

export interface ProcessingLogEntry {
  userId?: string;
  action: string;
  lawfulBasis?: string;
  consentVersion?: string;
  scopesUsed?: string[];
  subjectId?: string;
  metadata?: Record<string, any>;
}

/**
 * Log a processing activity
 */
export async function logProcessing(args: ProcessingLogEntry): Promise<void> {
  const {
    userId,
    action,
    lawfulBasis = 'consent',
    consentVersion = process.env.POLICY_VERSION || '2025-09-28',
    scopesUsed = [],
    subjectId,
    metadata = {},
  } = args;

  // Redact sensitive information from metadata
  const redactedMetadata = redactMetadata(metadata);

  const { error } = await supabaseServer
    .from('processing_logs')
    .insert({
      user_id: userId,
      action,
      lawful_basis: lawfulBasis,
      consent_version: consentVersion,
      scopes_used: scopesUsed,
      subject_id: subjectId,
      metadata: redactedMetadata,
    });

  if (error) {
    console.error('Failed to log processing activity:', error);
    // Don't throw - logging failures shouldn't break user flows
  }
}

/**
 * Redact sensitive information from metadata
 */
function redactMetadata(metadata: Record<string, any>): Record<string, any> {
  const redacted = { ...metadata };

  // Redact common sensitive fields
  const sensitiveFields = ['email', 'phone', 'address', 'name', 'text', 'content', 'body'];
  
  for (const [key, value] of Object.entries(redacted)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      if (typeof value === 'string') {
        redacted[key] = redactSensitive(value);
      } else if (typeof value === 'object' && value !== null) {
        redacted[key] = redactMetadata(value);
      }
    }
  }

  return redacted;
}

/**
 * Get processing logs for a user
 */
export async function getUserProcessingLogs(
  userId: string,
  limit: number = 100
): Promise<any[]> {
  const { data, error } = await supabaseServer
    .from('processing_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch processing logs: ${error.message}`);
  }

  return data || [];
}

/**
 * Get processing logs by action type
 */
export async function getProcessingLogsByAction(
  action: string,
  limit: number = 100
): Promise<any[]> {
  const { data, error } = await supabaseServer
    .from('processing_logs')
    .select('*')
    .eq('action', action)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch processing logs: ${error.message}`);
  }

  return data || [];
}

/**
 * Get processing statistics
 */
export async function getProcessingStats(
  userId?: string,
  days: number = 30
): Promise<Record<string, number>> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabaseServer
    .from('processing_logs')
    .select('action')
    .gte('created_at', startDate.toISOString());

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch processing stats: ${error.message}`);
  }

  const stats: Record<string, number> = {};
  data?.forEach(entry => {
    stats[entry.action] = (stats[entry.action] || 0) + 1;
  });

  return stats;
}
