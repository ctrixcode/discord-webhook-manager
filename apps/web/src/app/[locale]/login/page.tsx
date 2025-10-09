'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DiscordLogo } from '@/components/discord-logo';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('login');
  const [isChecking, setIsChecking] = useState(true);

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

  const handleDiscordLogin = () => {
    api.auth.loginWithDiscord();
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="text-lg mt-4">{t('checking')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
      <DiscordLogo className="w-24 h-24 mb-6" />
      <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
      <p className="text-lg mb-8 max-w-md">{t('loginMessage')}</p>
      <button
        onClick={handleDiscordLogin}
        className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        <DiscordLogo className="w-6 h-6" />
        {t('loginButton')}
      </button>
    </div>
  );
}
