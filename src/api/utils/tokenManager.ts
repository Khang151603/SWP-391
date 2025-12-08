// Token Management Utilities
const TOKEN_KEY = 'token';
const ROLES_KEY = 'roles';

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

  clear(): void {
    this.removeToken();
    this.removeRoles();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

