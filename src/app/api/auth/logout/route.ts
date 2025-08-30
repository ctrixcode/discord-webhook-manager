import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This route clears the refresh token cookie.
export async function POST() {
  try {
    const cookieStore = await cookies();
    // Clear the refresh token cookie by setting its maxAge to 0
    cookieStore.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
