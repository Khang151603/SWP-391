import { httpClient } from '../config/client';
import { CLUB_ENDPOINTS } from '../config/constants';
import type {
  Club,
  ClubListItem,
  LeaderClubListItem,
  CreateClubRequest,
  UpdateClubRequest,
  ClubMember,
  CreateLeaderRequest,
  CreateLeaderClubRequest,
  LeaderRequest,
} from '../types/club.types';

/**
 * Club Service
 */
export const clubService = {
  /**
   * Get all clubs
   */
  async getAll(): Promise<Club[]> {
    return httpClient.get<Club[]>(CLUB_ENDPOINTS.GET_ALL);
  },

  /**
   * Get all clubs list (for student explore page)
   */
  async getAllClubs(): Promise<ClubListItem[]> {
    return httpClient.get<ClubListItem[]>(CLUB_ENDPOINTS.GET_ALL_CLUBS);
  },

  /**
   * Get clubs of current leader
   */
  async getMyClubs(): Promise<ClubListItem[]> {
    return httpClient.get<ClubListItem[]>(CLUB_ENDPOINTS.GET_MY_CLUBS);
  },

  /**
   * Get club by ID
   */
  async getById(id: number | string): Promise<Club> {
    return httpClient.get<Club>(CLUB_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Create a new club
   */
  async create(data: CreateClubRequest): Promise<Club> {
    return httpClient.post<Club>(CLUB_ENDPOINTS.CREATE, data);
  },

  /**
   * Update club
   */
  async update(id: number | string, data: UpdateClubRequest): Promise<Club> {
    return httpClient.put<Club>(CLUB_ENDPOINTS.UPDATE(id), data);
  },

  /**
   * Delete club
   */
  async delete(id: number | string): Promise<void> {
    return httpClient.delete<void>(CLUB_ENDPOINTS.DELETE(id));
  },

  /**
   * Get club members
   */
  async getMembers(id: number | string): Promise<ClubMember[]> {
    return httpClient.get<ClubMember[]>(CLUB_ENDPOINTS.GET_MEMBERS(id));
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
};

