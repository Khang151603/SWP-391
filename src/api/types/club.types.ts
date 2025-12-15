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

// Club response from /api/Clubs endpoint
export interface ClubListItem {
  id: number;
  name: string;
  description: string;
  establishedDate?: string;
  imageClubsUrl?: string | null;
  imageUrl?: string | null; // API sometimes returns imageUrl instead of imageClubsUrl
  memberCount?: number;
  membershipFee: number;
  status: 'Active' | 'Unactive' | string;
}

export interface LeaderClubListItem {
  id: number;
  name: string;
  description: string;
  establishedDate: string;
  imageClubsUrl: string | null;
  membershipFee: number;
  status: 'Active' | 'Unactive' | string;
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

export interface CreateLeaderClubRequest {
  name: string;
  description: string;
  establishedDate: string; // ISO date string
  imageClubsUrl: string;
  membershipFee?: number;
}

export interface UpdateLeaderClubRequest {
  name: string;
  description: string;
  establishedDate: string;
  imageClubsUrl: string;
  membershipFee: number;
  status: 'Active' | 'Unactive';
}

export interface LeaderRequest {
  id: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  note?: string;
  processedBy?: number;
  processedAt?: string;
}

