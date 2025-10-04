'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DiscordLogo } from '@/components/discord-logo';

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Attempt to fetch user data. This will trigger the token refresh flow if a cookie exists.
        await api.user.getCurrentUser();
        // If the above call succeeds, the user is authenticated.
        router.push('/dashboard');
      } catch (_error) {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        // If it fails, it means no valid session exists. Stay on the login page.
        setIsChecking(false);
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDiscordLogin = () => {
    api.auth.loginWithDiscord();
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="text-lg mt-4">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
      <DiscordLogo className="w-24 h-24 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
      <p className="text-lg mb-8 max-w-md">
        Please log in with your Discord account to manage your webhooks.
      </p>
      <button
        onClick={handleDiscordLogin}
        className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        <DiscordLogo className="w-6 h-6" />
        Login with Discord
      </button>
    </div>
  );
}
