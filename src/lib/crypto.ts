/**
 * Crypto Utilities for Envelope Encryption
 * Uses AES-256-GCM for data encryption and key wrapping
 */

import { createCipher, createDecipher, randomBytes, createHash } from 'crypto';

export interface EncryptedData {
  dataKeyEnc: Buffer;
  iv: Buffer;
  tag: Buffer;
  ciphertext: Buffer;
}

/**
 * Get master key from environment
 */
export function getMasterKey(): Buffer {
  const masterKeyHex = process.env.MASTER_KEY_HEX;
  if (!masterKeyHex) {
    throw new Error('MASTER_KEY_HEX environment variable is required');
  }
  
  if (masterKeyHex.length !== 64) {
    throw new Error('MASTER_KEY_HEX must be 64 hex characters (32 bytes)');
  }
  
  try {
    return Buffer.from(masterKeyHex, 'hex');
  } catch (error) {
    throw new Error('Invalid MASTER_KEY_HEX format');
  }
}

/**
 * Generate a random data key
 */
function generateDataKey(): Buffer {
  return randomBytes(32); // 256 bits
}

/**
 * Derive a nonce from random IV for key wrapping
 */
function deriveNonce(iv: Buffer): Buffer {
  return createHash('sha256').update(iv).digest().subarray(0, 12);
}

/**
 * Encrypt JSON data using envelope encryption
 */
export function encryptJSON(obj: any): EncryptedData {
  const masterKey = getMasterKey();
  const dataKey = generateDataKey();
  const iv = randomBytes(16); // 128 bits for AES-GCM
  const nonce = deriveNonce(iv);
  
  // Serialize data
  const plaintext = JSON.stringify(obj);
  
  // Encrypt data with data key
  const cipher = createCipher('aes-256-gcm', dataKey);
  cipher.setAAD(iv); // Use IV as additional authenticated data
  
  let ciphertext = cipher.update(plaintext, 'utf8');
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  const tag = cipher.getAuthTag();
  
  // Encrypt data key with master key
  const keyCipher = createCipher('aes-256-gcm', masterKey);
  keyCipher.setAAD(nonce);
  
  let dataKeyEnc = keyCipher.update(dataKey);
  dataKeyEnc = Buffer.concat([dataKeyEnc, keyCipher.final()]);
  const keyTag = keyCipher.getAuthTag();
  
  // Combine key tag with encrypted data key
  dataKeyEnc = Buffer.concat([dataKeyEnc, keyTag]);
  
  return {
    dataKeyEnc,
    iv,
    tag,
    ciphertext,
  };
}

/**
 * Decrypt JSON data using envelope encryption
 */
export function decryptJSON(parts: EncryptedData): any {
  const masterKey = getMasterKey();
  const { dataKeyEnc, iv, tag, ciphertext } = parts;
  const nonce = deriveNonce(iv);
  
  // Extract key tag from encrypted data key
  const keyTag = dataKeyEnc.subarray(-16); // Last 16 bytes
  const encryptedDataKey = dataKeyEnc.subarray(0, -16);
  
  // Decrypt data key with master key
  const keyDecipher = createDecipher('aes-256-gcm', masterKey);
  keyDecipher.setAAD(nonce);
  keyDecipher.setAuthTag(keyTag);
  
  let dataKey = keyDecipher.update(encryptedDataKey);
  dataKey = Buffer.concat([dataKey, keyDecipher.final()]);
  
  // Decrypt data with data key
  const decipher = createDecipher('aes-256-gcm', dataKey);
  decipher.setAAD(iv);
  decipher.setAuthTag(tag);
  
  let plaintext = decipher.update(ciphertext, undefined, 'utf8');
  plaintext += decipher.final('utf8');
  
  return JSON.parse(plaintext);
}

/**
 * Convert buffer to hex string
 */
export function toHex(buffer: Buffer): string {
  return buffer.toString('hex');
}

/**
 * Convert hex string to buffer
 */
export function fromHex(hex: string): Buffer {
  return Buffer.from(hex, 'hex');
}

/**
 * Safely parse JSON with error handling
 */
export function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('Failed to parse JSON, using fallback:', error);
    return fallback;
  }
}

/**
 * Hash sensitive data for logging (one-way)
 */
export function hashForLogging(data: string): string {
  return createHash('sha256').update(data).digest('hex').substring(0, 8);
}

/**
 * Redact sensitive patterns from text
 */
export function redactSensitive(text: string): string {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
    .replace(/\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g, '[PHONE_REDACTED]')
    .replace(/\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g, '[CARD_REDACTED]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');
}
