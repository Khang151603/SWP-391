import { httpClient } from '../config/client';
import { AUTH_ENDPOINTS } from '../config/constants';
import { tokenManager } from '../utils/tokenManager';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ChangePasswordRequest,
} from '../types/auth.types';

/**
 * Authentication Service
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

    // Save token, roles, and user info
    if (response.token) {
      tokenManager.setToken(response.token);
      if (response.roles) {
        tokenManager.setRoles(response.roles);
      }
      tokenManager.setUserInfo({
        accountId: response.accountId,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
      });
    }

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

    // Save token, roles, and user info
    if (response.token) {
      tokenManager.setToken(response.token);
      if (response.roles) {
        tokenManager.setRoles(response.roles);
      }
      tokenManager.setUserInfo({
        accountId: response.accountId,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
      });
    }

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post<void>(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Even if API call fails, clear local storage
      console.error('Logout API error:', error);
    } finally {
      tokenManager.clear();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REFRESH_TOKEN
    );

    if (response.token) {
      tokenManager.setToken(response.token);
      if (response.roles) {
        tokenManager.setRoles(response.roles);
      }
      tokenManager.setUserInfo({
        accountId: response.accountId,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
      });
    }

    return response;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await httpClient.post<void>(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
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
   * Check if user has multiple roles
   */
  hasMultipleRoles(): boolean {
    return tokenManager.hasMultipleRoles();
  },
};

