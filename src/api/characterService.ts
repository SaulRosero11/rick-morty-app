import { apiClient } from './apiClient';
import { Character, PaginatedResponse } from '../types/api';

export const getCharacters = (page = 1, name?: string): Promise<PaginatedResponse<Character>> =>
  apiClient
    .get<PaginatedResponse<Character>>('/character', {
      params: { page, ...(name ? { name } : {}) },
    })
    .then((r) => r.data);

export const getCharacterById = (id: number): Promise<Character> =>
  apiClient.get<Character>(`/character/${id}`).then((r) => r.data);

export const getCharactersByIds = (ids: number[]): Promise<Character[]> => {
  if (ids.length === 0) return Promise.resolve([]);
  return apiClient
    .get<Character | Character[]>(`/character/${ids.join(',')}`)
    .then((r) => (Array.isArray(r.data) ? r.data : [r.data]));
};
