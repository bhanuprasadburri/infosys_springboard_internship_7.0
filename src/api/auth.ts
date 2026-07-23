import { apiClient } from './client';

export interface AuthResponse {
  user: { id: string; fullName: string; email: string; role: string };
  token: string;
}

export const authApi = {
  signup: (fullName: string, email: string, password: string) =>
    apiClient.post('/auth/signup', { fullName, email, password }),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
};
