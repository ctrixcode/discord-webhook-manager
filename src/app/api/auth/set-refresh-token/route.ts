import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This route sets the refresh token as an HttpOnly cookie.
export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    // Set the refresh token in an HttpOnly, secure cookie
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ message: 'Refresh token set successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error setting refresh token:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
