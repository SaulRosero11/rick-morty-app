import { apiClient } from './apiClient';
import { Location, PaginatedResponse } from '../types/api';
export { getCharactersByIds } from './characterService';

export const getLocations = (page = 1, name?: string): Promise<PaginatedResponse<Location>> =>
  apiClient
    .get<PaginatedResponse<Location>>('/location', {
      params: { page, ...(name ? { name } : {}) },
    })
    .then((r) => r.data);

export const getLocationById = (id: number): Promise<Location> =>
  apiClient.get<Location>(`/location/${id}`).then((r) => r.data);
