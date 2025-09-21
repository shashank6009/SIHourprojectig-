import { NextResponse } from 'next/server';
import { users } from '@/lib/users';

export async function GET() {
  try {
    // Return users for authentication (including passwords for auth comparison)
    // In production, this should be secured and not expose passwords
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Users are now exported from @/lib/users
