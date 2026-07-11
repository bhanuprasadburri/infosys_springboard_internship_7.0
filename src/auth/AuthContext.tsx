import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (fullName: string, email: string, password: string, role: User['role']) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const demoUser: User = {
  id: 'u-1',
  fullName: 'Ava Chen',
  email: 'ava@sentinelcore.com',
  role: 'Security Admin',
};

const formatFullName = (email: string) => {
  const name = email.split('@')[0].replace(/[._-]+/g, ' ');
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    if (email && password) {
      const existingUser = email === demoUser.email ? demoUser : null;
      setUser(existingUser ?? {
        id: crypto.randomUUID(),
        fullName: formatFullName(email),
        email,
        role: 'Viewer',
      });
      return true;
    }
    return false;
  };

  const signup = (fullName: string, email: string, password: string, role: User['role']) => {
    if (fullName && email && password) {
      setUser({ id: crypto.randomUUID(), fullName, email, role });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
