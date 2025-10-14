'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DiscordLogo, GoogleLogo } from '@/components/logo';

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.user.getCurrentUser();
        router.push('/dashboard');
      } catch {
        setIsChecking(false);
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDiscordLogin = async () => {
    try {
      setError(null);
      setSubmitting(true);
      api.auth.loginWithDiscord();
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setSubmitting(true);
      api.auth.loginWithGoogle();
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueFromEmail = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setEmailError(null);

    if (!email) return;

    // Validate email format
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setStep('password');
    // focus password after it renders
    setTimeout(() => passwordInputRef.current?.focus(), 0);
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      setPasswordError(null);

      // Validate password length
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters long.');
        return;
      }

      setSubmitting(true);
      await api.auth.loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStepSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (step === 'email') {
      return handleContinueFromEmail(e);
    }
    return handleEmailLogin(e);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
        <p className="text-lg mt-4">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
      <DiscordLogo className="w-24 h-24 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
      <p className="text-lg mb-8 max-w-md">Please log in to continue.</p>

      <div className="w-full max-w-sm flex flex-col items-stretch text-left">
        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handleDiscordLogin}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-opacity-80 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitting ? (
              <div
                className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent"
                aria-hidden="true"
              />
            ) : (
              <DiscordLogo className="w-5 h-5" />
            )}
            <span className="sr-only">
              {submitting ? 'Loading' : 'Discord'}
            </span>
            <span aria-hidden="true">
              {submitting ? 'Loading...' : 'Login with Discord'}
            </span>
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitting ? (
              <div
                className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent"
                aria-hidden="true"
              />
            ) : (
              <GoogleLogo />
            )}
            <span className="sr-only">{submitting ? 'Loading' : 'Google'}</span>
            <span aria-hidden="true">
              {submitting ? 'Loading...' : 'Login with Google'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-sm text-white/70">or</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              onBlur={e => {
                if (e.target.value && !isValidEmail(e.target.value)) {
                  setEmailError('Please enter a valid email address.');
                }
              }}
              className={`rounded-lg border ${emailError ? 'border-red-400' : 'border-white/20'} bg-transparent px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
              placeholder="you@example.com"
            />
            {emailError ? (
              <p className="text-red-400 text-sm">{emailError}</p>
            ) : null}
          </div>

          {/* Password step is only shown after email */}
          {step === 'password' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  ref={passwordInputRef} // focus when revealing
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setPasswordError(null);
                  }}
                  onBlur={e => {
                    if (e.target.value && e.target.value.length < 8) {
                      setPasswordError(
                        'Password must be at least 8 characters long.'
                      );
                    }
                  }}
                  className={`w-full rounded-lg border ${passwordError ? 'border-red-400' : 'border-white/20'} bg-transparent px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${passwordError ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    // eye-off
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    // eye
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError ? (
                <p className="text-red-400 text-sm">{passwordError}</p>
              ) : null}
            </div>
          )}

          {error ? (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          ) : null}

          {/* CTA changes by step */}
          {step === 'email' ? (
            <button
              type="submit"
              onClick={handleContinueFromEmail}
              disabled={submitting || !email || !isValidEmail(email)}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !password || password.length < 8}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {submitting ? (
                <div
                  className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent"
                  aria-hidden="true"
                />
              ) : null}
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          )}
        </form>

        {/* Toggle link */}
        <p className="text-sm text-white/80 mt-6 text-center">
          {'Don’t have an account? '}
          <Link
            href="/signup"
            className="underline hover:text-white transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
