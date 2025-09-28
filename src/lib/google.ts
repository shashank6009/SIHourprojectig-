/**
 * Google OAuth Integration
 * Handles OAuth client setup and token management
 */

import { google } from 'googleapis';
import { supabaseServer } from './supabase-server';

export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

/**
 * Get OAuth2 client for Google APIs
 */
export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/**
 * Save OAuth tokens to database
 */
export async function saveTokens(
  userId: string,
  provider: string,
  tokens: TokenData
): Promise<void> {
  const expiresAt = tokens.expiry_date 
    ? new Date(tokens.expiry_date).toISOString()
    : null;

  const { error } = await supabaseServer
    .from('integration_tokens')
    .upsert({
      user_id: userId,
      provider,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,provider'
    });

  if (error) {
    throw new Error(`Failed to save tokens: ${error.message}`);
  }
}

/**
 * Get OAuth tokens from database
 */
export async function getTokens(
  userId: string,
  provider: string
): Promise<OAuthTokens | null> {
  const { data, error } = await supabaseServer
    .from('integration_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: data.expires_at ? new Date(data.expires_at).getTime() : undefined,
  };
}

/**
 * Check if tokens are expired
 */
export function isTokenExpired(tokens: OAuthTokens): boolean {
  if (!tokens.expiry_date) {
    return false; // No expiry date means token doesn't expire
  }
  return Date.now() >= tokens.expiry_date;
}

/**
 * Refresh OAuth tokens if needed
 */
export async function refreshTokensIfNeeded(
  userId: string,
  provider: string
): Promise<OAuthTokens | null> {
  const tokens = await getTokens(userId, provider);
  if (!tokens) {
    return null;
  }

  if (!isTokenExpired(tokens)) {
    return tokens;
  }

  if (!tokens.refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    
    const newTokens: TokenData = {
      access_token: credentials.access_token!,
      refresh_token: credentials.refresh_token || tokens.refresh_token,
      expiry_date: credentials.expiry_date,
    };

    await saveTokens(userId, provider, newTokens);
    
    return {
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token,
      expiry_date: newTokens.expiry_date,
    };
  } catch (error) {
    console.error('Failed to refresh tokens:', error);
    throw new Error('Failed to refresh tokens');
  }
}

/**
 * Get authenticated Gmail client
 */
export async function getGmailClient(userId: string) {
  const tokens = await refreshTokensIfNeeded(userId, 'google:gmail');
  if (!tokens) {
    throw new Error('No Gmail tokens available');
  }

  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Get authenticated Calendar client
 */
export async function getCalendarClient(userId: string) {
  const tokens = await refreshTokensIfNeeded(userId, 'google:calendar');
  if (!tokens) {
    throw new Error('No Calendar tokens available');
  }

  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Generate OAuth URL for Google authorization
 */
export function generateAuthUrl(scope: string): string {
  const oauth2Client = getOAuthClient();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [scope],
    prompt: 'consent', // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<TokenData> {
  const oauth2Client = getOAuthClient();
  
  const { tokens } = await oauth2Client.getToken(code);
  
  return {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
  };
}
