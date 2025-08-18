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
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (api.auth.isAuthenticated()) {
          const currentUser = await api.user.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed, logging out.', error);
        setUser(null);
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
