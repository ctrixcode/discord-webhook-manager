'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { DiscordLogo, GoogleLogo } from '@/components/logo';
import { ErrorResponse } from '@repo/shared-types';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('login');
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
  }, [router]);

  const handleDiscordLogin = async () => {
    try {
      setError(null);
      setSubmitting(true);
      // In a real app, this redirects, so finally block is usually hit on a new page load
      api.auth.loginWithDiscord();
    } finally {
      // Mock reset for demo environment
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setSubmitting(true);
      api.auth.loginWithGoogle();
    } finally {
      // Mock reset for demo environment
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
      setEmailError(t('form.errorInvalidEmail'));
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
        setPasswordError(t('form.errorShortPassword'));
        return;
      }

      setSubmitting(true);
      await api.auth.loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      // Ensure error is treated as ErrorResponse if possible
      const errorResponse = err as ErrorResponse;
      setError(errorResponse?.message || t('form.errorSignInFailed'));
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
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-white bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
        <p className="text-lg mt-4">{t('loading.sessionCheck')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white bg-gray-900 font-inter">
      <DiscordLogo className="w-24 h-24 mb-6 text-[#5865F2]" />
      <h1 className="text-4xl font-extrabold mb-2">{t('header.title')}</h1>
      <p className="text-lg text-gray-400 mb-8 max-w-sm">
        {t('header.subtitle')}
      </p>

      <div className="w-full max-w-sm flex flex-col items-stretch text-left p-6 bg-gray-800 rounded-xl shadow-2xl">
        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handleDiscordLogin}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md focus:ring-4 focus:ring-[#5865F2]/50"
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
              {submitting ? t('oauth.loadingAlt') : t('oauth.discordAlt')}
            </span>
            <span aria-hidden="true">
              {submitting ? t('oauth.loading') : t('oauth.discord')}
            </span>
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md focus:ring-4 focus:ring-gray-700/50"
          >
            {submitting ? (
              <div
                className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent"
                aria-hidden="true"
              />
            ) : (
              <GoogleLogo />
            )}
            <span className="sr-only">
              {submitting ? t('oauth.loadingAlt') : t('oauth.googleAlt')}
            </span>
            <span aria-hidden="true">
              {submitting ? t('oauth.loading') : t('oauth.google')}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-sm text-gray-400 font-semibold">
            {t('divider.or')}
          </span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              {t('form.emailLabel')}
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
                  setEmailError(t('form.errorInvalidEmail'));
                }
              }}
              className={`rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-600'} bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              placeholder={t('form.emailPlaceholder')}
              aria-invalid={!!emailError}
            />
            {emailError ? (
              <p className="text-red-400 text-xs italic">{emailError}</p>
            ) : null}
          </div>

          {/* Password step is only shown after email */}
          {step === 'password' && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                {t('form.passwordLabel')}
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
                      setPasswordError(t('form.errorShortPassword'));
                    }
                  }}
                  className={`w-full rounded-lg border ${passwordError ? 'border-red-500' : 'border-gray-600'} bg-gray-700 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${passwordError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  placeholder={t('form.passwordPlaceholder')}
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? t('form.passwordHide')
                      : t('form.passwordShow')
                  }
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-600"
                >
                  {showPassword ? (
                    // eye-off icon
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10.5-7-10.5-7a1.05 1.05 0 0 1 0-.5 10.07 10.07 0 0 1 2.3-3.7l1.5-1.5M7.06 7.06A10.07 10.07 0 0 1 12 4c7 0 10.5 7 10.5 7a1.05 1.05 0 0 1 0 .5 10.07 10.07 0 0 1-2.3 3.7l-1.5 1.5M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path d="M2.5 2.5l19 19" />
                    </svg>
                  ) : (
                    // eye icon
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError ? (
                <p className="text-red-400 text-xs italic">{passwordError}</p>
              ) : null}
            </div>
          )}

          {error ? (
            <p
              role="alert"
              className="text-red-400 text-sm mt-1 p-2 bg-red-900/30 border border-red-900 rounded-md"
            >
              {error}
            </p>
          ) : null}

          {/* CTA changes by step */}
          {step === 'email' ? (
            <button
              type="submit"
              onClick={handleContinueFromEmail}
              disabled={submitting || !email || !isValidEmail(email)}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg focus:ring-4 focus:ring-blue-600/50"
            >
              {t('form.buttonContinue')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !password || password.length < 8}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg focus:ring-4 focus:ring-blue-600/50"
            >
              {submitting ? (
                <div
                  className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent"
                  aria-hidden="true"
                />
              ) : null}
              {submitting ? t('form.buttonSigningIn') : t('form.buttonSignIn')}
            </button>
          )}
        </form>

        {/* Toggle link */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          {t('footer.noAccount')}{' '}
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
          >
            {t('footer.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
