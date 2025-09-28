import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';
import { ResumeCommentSchema } from '@/types/resume';
import { trackEvent } from '@/lib/analytics';

// Mock user ID for now
const mockUserId = '00000000-0000-0000-0000-000000000000'; // TODO: Wire real auth later

const CreateCommentSchema = z.object({
  resumeVersionId: z.string().uuid(),
  blockId: z.string().optional(),
  lineRef: z.number().optional(),
  author: z.string().min(1).max(100),
  text: z.string().min(1).max(1000),
});

const UpdateCommentSchema = z.object({
  id: z.string().uuid(),
  resolved: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeVersionId, blockId, lineRef, author, text } = CreateCommentSchema.parse(body);

    // Sanitize inputs
    const sanitizedAuthor = author.trim().substring(0, 100);
    const sanitizedText = text.trim().substring(0, 1000);

    // Check if version exists
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

    // Check comment limit (100 per version)
    const { count } = await supabaseServer
      .from('resume_comments')
      .select('*', { count: 'exact', head: true })
      .eq('resume_version_id', resumeVersionId);

    if (count && count >= 100) {
      return NextResponse.json(
        { error: 'Comment limit reached (100 comments per version)' },
        { status: 400 }
      );
    }

    // Insert comment
    const { data: comment, error: commentError } = await supabaseServer
      .from('resume_comments')
      .insert({
        resume_version_id: resumeVersionId,
        block_id: blockId,
        line_ref: lineRef,
        author: sanitizedAuthor,
        text: sanitizedText,
        resolved: false,
      })
      .select()
      .single();

    if (commentError) {
      throw commentError;
    }

    // Track comment added event
    await trackEvent({
      userId: mockUserId,
      event: 'COMMENT_ADDED',
      resumeVersionId,
      metadata: {
        blockId,
        lineRef,
        author: sanitizedAuthor,
        textLength: sanitizedText.length,
      },
    });

    return NextResponse.json({
      success: true,
      data: comment,
    });

  } catch (error) {
    console.error('Create comment error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const resumeVersionId = url.searchParams.get('resumeVersionId');

    if (!resumeVersionId) {
      return NextResponse.json(
        { error: 'resumeVersionId is required' },
        { status: 400 }
      );
    }

    // Fetch comments for the version
    const { data: comments, error } = await supabaseServer
      .from('resume_comments')
      .select('*')
      .eq('resume_version_id', resumeVersionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: { comments: comments || [] },
    });

  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, resolved } = UpdateCommentSchema.parse(body);

    // Update comment
    const { data: comment, error } = await supabaseServer
      .from('resume_comments')
      .update({ resolved })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Track comment resolved event
    await trackEvent({
      userId: mockUserId,
      event: 'COMMENT_RESOLVED',
      resumeVersionId: comment.resume_version_id,
      metadata: {
        commentId: id,
        resolved,
        author: comment.author,
      },
    });

    return NextResponse.json({
      success: true,
      data: comment,
    });

  } catch (error) {
    console.error('Update comment error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}
