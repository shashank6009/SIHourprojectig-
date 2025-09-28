/**
 * Policy Gatekeeping Middleware
 * Handles consent validation, region enforcement, and data redaction
 */

import { hasConsentForScopes, ConsentScope } from './consent';
import { redactSensitive } from './crypto';

export type ConsentCheckResult = {
  ok: true;
  version: string;
  region: string;
} | {
  ok: false;
  missing: ConsentScope[];
}

/**
 * Require consent for specific scopes
 */
export async function requireConsent(
  userId: string,
  scopes: ConsentScope[]
): Promise<ConsentCheckResult> {
  // Development bypass for mock user
  if (userId === '00000000-0000-0000-0000-000000000000' && process.env.NODE_ENV === 'development') {
    return {
      ok: true,
      version: process.env.POLICY_VERSION || '2025-09-28',
      region: process.env.PRIVACY_DEFAULT_REGION || 'IN',
    };
  }

  const result = await hasConsentForScopes(userId, scopes);
  
  if (result.granted) {
    // Get the latest consent details
    const { data } = await import('./consent').then(m => 
      m.getConsentHistory(userId)
    );
    
    const latestConsent = data?.[0];
    
    return {
      ok: true,
      version: latestConsent?.policy_version || process.env.POLICY_VERSION || '2025-09-28',
      region: latestConsent?.region || process.env.PRIVACY_DEFAULT_REGION || 'IN',
    };
  }
  
  return {
    ok: false,
    missing: result.missing,
  };
}

/**
 * Redact sensitive information from text for model processing
 */
export function redactForModel(text: string): string {
  return redactSensitive(text);
}

/**
 * Enforce region-based restrictions on external providers
 */
export function enforceRegion(
  provider: string,
  region: string
): "allow" | "deny" | "route_local" {
  const blockExternal = process.env.PRIVACY_BLOCK_EXTERNAL_LLM === 'true';
  
  // Block all external LLM calls if configured
  if (blockExternal) {
    return "route_local";
  }
  
  // EU region restrictions
  if (region === 'EU') {
    // Example: Block certain providers in EU
    if (provider === 'openai' && !process.env.OPENAI_EU_COMPLIANT) {
      return "route_local";
    }
  }
  
  // US region restrictions
  if (region === 'US') {
    // Example: Additional US-specific restrictions
    if (provider === 'anthropic' && !process.env.ANTHROPIC_US_COMPLIANT) {
      return "route_local";
    }
  }
  
  return "allow";
}

/**
 * Check if external LLM processing is allowed
 */
export function isExternalLLMAllowed(region: string): boolean {
  const result = enforceRegion('openai', region);
  return result === "allow";
}

/**
 * Get region-specific processing configuration
 */
export function getRegionConfig(region: string): {
  allowExternalLLM: boolean;
  requireLocalProcessing: boolean;
  dataResidency: string;
} {
  const allowExternalLLM = isExternalLLMAllowed(region);
  
  return {
    allowExternalLLM,
    requireLocalProcessing: !allowExternalLLM,
    dataResidency: region,
  };
}

/**
 * Validate and sanitize user input for processing
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return redactForModel(input);
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Create a privacy-safe prompt key
 */
export function createPrivacySafePromptKey(
  baseKey: string,
  region: string,
  redacted: boolean = false
): string {
  const date = new Date().toISOString().split('T')[0];
  const suffix = redacted ? '[REDACTED]' : '';
  return `${baseKey}@${date}[${region}${suffix}]`;
}

/**
 * Log privacy-related processing decision
 */
export async function logPrivacyDecision(
  userId: string,
  decision: {
    action: string;
    region: string;
    provider?: string;
    allowed: boolean;
    reason?: string;
  }
): Promise<void> {
  const { logProcessing } = await import('./processing-log');
  
  await logProcessing({
    userId,
    action: 'PRIVACY_DECISION',
    lawfulBasis: 'legitimate_interest',
    metadata: {
      decision,
      timestamp: new Date().toISOString(),
    },
  });
}
