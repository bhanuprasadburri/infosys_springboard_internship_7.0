export const STORAGE_KEYS = {
  authSession: 'sentinelcore-auth-session',
  authMode: 'sentinelcore-auth-mode',
  themeMode: 'sentinelcore-theme-mode',
};

const ADMIN_CREDENTIAL = {
  email: 'bhanu@gmail.com',
  password: 'Bhanu@',
};

export const sanitizeInput = (value: string) => String(value || '').trim().replace(/\s+/g, ' ');

export const isStrongPassword = (value: string) => {
  const password = String(value || '');
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const verifyAdminCredential = (email: string, password: string) => {
  return email.trim().toLowerCase() === ADMIN_CREDENTIAL.email && password === ADMIN_CREDENTIAL.password;
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEYS.authSession);
  window.localStorage.removeItem(STORAGE_KEYS.authMode);
  window.sessionStorage.removeItem(STORAGE_KEYS.authSession);
  window.sessionStorage.removeItem(STORAGE_KEYS.authMode);
};

export const readSession = () => {
  if (typeof window === 'undefined') return null;
  const sources = [window.localStorage, window.sessionStorage];
  for (const storage of sources) {
    const raw = storage.getItem(STORAGE_KEYS.authSession);
    if (!raw) continue;
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
  }
  return null;
};

export const persistThemeMode = (mode: 'light' | 'dark') => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.themeMode, mode);
};

export const readThemeMode = () => {
  if (typeof window === 'undefined') return 'light' as const;
  const value = window.localStorage.getItem(STORAGE_KEYS.themeMode);
  return value === 'dark' ? 'dark' : 'light';
};
