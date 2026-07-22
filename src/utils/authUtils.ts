export const STORAGE_KEYS = {
  authSession: 'sentinelcore-auth-session',
  authMode: 'sentinelcore-auth-mode',
};

export const sanitizeInput = (value: string) => value.trim().replace(/\s+/g, ' ');

export const isStrongPassword = (value: string) => {
  return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
};

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const createSession = (user: { id: string; fullName: string; email: string; role: string }, token: string, mode: 'admin' | 'user') => {
  const payload = { user, token, mode, expiresAt: Date.now() + 1000 * 60 * 60 * 8 };
  localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(payload));
  localStorage.setItem(STORAGE_KEYS.authMode, mode);
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.authSession);
  localStorage.removeItem(STORAGE_KEYS.authMode);
};

export const readSession = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.authSession);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    clearSession();
    return null;
  }
};
