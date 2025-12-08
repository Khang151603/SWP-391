// Activity API Types
export interface Activity {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  clubId: number;
  maxParticipants?: number;
  currentParticipants?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  clubId: number;
  maxParticipants?: number;
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  maxParticipants?: number;
  status?: Activity['status'];
}

