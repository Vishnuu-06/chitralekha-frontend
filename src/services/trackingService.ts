import { request } from './api';
import { UserTrackingRecord, TrackingStatus } from '../types';

export const trackingService = {
  updateTracking: (contentId: number, data: { status: TrackingStatus; progress?: number; isFavorite?: boolean }) =>
    request<UserTrackingRecord>(`/tracking/${contentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTrackingForContent: (contentId: number) =>
    request<UserTrackingRecord | { tracked: false }>(`/tracking/${contentId}`),

  deleteTracking: (contentId: number) =>
    request<{ message: string }>(`/tracking/${contentId}`, {
      method: 'DELETE',
    }),

  getUserTracking: (username: string, status?: string) => {
    let url = `/tracking/user/${encodeURIComponent(username)}`;
    if (status && status !== 'ALL') {
      url += `?status=${encodeURIComponent(status)}`;
    }
    return request<UserTrackingRecord[]>(url);
  },
};
