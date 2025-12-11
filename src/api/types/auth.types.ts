// Auth API Types
export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserInfo {
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  selectedRole?: string;
}

