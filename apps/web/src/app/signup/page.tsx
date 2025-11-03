'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DiscordLogo, GoogleLogo } from '@/components/logo';
import { ErrorResponse } from '@repo/shared-types';

export default function SignupPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Preserve current session-checking logic
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

  const handleDiscordSignup = async () => {
    try {
      setError(null);
      setSubmitting(true);
      api.auth.loginWithDiscord(); // OAuth handles both login/signup
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError(null);
      setSubmitting(true);
      api.auth.loginWithGoogle(); // OAuth handles both login/signup
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      setEmailError(null);
      setPasswordError(null);

      // Validate email format
      if (!isValidEmail(email)) {
        setEmailError('Please enter a valid email address.');
        return;
      }

      // Validate password length
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters long.');
        return;
      }

      // Require display name and username before signup
      if (!displayName.trim() || !username.trim()) {
        setError('Please enter your display name and username.');
        return;
      }

      // Validate confirm password before submitting
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setSubmitting(true);
      await api.auth.signupWithEmail(email, password, displayName, username);
      setVerificationSent(true);
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error?.message || 'Failed to sign up. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
        <p className="text-lg mt-4">Checking your session...</p>
      </div>
    );
  }

  if (verificationSent) {
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
          <h1 className="text-4xl font-bold mb-4">Check your email!</h1>
          <p className="text-lg mb-4">
            We sent a verification link to{' '}
            <strong className="text-blue-400">{email}</strong>
          </p>
          <p className="text-white/70 mb-8">
            Click the link in the email to verify your account and complete
            signup. The link will expire in 24 hours.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-white/80">
              <strong className="text-white">Didn't receive the email?</strong>
              <br />
              Check your spam folder or try signing up again.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
      <DiscordLogo className="w-24 h-24 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Create your account</h1>
      <p className="text-lg mb-8 max-w-md">Sign up to get started.</p>

      <div className="w-full max-w-sm flex flex-col items-stretch text-left">
        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handleDiscordSignup}
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
              {submitting ? 'Loading...' : 'Sign up with Discord'}
            </span>
          </button>

          <button
            onClick={handleGoogleSignup}
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
              {submitting ? 'Loading...' : 'Sign up with Google'}
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
        <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              autoComplete="name"
              required
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your display name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Create a username"
            />
          </div>

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

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
                placeholder="Create a password"
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

          {/* Confirm password with eye toggle */}
          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
                onClick={() => setShowConfirmPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
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
            {confirmPassword && password !== confirmPassword ? (
              <p className="text-red-400 text-sm">Passwords do not match.</p>
            ) : null}
          </div>

          {error ? (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={
              submitting ||
              !displayName.trim() ||
              !username.trim() ||
              !email ||
              !password ||
              !confirmPassword ||
              !!emailError ||
              !!passwordError ||
              password !== confirmPassword
            }
            className="mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitting ? (
              <div
                className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent"
                aria-hidden="true"
              />
            ) : null}
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Toggle link */}
        <p className="text-sm text-white/80 mt-6 text-center">
          {'Already have an account? '}
          <Link
            href="/login"
            className="underline hover:text-white transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
