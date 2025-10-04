'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { type User } from '@/lib/api/types/user';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/auth/callback'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await api.user.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Authentication check failed:', error);
        if (error instanceof AxiosError && error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('accessToken');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Skip auth check on public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsLoading(false);
      return;
    }

    initAuth();
  }, [pathname]);

  const login = () => {
    api.auth.loginWithDiscord();
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to clear refresh token cookie', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
