import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const ReferralImportSchema = z.object({
  person_name: z.string().min(1),
  email: z.string().email().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  relationship: z.string().optional(),
  strength: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'CSV file is required' },
        { status: 400 }
      );
    }

    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Parse CSV file
    const Papa = (await import('papaparse')).default;
    const text = await file.text();
    const parsed = Papa.parse(text, { 
      header: true, 
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace(/\s+/g, '_'),
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: 'CSV parsing errors', details: parsed.errors },
        { status: 400 }
      );
    }

    // Validate and transform data
    const referrals = [];
    const errors = [];

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i] as any;
      
      try {
        const validated = ReferralImportSchema.parse({
          person_name: row.person_name,
          email: row.email || undefined,
          company: row.company || undefined,
          role: row.role || undefined,
          relationship: row.relationship || undefined,
          strength: row.strength ? parseInt(row.strength) : undefined,
          notes: row.notes || undefined,
        });

        referrals.push({
          user_id: userId,
          ...validated,
          created_at: new Date().toISOString(),
        });
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error instanceof z.ZodError ? error.errors : 'Validation failed',
        });
      }
    }

    if (referrals.length === 0) {
      return NextResponse.json(
        { error: 'No valid referrals found', details: errors },
        { status: 400 }
      );
    }

    // Insert referrals into database
    const { error: insertError } = await supabaseServer
      .from('referrals')
      .insert(referrals);

    if (insertError) {
      console.error('Error inserting referrals:', insertError);
      return NextResponse.json(
        { error: 'Failed to import referrals' },
        { status: 500 }
      );
    }

    // Track the import event
    await trackEvent({
      userId,
      event: 'REFERRAL_IMPORTED',
      metadata: {
        count: referrals.length,
        errors: errors.length,
      },
    });

    return NextResponse.json({
      success: true,
      imported: referrals.length,
      errors: errors.length,
      details: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error importing referrals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
