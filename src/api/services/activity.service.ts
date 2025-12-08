import { httpClient } from '../config/client';
import { ACTIVITY_ENDPOINTS } from '../config/constants';
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from '../types/activity.types';

/**
 * Activity Service
 */
export const activityService = {
  /**
   * Get all activities
   */
  async getAll(): Promise<Activity[]> {
    return httpClient.get<Activity[]>(ACTIVITY_ENDPOINTS.GET_ALL);
  },

  /**
   * Get activity by ID
   */
  async getById(id: number | string): Promise<Activity> {
    return httpClient.get<Activity>(ACTIVITY_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Create a new activity
   */
  async create(data: CreateActivityRequest): Promise<Activity> {
    return httpClient.post<Activity>(ACTIVITY_ENDPOINTS.CREATE, data);
  },

  /**
   * Update activity
   */
  async update(
    id: number | string,
    data: UpdateActivityRequest
  ): Promise<Activity> {
    return httpClient.put<Activity>(ACTIVITY_ENDPOINTS.UPDATE(id), data);
  },

  /**
   * Delete activity
   */
  async delete(id: number | string): Promise<void> {
    return httpClient.delete<void>(ACTIVITY_ENDPOINTS.DELETE(id));
  },

  /**
   * Get activities by club
   */
  async getByClub(clubId: number | string): Promise<Activity[]> {
    return httpClient.get<Activity[]>(ACTIVITY_ENDPOINTS.GET_BY_CLUB(clubId));
  },

  /**
   * Register for activity
   */
  async register(id: number | string): Promise<void> {
    return httpClient.post<void>(ACTIVITY_ENDPOINTS.REGISTER(id));
  },

  /**
   * Unregister from activity
   */
  async unregister(id: number | string): Promise<void> {
    return httpClient.post<void>(ACTIVITY_ENDPOINTS.UNREGISTER(id));
  },
};

