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
  phone?: string;
  major?: string;
  skills?: string;
  imageAccountUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  imageAccountUrl?: string;
}

export interface UserInfo {
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  selectedRole?: string;
  phone?: string;
  major?: string;
  skills?: string;
  imageAccountUrl?: string;
}

export interface AccountInfo {
  fullName: string;
  email: string;
  phone?: string;
  major?: string;
  skills?: string;
}

