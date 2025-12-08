// Report API Types
export interface Report {
  id: number;
  clubId: number;
  title: string;
  content: string;
  type: 'activity' | 'finance' | 'general';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  clubId: number;
  title: string;
  content: string;
  type: 'activity' | 'finance' | 'general';
}

export interface UpdateReportRequest {
  title?: string;
  content?: string;
  status?: Report['status'];
}

