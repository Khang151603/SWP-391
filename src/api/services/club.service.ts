import { httpClient } from '../config/client';
import { CLUB_ENDPOINTS } from '../config/constants';
import type {
  ClubListItem,
  LeaderClubListItem,
  CreateLeaderRequest,
  CreateLeaderClubRequest,
  UpdateLeaderClubRequest,
  LeaderRequest,
} from '../types/club.types';

/**
 * Club Service
 */
export const clubService = {
  /**
   * Get all clubs list (for student explore page)
   */
  async getAllClubs(): Promise<ClubListItem[]> {
    return httpClient.get<ClubListItem[]>(CLUB_ENDPOINTS.GET_ALL_CLUBS);
  },

  /**
   * Get club details by ID (using /api/clubs/{id} endpoint)
   */
  async getClubDetailsById(id: number | string): Promise<ClubListItem> {
    return httpClient.get<ClubListItem>(CLUB_ENDPOINTS.LEADER_CLUB_BY_ID(id));
  },

  /**
   * Request to join club
   */
  async joinRequest(id: number | string, message?: string): Promise<void> {
    return httpClient.post<void>(CLUB_ENDPOINTS.JOIN_REQUEST(id), { message });
  },

  /**
   * Request to become club leader
   */
  async createLeaderRequest(data: CreateLeaderRequest): Promise<string> {
    return httpClient.post<string>(CLUB_ENDPOINTS.LEADER_REQUEST, data);
  },

  /**
   * Get my leader requests
   */
  async getMyLeaderRequests(): Promise<LeaderRequest[]> {
    const result = await httpClient.get<LeaderRequest | LeaderRequest[]>(CLUB_ENDPOINTS.MY_LEADER_REQUEST);
    // Handle both single object and array responses
    return Array.isArray(result) ? result : [result];
  },

  /**
   * Create a new club as leader
   */
  async createLeaderClub(data: CreateLeaderClubRequest): Promise<LeaderClubListItem> {
    return httpClient.post<LeaderClubListItem>(CLUB_ENDPOINTS.LEADER_CREATE, data);
  },

  /**
   * Get clubs owned by current leader
   */
  async getMyLeaderClubs(): Promise<LeaderClubListItem[]> {
    return httpClient.get<LeaderClubListItem[]>(CLUB_ENDPOINTS.LEADER_MY_CLUBS);
  },

  /**
   * Update a leader club
   */
  async updateLeaderClub(id: number | string, data: UpdateLeaderClubRequest): Promise<LeaderClubListItem> {
    return httpClient.put<LeaderClubListItem>(CLUB_ENDPOINTS.LEADER_CLUB_BY_ID(id), data);
  },

  /**
   * Delete a leader club
   */
  async deleteLeaderClub(id: number | string): Promise<void> {
    return httpClient.delete<void>(CLUB_ENDPOINTS.LEADER_CLUB_BY_ID(id));
  },

  /**
   * Upload club image
   */
  async uploadClubImage(id: number | string, file: File): Promise<{ message: string; imageUrl: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use httpClient's baseURL and auth headers but skip Content-Type for FormData
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7124';
    const response = await fetch(`${API_BASE_URL}${CLUB_ENDPOINTS.UPLOAD_CLUB_IMAGE(id)}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Upload failed');
    }

    return response.json();
  },
};

