import { httpClient } from '../config/client';
import { MEMBERSHIP_ENDPOINTS } from '../config/constants';
import type {
  Membership,
  CreateMembershipRequest,
} from '../types/membership.types';

/**
 * Membership Service
 */
export const membershipService = {
  /**
   * Get all memberships
   */
  async getAll(): Promise<Membership[]> {
    return httpClient.get<Membership[]>(MEMBERSHIP_ENDPOINTS.GET_ALL);
  },

  /**
   * Get membership by ID
   */
  async getById(id: number | string): Promise<Membership> {
    return httpClient.get<Membership>(MEMBERSHIP_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Create membership request
   */
  async create(data: CreateMembershipRequest): Promise<Membership> {
    return httpClient.post<Membership>(MEMBERSHIP_ENDPOINTS.CREATE, data);
  },

  /**
   * Update membership
   */
  async update(
    id: number | string,
    data: Partial<Membership>
  ): Promise<Membership> {
    return httpClient.put<Membership>(MEMBERSHIP_ENDPOINTS.UPDATE(id), data);
  },

  /**
   * Delete membership
   */
  async delete(id: number | string): Promise<void> {
    return httpClient.delete<void>(MEMBERSHIP_ENDPOINTS.DELETE(id));
  },

  /**
   * Approve membership
   */
  async approve(id: number | string): Promise<Membership> {
    return httpClient.post<Membership>(MEMBERSHIP_ENDPOINTS.APPROVE(id));
  },

  /**
   * Reject membership
   */
  async reject(id: number | string): Promise<Membership> {
    return httpClient.post<Membership>(MEMBERSHIP_ENDPOINTS.REJECT(id));
  },
};

