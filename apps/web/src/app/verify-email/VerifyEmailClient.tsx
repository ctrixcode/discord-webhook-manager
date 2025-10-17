'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { ApiError } from '@/lib/error';

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    'verifying' | 'success' | 'error' | 'warning'
  >('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setError(
          'Verification token is missing. Please check your email link.'
        );
        return;
      }

      try {
        const response = await apiClient.verifyEmail(token);

        if (response.success) {
          setStatus('success');
          // Redirect to dashboard after successful verification
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } catch (err) {
        console.error('Verification error:', err);

        if (err instanceof ApiError) {
          // Check if the error is about an already-used token
          if (err.errCode === 'VERIFICATION_TOKEN_ALREADY_USED_ERROR') {
            setStatus('warning');
          } else {
            setStatus('error');
          }
          setError(err.message);
        } else if (err instanceof Error) {
          setStatus('error');
          setError(err.message);
        } else {
          setStatus('error');
          setError('An unknown error occurred during verification.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (status === 'success') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <svg
              className="w-20 h-20 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Email Verified!</h1>
          <p className="text-lg text-white/70 mb-8">
            Your email has been successfully verified. Redirecting to
            dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'warning') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <svg
              className="w-20 h-20 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Already Verified</h1>
          <p className="text-lg text-yellow-400 mb-8">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <svg
              className="w-20 h-20 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Verification Failed</h1>
          <p className="text-lg text-red-400 mb-8">{error}</p>
          <button
            onClick={() => router.push('/signup')}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400 border-b-transparent"></div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Verifying your email...</h1>
        <p className="text-lg text-white/70">
          Please wait while we verify your account.
        </p>
      </div>
    </div>
  );
}
