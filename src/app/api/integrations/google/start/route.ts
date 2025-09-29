import { NextRequest, NextResponse } from 'next/server';
import { generateAuthUrl } from '@/lib/google';
import { z } from 'zod';

const StartAuthRequestSchema = z.object({
  scope: z.enum(['gmail', 'calendar']),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    if (!scope) {
      return NextResponse.json(
        { error: 'Scope parameter is required' },
        { status: 400 }
      );
    }

    const validatedScope = StartAuthRequestSchema.parse({ scope });

    // Map scope to Google API scopes
    const scopeMap = {
      gmail: 'https://www.googleapis.com/auth/gmail.compose',
      calendar: 'https://www.googleapis.com/auth/calendar',
    };

    const googleScope = scopeMap[validatedScope.scope];
    const authUrl = generateAuthUrl(googleScope);

    return NextResponse.json({
      authUrl,
      scope: validatedScope.scope,
    });
  } catch (error) {
    console.error('Error starting Google OAuth:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid scope parameter', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
