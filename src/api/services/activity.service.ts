import { httpClient } from '../config/client';
import { ACTIVITY_ENDPOINTS } from '../config/constants';
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  StudentActivity,
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

  /**
   * Student: Get all activities
   */
  async getStudentViewAll(): Promise<StudentActivity[]> {
    return httpClient.get<StudentActivity[]>(ACTIVITY_ENDPOINTS.STUDENT_VIEW_ALL);
  },

  /**
   * Student: Get activities by club
   */
  async getStudentViewByClub(clubId: number | string): Promise<StudentActivity[]> {
    return httpClient.get<StudentActivity[]>(ACTIVITY_ENDPOINTS.STUDENT_VIEW_CLUB(clubId));
  },

  /**
   * Student: Register for activity
   */
  async registerStudent(id: number | string): Promise<void> {
    return httpClient.post<void>(ACTIVITY_ENDPOINTS.STUDENT_REGISTER(id));
  },

  /**
   * Student: Get activities for registration (activities student has registered)
   */
  async getStudentForRegistration(): Promise<StudentActivity[]> {
    return httpClient.get<StudentActivity[]>(ACTIVITY_ENDPOINTS.STUDENT_FOR_REGISTRATION);
  },
};

