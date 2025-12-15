import { httpClient } from '../config/client';
import { MEMBERSHIP_ENDPOINTS } from '../config/constants';
import type {
  StudentMembershipRequest,
  StudentMembershipRequestResponse,
  LeaderPendingMembershipRequest,
  LeaderApproveRejectRequest,
  ClubMemberDto,
  LeaderDecisionDto,
  StudentMyClub,
} from '../types/membership.types';
import type { AccountInfo } from '../types/auth.types';

/**
 * Membership Service
 */
export const membershipService = {

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
   * Student: Get my clubs (clubs student is currently a member of)
   */
  async getStudentMyClubs(): Promise<StudentMyClub[]> {
    return httpClient.get<StudentMyClub[]>(MEMBERSHIP_ENDPOINTS.STUDENT_MY_CLUBS);
  },

  /**
   * Student: Get account info for form pre-fill (includes major, skills)
   */
  async getAccountInfo(): Promise<AccountInfo> {
    return httpClient.get<AccountInfo>(MEMBERSHIP_ENDPOINTS.STUDENT_ACCOUNT_INFO);
  },

  /**
   * Leader: Get pending membership requests
   */
  async getLeaderPendingRequests(): Promise<LeaderPendingMembershipRequest[]> {
    return httpClient.get<LeaderPendingMembershipRequest[]>(MEMBERSHIP_ENDPOINTS.LEADER_PENDING);
  },

  /**
   * Leader: Get all membership requests (pending, approved, rejected)
   */
  async getLeaderAllRequests(): Promise<LeaderPendingMembershipRequest[]> {
    return httpClient.get<LeaderPendingMembershipRequest[]>('/api/leader/membership/requests');
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

