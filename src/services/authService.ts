import { request } from './api';
import { UserSummary } from '../types';

export const authService = {
  register: (data: { username: string; email: string; password: string }) =>
    request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { usernameOrEmail: string; password: string }) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<UserSummary>('/auth/me'),

  deleteAccount: () =>
    request<{ message: string }>('/auth/account', {
      method: 'DELETE',
    }),
};
