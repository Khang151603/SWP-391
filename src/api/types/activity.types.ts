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

