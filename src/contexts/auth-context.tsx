'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, apiClient, type User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize and check authentication on mount
    const initAuth = async () => {
      try {
        // Check if we have a token
        if (api.auth.isAuthenticated()) {
          // Try to get current user to verify token is valid
          const currentUser = await api.user.getCurrentUser();
          setUser(currentUser);
        }
      } catch {
        // Token is invalid, clear it
        console.log('Token invalid, clearing auth');
        apiClient.clearAccessToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = () => {
    // Redirect to Discord OAuth
    api.auth.loginWithDiscord();
  };

  const logout = () => {
    setUser(null);
    api.auth.logout();
  };

  const isAuthenticated = !!user && api.auth.isAuthenticated();

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
