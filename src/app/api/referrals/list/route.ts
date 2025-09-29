import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // For now, use a placeholder user ID (replace with real auth later)
    const userId = 'placeholder-user-id';

    // Get referrals for the user
    const { data: referrals, error } = await supabaseServer
      .from('referrals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch referrals' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      referrals: referrals || [],
    });
  } catch (error) {
    console.error('Error in referrals list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
