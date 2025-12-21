import { httpClient } from '../config/client';
import { AUTH_ENDPOINTS } from '../config/constants';
import { tokenManager } from '../utils/tokenManager';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types/auth.types';

/**
 * Helper function to save authentication data to localStorage
 */
function saveAuthData(response: AuthResponse): void {
  if (!response.token) return;

  tokenManager.setToken(response.token);
  if (response.roles) {
    tokenManager.setRoles(response.roles);
  }
  tokenManager.setUserInfo({
    accountId: response.accountId,
    username: response.username,
    email: response.email,
    fullName: response.fullName,
    imageAccountUrl: response.imageAccountUrl,
  });
}

/**
 * Authentication Service
 * 
 * Used by:
 * - Pages: RegisterPage.tsx, LoginPage.tsx, StudentProfilePage.tsx
 * - Components: ProtectedRoute.tsx, RoleSwitcher.tsx, ProfileDropdown.tsx
 * - Context: AppContext.tsx
 * - Internal: httpClient (refreshToken)
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER, 
      data, 
      {
        skipAuth: true,
      }
    );

    saveAuthData(response);
    return response;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      data,
      { skipAuth: true }
    );

    saveAuthData(response);
    return response;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REFRESH_TOKEN
    );

    saveAuthData(response);
    return response;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await httpClient.post<void>(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<AuthResponse> {
    const response = await httpClient.put<AuthResponse>(AUTH_ENDPOINTS.UPDATE_PROFILE, data);

    saveAuthData(response);
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * Logout user
   * - Clear token, roles and user info from localStorage
   */
  async logout(): Promise<void> {
    tokenManager.clear();
  },

  /**
   * Get current token
   */
  getToken(): string | null {
    return tokenManager.getToken();
  },

  /**
   * Get current user roles
   */
  getRoles(): string[] {
    return tokenManager.getRoles();
  },

  /**
   * Get current user info
   */
  getUserInfo() {
    return tokenManager.getUserInfo();
  },

  /**
   * Get selected role
   */
  getSelectedRole(): string | null {
    return tokenManager.getSelectedRole();
  },

  /**
   * Set selected role
   */
  setSelectedRole(role: string): void {
    tokenManager.setSelectedRole(role);
  },

  /**
   * Set user info (for updating user data in localStorage)
   */
  setUserInfo(userInfo: {
    accountId: number;
    username: string;
    email: string;
    fullName: string;
    imageAccountUrl?: string;
  }): void {
    tokenManager.setUserInfo(userInfo);
  },

  /**
   * Check if user has multiple roles
   */
  hasMultipleRoles(): boolean {
    return tokenManager.hasMultipleRoles();
  },
};

