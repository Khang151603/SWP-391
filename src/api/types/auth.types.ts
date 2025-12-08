// Auth API Types
export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  roles: string[];
  user?: {
    id: number;
    username: string;
    email: string;
    fullName: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

