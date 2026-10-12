import { request } from './api';
import { TasteRecommendation } from '../types';

export const discoveryService = {
  getTasteRecommendations: () => request<TasteRecommendation[]>('/discovery/people'),
};
