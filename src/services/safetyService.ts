import { request } from './api';

export const safetyService = {
  submitReport: (data: { reportedType: 'POST' | 'COMMENT' | 'REVIEW' | 'USER'; targetId: number; reason: string; details?: string }) =>
    request<any>('/safety/report', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleBlockUser: (username: string) =>
    request<{ blocked: boolean; message: string }>(`/safety/block/${encodeURIComponent(username)}`, {
      method: 'POST',
    }),

  isUserBlocked: (username: string) =>
    request<{ blocked: boolean }>(`/safety/block/${encodeURIComponent(username)}`),

  getBlockedList: () => request<any[]>('/safety/blocked'),
};
