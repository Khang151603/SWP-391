import { httpClient } from '../config/client';
import { MEMBERSHIP_ENDPOINTS } from '../config/constants';
import type {
  Membership,
  CreateMembershipRequest,
  StudentMembershipRequest,
  StudentMembershipRequestResponse,
  LeaderPendingMembershipRequest,
  LeaderApproveRejectRequest,
  ClubMemberDto,
  LeaderDecisionDto,
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

  /**
   * Student: Create membership request
   */
  async createStudentRequest(data: StudentMembershipRequest): Promise<void> {
    return httpClient.post<void>(MEMBERSHIP_ENDPOINTS.STUDENT_REQUEST, data);
  },

  /**
   * Student: Get all membership requests
   */
  async getStudentRequests(): Promise<StudentMembershipRequestResponse[]> {
    return httpClient.get<StudentMembershipRequestResponse[]>(MEMBERSHIP_ENDPOINTS.STUDENT_REQUESTS);
  },

  /**
   * Leader: Get pending membership requests
   */
  async getLeaderPendingRequests(): Promise<LeaderPendingMembershipRequest[]> {
    return httpClient.get<LeaderPendingMembershipRequest[]>(MEMBERSHIP_ENDPOINTS.LEADER_PENDING);
  },

  /**
   * Leader: Approve membership request
   */
  async approveLeaderRequest(id: number | string, data: LeaderApproveRejectRequest): Promise<void> {
    return httpClient.post<void>(MEMBERSHIP_ENDPOINTS.LEADER_APPROVE(id), data);
  },

  /**
   * Leader: Reject membership request
   */
  async rejectLeaderRequest(id: number | string, data: LeaderApproveRejectRequest): Promise<void> {
    return httpClient.post<void>(MEMBERSHIP_ENDPOINTS.LEADER_REJECT(id), data);
  },

  /**
   * Leader: Get all club members
   */
  async getLeaderMembers(): Promise<ClubMemberDto[]> {
    return httpClient.get<ClubMemberDto[]>(MEMBERSHIP_ENDPOINTS.LEADER_MEMBERS);
  },

  /**
   * Leader: Get club members by club ID
   */
  async getLeaderClubMembers(clubId: number | string): Promise<ClubMemberDto[]> {
    return httpClient.get<ClubMemberDto[]>(MEMBERSHIP_ENDPOINTS.LEADER_CLUB_MEMBERS(clubId));
  },

  /**
   * Leader: Lock a member's membership
   */
  async lockMember(membershipId: number | string, note?: string | null): Promise<string> {
    const dto: LeaderDecisionDto = { note: note || null };
    return httpClient.put<string>(MEMBERSHIP_ENDPOINTS.LEADER_LOCK_MEMBER(membershipId), dto);
  },

  /**
   * Leader: Unlock a member's membership
   */
  async unlockMember(membershipId: number | string): Promise<string> {
    return httpClient.put<string>(MEMBERSHIP_ENDPOINTS.LEADER_UNLOCK_MEMBER(membershipId));
  },

  /**
   * Leader: Delete/Remove a member from club
   */
  async deleteMember(membershipId: number | string, note?: string | null): Promise<string> {
    const dto: LeaderDecisionDto = { note: note || null };
    // DELETE request with body (backend accepts body in DELETE)
    return httpClient.delete<string>(MEMBERSHIP_ENDPOINTS.LEADER_DELETE_MEMBER(membershipId), {
      body: JSON.stringify(dto),
    } as RequestInit);
  },
};

