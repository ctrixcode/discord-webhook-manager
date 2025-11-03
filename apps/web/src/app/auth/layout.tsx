import { AuthProvider } from '@/contexts/auth-context';
import type React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
