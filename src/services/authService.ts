import type { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

const API_BASE = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { message?: string }).message || 'Authentication request failed.');
  }

  return payload as T;
}

export async function adminLogin(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/admin/login', { body: { email, password } });
}

export async function userLogin(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/user/login', { body: { email, password } });
}

export async function userSignup(fullName: string, email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/user/signup', { body: { fullName, email, password } });
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/forgot-password', { body: { email } });
}
