import { AuthProvider } from '@/contexts/auth-context';
import type React from 'react';

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
