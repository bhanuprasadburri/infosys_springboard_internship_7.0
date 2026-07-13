import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

const STORAGE_KEY = 'sentinelcore-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persistUser = (nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = (email: string, password: string) => {
    if (email && password) {
      const existingUser = email === demoUser.email ? demoUser : null;
      persistUser(existingUser ?? {
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
      persistUser({ id: crypto.randomUUID(), fullName, email, role });
      return true;
    }
    return false;
  };

  const logout = () => persistUser(null);

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function canPerformAction(user: User | null, action: 'view' | 'patch' | 'assign' | 'scale' | 'export' | 'close' | 'escalate' | 'resolve' | 'review') {
  if (!user) return false;
  if (user.role === 'Security Admin') return true;
  if (user.role === 'Auditor') {
    return action === 'view' || action === 'export' || action === 'review';
  }
  return action === 'view';
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
