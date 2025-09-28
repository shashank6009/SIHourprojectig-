/**
 * Consent Management Service
 * Handles user consent tracking and validation
 */

import { supabaseServer } from './supabase-server';

export type ConsentScope = 
  | "LLM_PROCESSING" 
  | "OUTREACH_EMAIL" 
  | "CALENDAR_EVENTS" 
  | "OFFSHORE_STORAGE" 
  | "ANALYTICS";

export interface ConsentResult {
  granted: boolean;
  version?: string;
  region?: string;
}

export interface ConsentRecord {
  userId: string;
  scopes: ConsentScope[];
  granted: boolean;
  region?: string;
  policyVersion?: string;
  ipHash?: string;
  userAgent?: string;
}

/**
 * Check if user has granted consent for specific scopes
 */
export async function hasConsent(
  userId: string,
  scope: ConsentScope
): Promise<ConsentResult> {
  // Development bypass for mock user
  if (userId === '00000000-0000-0000-0000-000000000000' && process.env.NODE_ENV === 'development') {
    return {
      granted: true,
      version: POLICY_VERSION,
      region: PRIVACY_DEFAULT_REGION,
    };
  }

  const { data, error } = await supabaseServer
    .from('consents')
    .select('policy_version, region, granted')
    .eq('user_id', userId)
    .eq('granted', true)
    .contains('scopes', [scope])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { granted: false };
  }

  return {
    granted: data.granted,
    version: data.policy_version,
    region: data.region,
  };
}

/**
 * Check if user has granted consent for multiple scopes
 */
export async function hasConsentForScopes(
  userId: string,
  scopes: ConsentScope[]
): Promise<{ granted: boolean; missing: ConsentScope[] }> {
  const results = await Promise.all(
    scopes.map(scope => hasConsent(userId, scope))
  );

  const missing: ConsentScope[] = [];
  let allGranted = true;

  scopes.forEach((scope, index) => {
    if (!results[index].granted) {
      missing.push(scope);
      allGranted = false;
    }
  });

  return {
    granted: allGranted,
    missing,
  };
}

/**
 * Record user consent
 */
export async function recordConsent(args: ConsentRecord): Promise<void> {
  const {
    userId,
    scopes,
    granted,
    region = process.env.PRIVACY_DEFAULT_REGION || 'IN',
    policyVersion = process.env.POLICY_VERSION || '2025-09-28',
    ipHash,
    userAgent,
  } = args;

  const { error } = await supabaseServer
    .from('consents')
    .insert({
      user_id: userId,
      policy_version: policyVersion,
      scopes,
      region,
      granted,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

  if (error) {
    throw new Error(`Failed to record consent: ${error.message}`);
  }
}

/**
 * Get user's consent history
 */
export async function getConsentHistory(userId: string): Promise<any[]> {
  const { data, error } = await supabaseServer
    .from('consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch consent history: ${error.message}`);
  }

  return data || [];
}

/**
 * Get current consent status for all scopes
 */
export async function getCurrentConsents(userId: string): Promise<Record<ConsentScope, ConsentResult>> {
  const scopes: ConsentScope[] = [
    'LLM_PROCESSING',
    'OUTREACH_EMAIL',
    'CALENDAR_EVENTS',
    'OFFSHORE_STORAGE',
    'ANALYTICS',
  ];

  const results = await Promise.all(
    scopes.map(async (scope) => ({
      scope,
      result: await hasConsent(userId, scope),
    }))
  );

  const consentMap: Record<ConsentScope, ConsentResult> = {} as any;
  results.forEach(({ scope, result }) => {
    consentMap[scope] = result;
  });

  return consentMap;
}

/**
 * Revoke consent for specific scopes
 */
export async function revokeConsent(
  userId: string,
  scopes: ConsentScope[],
  ipHash?: string,
  userAgent?: string
): Promise<void> {
  await recordConsent({
    userId,
    scopes,
    granted: false,
    ipHash,
    userAgent,
  });
}
