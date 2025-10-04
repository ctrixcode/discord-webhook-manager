import React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Providers from '@/lib/providers';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Discord Webhook Manager',
  description: 'Manage your Discord webhooks with ease',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Discord Webhook Manager',
    description: 'Manage your Discord webhooks with ease',
    url: 'https://discord-webhook-manager.vercel.app',
    images: [
      {
        url: '/favicon.png',
        width: 256,
        height: 256,
        alt: 'Discord Webhook Manager',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <Analytics />
        <meta
          name="google-site-verification"
          content="7PSk6bAhkuIK6tkLoDHIHaW34OdbhkY7oX0vEDqa7ms"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
