import { request } from './api';
import { ListSummary } from '../types';

export const listService = {
  getPublicLists: () => request<ListSummary[]>('/lists'),

  getUserLists: (username: string) => request<ListSummary[]>(`/lists/user/${encodeURIComponent(username)}`),

  getListDetails: (id: number) => request<ListSummary>(`/lists/${id}`),

  createList: (data: { name: string; description?: string; visibility?: string }) =>
    request<ListSummary>('/lists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateList: (id: number, data: { name?: string; description?: string; visibility?: string }) =>
    request<ListSummary>(`/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteList: (id: number) =>
    request<{ message: string }>(`/lists/${id}`, {
      method: 'DELETE',
    }),

  addItem: (listId: number, contentId: number, notes?: string) =>
    request<any>(`/lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify({ contentId, notes }),
    }),

  removeItem: (listId: number, contentId: number) =>
    request<{ message: string }>(`/lists/${listId}/items/${contentId}`, {
      method: 'DELETE',
    }),
};
