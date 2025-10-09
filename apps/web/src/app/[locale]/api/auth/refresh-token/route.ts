import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { SuccessResponse } from '@repo/shared-types';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token not provided' },
        { status: 400 }
      );
    }

    // Make a request to the backend's refresh endpoint
    const userAgent = req.headers.get('user-agent');

    const backendResponse = await axios.post(
      `${BACKEND_API_URL}/auth/refresh`,
      { refreshToken }, // Send refresh token in the body
      {
        withCredentials: true, // Ensure cookies are sent to the backend (if any, though not for refresh token here)
        headers: {
          'User-Agent': userAgent || '',
        },
      }
    );
    const respData: SuccessResponse<RefreshTokenResponse> | undefined =
      backendResponse.data;
    if (!respData) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = respData.data!;
    if (!accessToken) {
      return NextResponse.json(
        { message: 'New access token not found' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ accessToken }, { status: 200 });

    // Set the new refresh token in an HttpOnly cookie
    if (newRefreshToken) {
      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error details:',
        error.response?.data,
        error.response?.status,
        error.response?.headers
      );
      return NextResponse.json(error.response?.data, {
        status: error.response?.status,
      });
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
