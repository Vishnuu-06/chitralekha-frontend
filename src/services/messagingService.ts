import { request } from './api';
import { ConversationSummary, MessageItem } from '../types';

export const messagingService = {
  getConversations: () => request<ConversationSummary[]>('/conversations'),

  getOrCreateConversation: (username: string) =>
    request<{ id: number }>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  getMessages: (conversationId: number) =>
    request<MessageItem[]>(`/conversations/${conversationId}`),

  sendMessage: (conversationId: number, body: string, sharedContentId?: number) =>
    request<MessageItem>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body, sharedContentId }),
    }),
};
