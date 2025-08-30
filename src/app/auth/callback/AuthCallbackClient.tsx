'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, api } from '@/lib/api';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          // 1. Set access token in memory
          apiClient.setAccessToken(accessToken);

          // 2. Send refresh token to our API route to set it as an HttpOnly cookie
          const cookieResponse = await fetch('/api/auth/set-refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!cookieResponse.ok) {
            throw new Error('Failed to set refresh token cookie.');
          }

          // 3. Manually trigger user fetch and redirect
          // The AuthProvider will typically handle this, but we can be explicit
          await api.user.getCurrentUser(); // This re-validates and populates the auth context
          router.push('/dashboard');

        } catch (err) {
          console.error('Auth callback error:', err);
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
          setError(`Authentication process failed: ${errorMessage}`);
          setTimeout(() => router.push('/login'), 5000);
        }
      } else {
        // If tokens are missing, it's an invalid callback
        setError('Invalid authentication callback. Missing tokens.');
        setTimeout(() => router.push('/login'), 5000);
      }
    };

    handleCallback();
    // We only want this to run once when the component mounts and searchParams are available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-4">
          <div className="text-red-500 text-lg font-medium">
            {error}
          </div>
          <div className="text-muted-foreground">
            Redirecting to login page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <div className="text-muted-foreground">
          Completing authentication, please wait...
        </div>
      </div>
    </div>
  );
}
