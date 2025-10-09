import { AuthProvider } from '@/contexts/auth-context';
import type React from 'react';

interface LayoutProps {
  children: any; // Changed to any
}

export default function AuthLayout({ children }: LayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
