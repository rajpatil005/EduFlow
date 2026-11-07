import  {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {
  AuthContextType,
  AuthUser,
} from  '../types/auth';

export const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}


const STORAGE_KEY = 'eduflow_user';

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);

      if (savedUser) {
        const parsedUser: unknown = JSON.parse(savedUser);

        if (
          typeof parsedUser === 'object' &&
          parsedUser !== null &&
          'id' in parsedUser &&
          'name' in parsedUser &&
          'email' in parsedUser &&
          'role' in parsedUser &&
            typeof parsedUser.id === 'string' &&
          typeof parsedUser.name === 'string' &&
           typeof parsedUser.email === 'string' &&
          typeof parsedUser.role === 'string' &&
          ['ADMIN', 'HOD', 'TEACHER', 'STUDENT'].includes(
            parsedUser.role
          )
        ) {
          setUser(parsedUser as AuthUser);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((authenticatedUser: AuthUser) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(authenticatedUser)
    );

    setUser(authenticatedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
