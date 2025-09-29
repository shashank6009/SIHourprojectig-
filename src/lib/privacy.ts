import { createHash } from 'crypto';

/**
 * Hash user ID for privacy-safe analytics
 * Uses SHA-256 to create a consistent hash that can't be reversed
 */
export function hashUserId(raw: string): string {
  if (!raw) return '';
  
  // Use Node.js crypto for server-side hashing
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Redact PII from text for safe logging
 * Removes emails, phone numbers, and other sensitive data
 */
export function redactPII(text: string): string {
  if (!text) return '';
  
  let redacted = text;
  
  // Remove email addresses
  redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]');
  
  // Remove phone numbers (various formats)
  redacted = redacted.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]');
  redacted = redacted.replace(/\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, '[phone]');
  redacted = redacted.replace(/\b\d{3}\s\d{3}\s\d{4}\b/g, '[phone]');
  
  // Remove SSN patterns (basic)
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn]');
  redacted = redacted.replace(/\b\d{9}\b/g, '[ssn]');
  
  // Remove credit card patterns (basic)
  redacted = redacted.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[card]');
  
  return redacted;
}

/**
 * Sanitize metadata for safe storage
 * Ensures metadata is JSON-safe and within size limits
 */
export function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  if (!metadata || typeof metadata !== 'object') return {};
  
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Skip if key is too long or contains sensitive patterns
    if (key.length > 50 || /password|secret|token|key/i.test(key)) {
      continue;
    }
    
    // Handle different value types
    if (typeof value === 'string') {
      // Redact PII from strings and limit length
      sanitized[key] = redactPII(value).substring(0, 500);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      // Limit array size and sanitize each element
      sanitized[key] = value.slice(0, 10).map(item => 
        typeof item === 'string' ? redactPII(item).substring(0, 100) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects (limited depth)
      sanitized[key] = sanitizeMetadata(value);
    }
  }
  
  // Ensure total size is under 2KB
  const jsonString = JSON.stringify(sanitized);
  if (jsonString.length > 2000) {
    // Truncate by removing largest values
    const entries = Object.entries(sanitized).sort((a, b) => 
      JSON.stringify(b[1]).length - JSON.stringify(a[1]).length
    );
    
    const truncated: Record<string, any> = {};
    let currentSize = 0;
    
    for (const [key, value] of entries) {
      const entrySize = JSON.stringify({ [key]: value }).length;
      if (currentSize + entrySize < 1800) { // Leave some buffer
        truncated[key] = value;
        currentSize += entrySize;
      }
    }
    
    return truncated;
  }
  
  return sanitized;
}
