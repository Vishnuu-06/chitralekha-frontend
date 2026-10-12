import { request } from './api';

export const reviewService = {
  rateContent: (contentId: number, score: number, review?: string) =>
    request<any>(`/ratings/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ score, review }),
    }),

  deleteRating: (contentId: number) =>
    request<{ message: string }>(`/ratings/${contentId}`, {
      method: 'DELETE',
    }),

  createReview: (contentId: number, data: { title: string; body: string; score?: number; containsSpoilers?: boolean }) =>
    request<any>(`/reviews/${contentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateReview: (reviewId: number, data: { title?: string; body: string; score?: number; containsSpoilers?: boolean }) =>
    request<any>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteReview: (reviewId: number) =>
    request<{ message: string }>(`/reviews/${reviewId}`, {
      method: 'DELETE',
    }),

  toggleLikeReview: (reviewId: number) =>
    request<{ liked: boolean }>(`/reviews/${reviewId}/like`, {
      method: 'POST',
    }),

  addComment: (reviewId: number, body: string) =>
    request<any>(`/reviews/${reviewId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),

  getComments: (reviewId: number) => request<any[]>(`/reviews/${reviewId}/comments`),
};
