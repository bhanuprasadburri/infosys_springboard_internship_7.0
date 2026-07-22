import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { clearSession, readSession } from '../utils/authUtils';

interface AuthContextValue {
  user: User | null;
  authMode: 'admin' | 'user' | null;
  login: (email: string, password: string) => boolean;
  signup: (fullName: string, email: string, password: string, role: User['role']) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    const session = readSession();
    if (session?.user) {
      setUser(session.user);
      setAuthMode(session.mode);
    }
  }, []);

  const persistUser = (nextUser: User | null, mode: 'admin' | 'user' | null = null) => {
    setUser(nextUser);
    setAuthMode(mode);
    if (nextUser && mode) {
      localStorage.setItem('sentinelcore-auth-session', JSON.stringify({ user: nextUser, token: `${mode}-token`, mode, expiresAt: Date.now() + 1000 * 60 * 60 * 8 }));
      localStorage.setItem('sentinelcore-auth-mode', mode);
    } else {
      clearSession();
    }
  };

  const login = (email: string, password: string) => {
    if (!email || !password) return false;
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === 'bhanu@gmail.com' && password === 'Bhanu@') {
      const adminUser = { id: 'admin-1', fullName: 'Admin User', email: normalizedEmail, role: 'Security Admin' as const };
      persistUser(adminUser, 'admin');
      return true;
    }
    const storedUsers = localStorage.getItem('sentinelcore-users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const matchedUser = users.find((entry: { email: string; password: string }) => entry.email === normalizedEmail && entry.password === password);
    if (matchedUser) {
      persistUser({ id: matchedUser.id, fullName: matchedUser.fullName, email: matchedUser.email, role: 'Viewer' as const }, 'user');
      return true;
    }
    return false;
  };

  const signup = (fullName: string, email: string, password: string, role: User['role']) => {
    if (!fullName || !email || !password) return false;
    const normalizedEmail = email.trim().toLowerCase();
    const storedUsers = localStorage.getItem('sentinelcore-users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    if (users.some((entry: { email: string }) => entry.email === normalizedEmail)) return false;
    const newUser = { id: crypto.randomUUID(), fullName: fullName.trim(), email: normalizedEmail, password, role };
    users.push(newUser);
    localStorage.setItem('sentinelcore-users', JSON.stringify(users));
    persistUser({ id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: 'Viewer' as const }, 'user');
    return true;
  };

  const logout = () => persistUser(null);

  const value = useMemo(() => ({ user, authMode, login, signup, logout }), [authMode, user]);

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
