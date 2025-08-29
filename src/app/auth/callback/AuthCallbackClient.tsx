'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's an access token in the URL params
        const accessToken = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError('Authentication failed. Please try again.');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        if (accessToken) {
          // Set the access token in our client
          apiClient.setAccessToken(accessToken);
          
          // The auth context will automatically fetch user data
          // and redirect to dashboard once user is set
          return;
        }

        // If no token in params, this might be a direct access
        // Redirect to home
        router.push('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg font-medium">
            {error}
          </div>
          <div className="text-muted-foreground">
            Redirecting to home page...
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
          Completing authentication...
        </div>
      </div>
    </div>
  );
}