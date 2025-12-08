// User API Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  avatar?: string;
}

