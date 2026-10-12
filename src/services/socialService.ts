import { request } from './api';
import { PostItem, PostCommentItem, UserProfileData } from '../types';

export const socialService = {
  getFeed: (page: number = 0, size: number = 20) =>
    request<PostItem[]>(`/feed?page=${page}&size=${size}`),

  getUserPosts: (username: string) =>
    request<PostItem[]>(`/users/${encodeURIComponent(username)}/posts`),

  createPost: (data: { contentId?: number; body: string }) =>
    request<PostItem>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deletePost: (postId: number) =>
    request<{ message: string }>(`/posts/${postId}`, {
      method: 'DELETE',
    }),

  toggleLikePost: (postId: number) =>
    request<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
    }),

  addComment: (postId: number, body: string) =>
    request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),

  getPostComments: (postId: number) =>
    request<PostCommentItem[]>(`/posts/${postId}/comments`),

  toggleFollow: (username: string) =>
    request<{ following: boolean }>(`/users/${encodeURIComponent(username)}/follow`, {
      method: 'POST',
    }),

  getFollowers: (username: string) =>
    request<any[]>(`/users/${encodeURIComponent(username)}/followers`),

  getFollowing: (username: string) =>
    request<any[]>(`/users/${encodeURIComponent(username)}/following`),

  getUserProfile: (username: string) =>
    request<UserProfileData>(`/users/${encodeURIComponent(username)}/profile`),

  updateProfile: (data: Record<string, string>) =>
    request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  searchUsers: (query: string) =>
    request<any[]>(`/users/search?query=${encodeURIComponent(query)}`),
};
