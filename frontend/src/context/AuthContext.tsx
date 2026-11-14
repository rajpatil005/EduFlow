import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthContextType, AuthUser } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'eduflow_user';
const TOKEN_KEY = 'token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((authenticatedUser: AuthUser, token: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(authenticatedUser));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(authenticatedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, isAuthenticated: user !== null, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};