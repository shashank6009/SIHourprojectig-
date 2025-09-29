import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, saveTokens } from '@/lib/google';
import { z } from 'zod';

const CallbackRequestSchema = z.object({
  code: z.string(),
  scope: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const scope = searchParams.get('scope');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Determine provider based on scope
    let provider = 'google:gmail'; // default
    if (scope?.includes('calendar')) {
      provider = 'google:calendar';
    }

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Save tokens to database
    await saveTokens(userId, provider, tokens);

    // Redirect back to integrations page with success status
    const redirectUrl = new URL('/copilot/integrations', request.url);
    redirectUrl.searchParams.set('status', 'success');
    redirectUrl.searchParams.set('provider', provider);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in Google OAuth callback:', error);

    // Redirect back with error status
    const redirectUrl = new URL('/copilot/integrations', request.url);
    redirectUrl.searchParams.set('status', 'error');
    redirectUrl.searchParams.set('error', 'Failed to complete OAuth flow');

    return NextResponse.redirect(redirectUrl);
  }
}
