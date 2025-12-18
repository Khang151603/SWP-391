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
  major?: string;
  skills?: string;
  requestDate?: string; // ISO datetime string
}

export interface StudentMembershipRequestResponse {
  id: number;
  clubName: string;
  status: string;
  note: string;
  requestDate: string;
  paymentId: number | null;
  amount: number | null;
  orderCode?: number | null;
  major?: string | null;
  skills?: string | null;
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
  major?: string;
  skills?: string;
}

export interface LeaderApproveRejectRequest {
  note: string;
}

// Leader membership management types
export interface MemberInfo {
  accountId: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
}

export interface ClubMemberDto {
  member: MemberInfo;
  membershipId: number;
  clubId: number;
  joinDate: string | null;
}

export interface LeaderDecisionDto {
  note?: string | null;
}

// Student: My clubs (clubs student is currently a member of)
export interface StudentMyClub {
  membership: {
    clubId: number;
    clubName: string;
    joinDate: string | null;
    status: string;
  };
  club: {
    id: number;
    name: string;
    description: string | null;
    status: string;
    membershipFee: number | null;
    imageClubsUrl?: string | null;
    memberCount?: number;
    establishedDate?: string;
    location?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    activityFrequency?: string | null;
  };
}

