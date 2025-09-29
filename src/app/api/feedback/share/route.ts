import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';
import jwt from 'jsonwebtoken';

// Mock user ID for now
const mockUserId = '00000000-0000-0000-0000-000000000000'; // TODO: Wire real auth later

const ShareRequestSchema = z.object({
  resumeVersionId: z.string().uuid(),
});

const JWT_SECRET = process.env.JWT_SECRET || 'resume-copilot-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeVersionId } = ShareRequestSchema.parse(body);

    // Verify version exists
    const { data: version, error: versionError } = await supabaseServer
      .from('resume_versions')
      .select('id')
      .eq('id', resumeVersionId)
      .single();

    if (versionError || !version) {
      return NextResponse.json(
        { error: 'Resume version not found' },
        { status: 404 }
      );
    }

    // Create JWT token (7 days expiry)
    const token = jwt.sign(
      { 
        resumeVersionId,
        type: 'mentor_review',
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/copilot/review?token=${token}`;

    return NextResponse.json({
      success: true,
      data: { url: shareUrl },
    });

  } catch (error) {
    console.error('Share error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (decoded.type !== 'mentor_review') {
        return NextResponse.json(
          { error: 'Invalid token type' },
          { status: 400 }
        );
      }

      // Fetch version data
      const { data: version, error: versionError } = await supabaseServer
        .from('resume_versions')
        .select('*, resumes(*)')
        .eq('id', decoded.resumeVersionId)
        .single();

      if (versionError || !version) {
        return NextResponse.json(
          { error: 'Resume version not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { version },
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    );
  }
}
