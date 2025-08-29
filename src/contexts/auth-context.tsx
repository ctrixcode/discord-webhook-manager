'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, apiClient } from '@/lib/api';
import { type User } from '@/lib/api/types/user';

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
        // Attempt to get the current user. The apiClient's interceptor will handle token refresh if needed.
        const currentUser = await api.user.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // If getCurrentUser fails (e.g., no token, refresh failed, or other API error),
        // it means the user is not authenticated or an error occurred.
        console.error('Authentication check failed, logging out.', error);
        setUser(null);
        apiClient.clearAccessToken(); // Ensure in-memory token is cleared
        // No explicit redirect here, as apiClient's interceptor handles redirect on refresh failure.
      } finally {
        setIsLoading(false);
      };
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
