// Token Management Utilities
const TOKEN_KEY = 'token';
const ROLES_KEY = 'roles';
const USER_INFO_KEY = 'userInfo';
const SELECTED_ROLE_KEY = 'selectedRole';

export const tokenManager = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getRoles(): string[] {
    if (typeof window === 'undefined') return [];
    const roles = localStorage.getItem(ROLES_KEY);
    return roles ? JSON.parse(roles) : [];
  },

  setRoles(roles: string[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  },

  removeRoles(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ROLES_KEY);
  },

  getUserInfo(): {
    accountId: number;
    username: string;
    email: string;
    fullName: string;
    imageAccountUrl?: string;
  } | null {
    if (typeof window === 'undefined') return null;
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  setUserInfo(userInfo: {
    accountId: number;
    username: string;
    email: string;
    fullName: string;
    imageAccountUrl?: string;
  }): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  },

  removeUserInfo(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_INFO_KEY);
  },

  getSelectedRole(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SELECTED_ROLE_KEY);
  },

  setSelectedRole(role: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SELECTED_ROLE_KEY, role);
  },

  removeSelectedRole(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SELECTED_ROLE_KEY);
  },

  clear(): void {
    this.removeToken();
    this.removeRoles();
    this.removeUserInfo();
    this.removeSelectedRole();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  hasMultipleRoles(): boolean {
    return this.getRoles().length > 1;
  },
};

