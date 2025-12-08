import { httpClient } from '../config/client';
import { CLUB_ENDPOINTS } from '../config/constants';
import type {
  Club,
  CreateClubRequest,
  UpdateClubRequest,
  ClubMember,
  CreateLeaderRequest,
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
};

