// Club API Types
export interface Club {
  id: number;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  leaderId: number;
  memberCount?: number;
}

export interface CreateClubRequest {
  name: string;
  description: string;
  logo?: string;
}

export interface UpdateClubRequest {
  name?: string;
  description?: string;
  logo?: string;
}

export interface ClubMember {
  id: number;
  userId: number;
  clubId: number;
  role: 'leader' | 'member';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  user?: {
    id: number;
    username: string;
    fullName: string;
    email: string;
  };
}

export interface CreateLeaderRequest {
  reason: string;
}

