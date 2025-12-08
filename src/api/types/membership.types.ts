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

