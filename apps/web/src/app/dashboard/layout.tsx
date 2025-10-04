'use client';

import type React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard-header';
import { FloatingNavigation } from '@/components/floating-navigation';
import { AuthProvider } from '@/contexts/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEffect } from 'react';
import { STALE_TIME_FIVE_MINUTES } from '@/constants/app';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch webhooks
    queryClient.prefetchQuery({
      queryKey: ['webhooks', { isActive: true }],
      queryFn: ({ queryKey }) =>
        api.webhook.getAllWebhooks({
          queryKey: queryKey as [string, { isActive?: boolean }],
        }),
      staleTime: STALE_TIME_FIVE_MINUTES, // 5 minutes
    });

    // Prefetch avatars
    queryClient.prefetchQuery({
      queryKey: ['avatars'],
      queryFn: () => api.avatar.getAllAvatars(),
      staleTime: STALE_TIME_FIVE_MINUTES, // 5 minutes
    });

    // Prefetch message templates
    queryClient.prefetchQuery({
      queryKey: ['messageTemplates'],
      queryFn: () => api.template.getAllTemplates(),
      staleTime: STALE_TIME_FIVE_MINUTES, // 5 minutes
    });
  }, [queryClient]);

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen">
          <DashboardHeader />
          <main className="p-6 pb-24">{children}</main>
          <FloatingNavigation />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
