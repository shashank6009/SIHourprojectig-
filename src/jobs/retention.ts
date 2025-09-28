/**
 * Data Retention Job
 * Purges expired data according to retention policies
 */

import { supabaseServer } from '@/lib/supabase-server';

export interface RetentionResult {
  deleted: number;
  anonymized: number;
  errors: string[];
}

/**
 * Purge expired data according to retention policies
 */
export async function purgeExpired(): Promise<RetentionResult> {
  const result: RetentionResult = {
    deleted: 0,
    anonymized: 0,
    errors: [],
  };

  const retentionDays = parseInt(process.env.DATA_RETENTION_DAYS || '365');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  try {
    // Anonymize old processing logs (keep for audit but remove PII)
    const { count: anonymizedCount, error: anonymizeError } = await supabaseServer
      .from('processing_logs')
      .update({
        user_id: null,
        metadata: {
          anonymized: true,
          original_date: new Date().toISOString(),
        },
      })
      .lt('created_at', cutoffDate.toISOString())
      .not('user_id', 'is', null);

    if (anonymizeError) {
      result.errors.push(`Failed to anonymize processing logs: ${anonymizeError.message}`);
    } else {
      result.anonymized += anonymizedCount || 0;
    }

    // Delete old resume events (aggregate data can be kept longer)
    const { count: eventsCount, error: eventsError } = await supabaseServer
      .from('resume_events')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (eventsError) {
      result.errors.push(`Failed to delete old resume events: ${eventsError.message}`);
    } else {
      result.deleted += eventsCount || 0;
    }

    // Delete old DSR requests (keep for 1 year after completion)
    const dsrCutoffDate = new Date();
    dsrCutoffDate.setDate(dsrCutoffDate.getDate() - 365);

    const { count: dsrCount, error: dsrError } = await supabaseServer
      .from('dsr_requests')
      .delete()
      .lt('created_at', dsrCutoffDate.toISOString())
      .eq('status', 'done');

    if (dsrError) {
      result.errors.push(`Failed to delete old DSR requests: ${dsrError.message}`);
    } else {
      result.deleted += dsrCount || 0;
    }

    // Clean up old storage files (exports older than 30 days)
    const storageCutoffDate = new Date();
    storageCutoffDate.setDate(storageCutoffDate.getDate() - 30);

    // Note: This would require listing and deleting files from Supabase storage
    // For now, we'll just log that this should be done
    console.log(`Storage cleanup needed for files older than ${storageCutoffDate.toISOString()}`);

    // Delete old expired integration tokens
    const { count: tokenCount, error: tokenError } = await supabaseServer
      .from('integration_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null);

    if (tokenError) {
      result.errors.push(`Failed to delete expired tokens: ${tokenError.message}`);
    } else {
      result.deleted += tokenCount || 0;
    }

    console.log(`Retention job completed: ${result.deleted} deleted, ${result.anonymized} anonymized`);
    
    return result;
  } catch (error) {
    result.errors.push(`Retention job failed: ${error}`);
    return result;
  }
}

/**
 * Get retention statistics
 */
export async function getRetentionStats(): Promise<{
  totalRecords: number;
  recordsOlderThanRetention: number;
  oldestRecord: string | null;
  retentionDays: number;
}> {
  const retentionDays = parseInt(process.env.DATA_RETENTION_DAYS || '365');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  // Get total processing logs
  const { count: totalCount } = await supabaseServer
    .from('processing_logs')
    .select('*', { count: 'exact', head: true });

  // Get records older than retention period
  const { count: oldCount } = await supabaseServer
    .from('processing_logs')
    .select('*', { count: 'exact', head: true })
    .lt('created_at', cutoffDate.toISOString());

  // Get oldest record
  const { data: oldestRecord } = await supabaseServer
    .from('processing_logs')
    .select('created_at')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  return {
    totalRecords: totalCount || 0,
    recordsOlderThanRetention: oldCount || 0,
    oldestRecord: oldestRecord?.created_at || null,
    retentionDays,
  };
}
