// Membership API Types
export interface Membership {
  id: number;
  userId: number;
  clubId: number;
  role: 'leader' | 'member';
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  requestedAt: string;
  approvedAt?: string;
  user?: {
    id: number;
    username: string;
    fullName: string;
    email: string;
  };
  club?: {
    id: number;
    name: string;
    description: string;
  };
}

export interface CreateMembershipRequest {
  clubId: number;
  message?: string;
}

// Student membership request types
export interface StudentMembershipRequest {
  clubId: number;
  reason: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface StudentMembershipRequestResponse {
  id: number;
  clubName: string;
  status: string;
  note: string;
  requestDate: string;
  paymentId: number | null;
  amount: number | null;
}

// Leader pending membership request types
export interface LeaderPendingMembershipRequest {
  id: number;
  accountId: number;
  clubId: number;
  status: string;
  note: string;
  requestDate: string;
  fullName: string;
  email: string;
  phone: string;
  reason: string;
}

export interface LeaderApproveRejectRequest {
  note: string;
}

// Leader membership management types
export interface ClubMemberDto {
  membershipId: number;
  accountId: number;
  clubId: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  joinDate: string | null;
  status: string;
}

export interface LeaderDecisionDto {
  note?: string | null;
}

