// Token Management Utilities
const TOKEN_KEY = 'token';
const ROLES_KEY = 'roles';
const USER_INFO_KEY = 'userInfo';
const SELECTED_ROLE_KEY = 'selectedRole';

/**
 * Helper function to safely access localStorage
 */
function safeLocalStorage(): Storage | null {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

/**
 * Helper function to get item from localStorage
 */
function getItem(key: string): string | null {
  const storage = safeLocalStorage();
  return storage ? storage.getItem(key) : null;
}

/**
 * Helper function to set item in localStorage
 */
function setItem(key: string, value: string): void {
  const storage = safeLocalStorage();
  if (storage) {
    storage.setItem(key, value);
  }
}

/**
 * Helper function to remove item from localStorage
 */
function removeItem(key: string): void {
  const storage = safeLocalStorage();
  if (storage) {
    storage.removeItem(key);
  }
}

export const tokenManager = {
  getToken(): string | null {
    return getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    removeItem(TOKEN_KEY);
  },

  getRoles(): string[] {
    const roles = getItem(ROLES_KEY);
    return roles ? JSON.parse(roles) : [];
  },

  setRoles(roles: string[]): void {
    setItem(ROLES_KEY, JSON.stringify(roles));
  },

  removeRoles(): void {
    removeItem(ROLES_KEY);
  },

  getUserInfo(): {
    accountId: number;
    username: string;
    email: string;
    fullName: string;
    imageAccountUrl?: string;
  } | null {
    const userInfo = getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  setUserInfo(userInfo: {
    accountId: number;
    username: string;
    email: string;
    fullName: string;
    imageAccountUrl?: string;
  }): void {
    setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  },

  removeUserInfo(): void {
    removeItem(USER_INFO_KEY);
  },

  getSelectedRole(): string | null {
    return getItem(SELECTED_ROLE_KEY);
  },

  setSelectedRole(role: string): void {
    setItem(SELECTED_ROLE_KEY, role);
  },

  removeSelectedRole(): void {
    removeItem(SELECTED_ROLE_KEY);
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

