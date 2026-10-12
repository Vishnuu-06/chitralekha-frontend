import { request } from './api';
import { ContentItem, ReviewItem } from '../types';

export const contentService = {
  search: (query: string, category: string = 'ALL') =>
    request<ContentItem[]>(`/content/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`),

  discover: (type: string, page: number = 0, size: number = 24, genre?: string, sortBy: string = 'recent') => {
    let url = `/content/discover?type=${encodeURIComponent(type)}&page=${page}&size=${size}&sortBy=${encodeURIComponent(sortBy)}`;
    if (genre && genre.trim()) {
      url += `&genre=${encodeURIComponent(genre.trim())}`;
    }
    return request<ContentItem[]>(url);
  },

  getDetails: (id: number) => request<ContentItem>(`/content/${id}`),

  getReviews: (id: number) => request<ReviewItem[]>(`/content/${id}/reviews`),
};
