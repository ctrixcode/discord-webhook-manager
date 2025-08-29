'use client';

import { redirect } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const handleDiscordLogin = () => {
    api.auth.loginWithDiscord();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Discord Webhook Manager</h1>
      <p className="text-lg mb-8">Please login with Discord to continue.</p>
      <button
        onClick={handleDiscordLogin}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with Discord
      </button>
    </div>
  );
}
