import { httpClient } from '../config/client';
import { ACTIVITY_ENDPOINTS } from '../config/constants';
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  StudentActivity,
  ActivityParticipant,
} from '../types/activity.types';

/**
 * Activity Service
 */
export const activityService = {
  /**
   * Create a new activity
   */
  async create(data: CreateActivityRequest): Promise<Activity> {
    return httpClient.post<Activity>(ACTIVITY_ENDPOINTS.CREATE, data);
  },

  /**
   * Get activities by club
   */
  async getByClub(clubId: number | string): Promise<Activity[]> {
    return httpClient.get<Activity[]>(ACTIVITY_ENDPOINTS.GET_BY_CLUB(clubId));
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

  /**
   * Leader: Update activity
   */
  async update(id: number | string, data: UpdateActivityRequest): Promise<void> {
    return httpClient.put<void>(ACTIVITY_ENDPOINTS.UPDATE(id), data);
  },

  /**
   * Leader: Delete activity
   */
  async delete(id: number | string): Promise<void> {
    return httpClient.delete<void>(ACTIVITY_ENDPOINTS.DELETE(id));
  },

  /**
   * Leader: Open registration for activity
   */
  async openRegistration(id: number | string): Promise<void> {
    return httpClient.put<void>(ACTIVITY_ENDPOINTS.OPEN_REGISTRATION(id));
  },

  /**
   * Leader: Close registration for activity
   */
  async closeRegistration(id: number | string): Promise<void> {
    return httpClient.put<void>(ACTIVITY_ENDPOINTS.CLOSE_REGISTRATION(id));
  },

  /**
   * Leader: Get activity participants
   */
  async getParticipants(id: number | string): Promise<ActivityParticipant[]> {
    return httpClient.get<ActivityParticipant[]>(ACTIVITY_ENDPOINTS.GET_PARTICIPANTS(id));
  },
};

