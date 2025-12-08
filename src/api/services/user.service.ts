import { httpClient } from '../config/client';
import { USER_ENDPOINTS } from '../config/constants';
import type { User, UpdateProfileRequest } from '../types/user.types';
import type { Club } from '../types/club.types';
import type { Activity } from '../types/activity.types';

/**
 * User Service
 */
export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return httpClient.get<User>(USER_ENDPOINTS.GET_PROFILE);
  },

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return httpClient.put<User>(USER_ENDPOINTS.UPDATE_PROFILE, data);
  },

  /**
   * Get user by ID
   */
  async getById(id: number | string): Promise<User> {
    return httpClient.get<User>(USER_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Get user's clubs
   */
  async getMyClubs(): Promise<Club[]> {
    return httpClient.get<Club[]>(USER_ENDPOINTS.GET_MY_CLUBS);
  },

  /**
   * Get user's activities
   */
  async getMyActivities(): Promise<Activity[]> {
    return httpClient.get<Activity[]>(USER_ENDPOINTS.GET_MY_ACTIVITIES);
  },
};

