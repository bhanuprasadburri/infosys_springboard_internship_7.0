import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { clearSession, readSession, verifyAdminCredential } from '../utils/authUtils';
import { authApi } from '../api/auth';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  authMode: 'admin' | 'user' | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  signup: (fullName: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  toggleTheme?: () => void;
  themeMode?: 'light' | 'dark';
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'admin' | 'user' | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const session = readSession();
    if (session?.user) {
      setUser(session.user);
      setAuthMode(session.mode);
    }
    const storedTheme = window.localStorage.getItem('sentinelcore-theme-mode');
    if (storedTheme === 'dark') {
      setThemeMode('dark');
    }
  }, []);

  const persistUser = (nextUser: User | null, mode: 'admin' | 'user' | null = null, token?: string, rememberMe = true) => {
    setUser(nextUser);
    setAuthMode(mode);
    if (nextUser && mode) {
      const payload = { user: nextUser, token: token || `${mode}-token`, mode, expiresAt: Date.now() + 1000 * 60 * 60 * 8 };
      const storage = rememberMe ? window.localStorage : window.sessionStorage;
      storage.setItem('sentinelcore-auth-session', JSON.stringify(payload));
      storage.setItem('sentinelcore-auth-mode', mode);
    } else {
      clearSession();
    }
  };

  const login = async (email: string, password: string, rememberMe = true): Promise<AuthResult> => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    const normalizedEmail = email.trim().toLowerCase();
    try {
      if (verifyAdminCredential(normalizedEmail, password)) {
        const adminUser: User = { id: 'admin-1', fullName: 'Bhanu Prasad Burri', email: normalizedEmail, role: 'Security Admin' };
        persistUser(adminUser, 'admin', 'admin-token', rememberMe);
        return { success: true };
      }

      const result = await authApi.login(normalizedEmail, password);
      const userPayload: User = {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role as User['role'],
      };
      persistUser(userPayload, 'user', result.token, rememberMe);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      return { success: false, error: message };
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<AuthResult> => {
    if (!fullName || !email || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const result = await authApi.signup(fullName.trim(), normalizedEmail, password);
      const userPayload: User = {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role as User['role'],
      };
      persistUser(userPayload, 'user', result.token);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create account.';
      return { success: false, error: message };
    }
  };

  const logout = () => persistUser(null);

  const toggleTheme = () => {
    setThemeMode((value) => {
      const next = value === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('sentinelcore-theme-mode', next);
      return next;
    });
  };

  const value = useMemo(() => ({ user, authMode, isAuthenticated: Boolean(user), login, signup, logout, toggleTheme, themeMode }), [authMode, themeMode, user]);

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
