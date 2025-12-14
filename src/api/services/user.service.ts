import { httpClient } from '../config/client';
import { USER_ENDPOINTS } from '../config/constants';
import type { User } from '../types/user.types';
import type { UpdateProfileRequest } from '../types/auth.types';

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
};

