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

