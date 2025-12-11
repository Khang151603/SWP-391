// Activity API Types
export interface Activity {
  id: number;
  clubId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled' | string;
  createdBy?: number;
}

export interface CreateActivityRequest {
  clubId: number;
  title: string;
  description: string;
  startTime: string; // ISO
  endTime: string; // ISO
  location: string;
}

export interface UpdateActivityRequest {
  clubId?: number;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  status?: Activity['status'];
}

// Student activity view types
export interface StudentActivity {
  id: number;
  clubId: number;
  clubName?: string; // Optional, will be fetched from clubId if not provided
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  category?: string;
  registeredCount?: number;
  maxParticipants?: number;
  isRegistered?: boolean;
}

