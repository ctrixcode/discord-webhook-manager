import type React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard-header';
import { FloatingNavigation } from '@/components/floating-navigation';
import { AuthProvider } from '@/contexts/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
          <DashboardHeader />
          <main className="p-6 pb-24">{children}</main>
          <FloatingNavigation />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
