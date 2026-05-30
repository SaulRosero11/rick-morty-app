import { apiClient } from './apiClient';
import { Episode, PaginatedResponse } from '../types/api';
export { getCharactersByIds } from './characterService';

export const getEpisodes = (page = 1, name?: string): Promise<PaginatedResponse<Episode>> =>
  apiClient
    .get<PaginatedResponse<Episode>>('/episode', {
      params: { page, ...(name ? { name } : {}) },
    })
    .then((r) => r.data);

export const getEpisodeById = (id: number): Promise<Episode> =>
  apiClient.get<Episode>(`/episode/${id}`).then((r) => r.data);
