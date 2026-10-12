import { request } from './api';
import { NotificationItem } from '../types';

export const notificationService = {
  getNotifications: () => request<NotificationItem[]>('/notifications'),

  getUnreadCount: () => request<{ unreadCount: number }>('/notifications/unread-count'),

  markAsRead: (id: number) =>
    request<{ message: string }>(`/notifications/${id}/read`, {
      method: 'PUT',
    }),

  markAllAsRead: () =>
    request<{ message: string }>('/notifications/read-all', {
      method: 'PUT',
    }),
};
