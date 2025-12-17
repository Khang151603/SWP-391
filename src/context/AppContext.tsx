/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../api';
import type { UserInfo } from '../api/types/auth.types';

type AppContextValue = {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Auth
  user: UserInfo | null;
  isAuthenticated: boolean;
  selectedRole: string | null;
  setUser: (user: UserInfo | null) => void;
  updateUser: (updates: Partial<UserInfo>) => void;
  setSelectedRole: (role: string) => void;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    authService.isAuthenticated()
  );
  const [user, setUser] = useState<UserInfo | null>(() => {
    if (!authService.isAuthenticated()) return null;

    const userInfo = authService.getUserInfo();
    const roles = authService.getRoles();
    const currentRole = authService.getSelectedRole();

    if (!userInfo) return null;

    return {
      ...userInfo,
      roles,
      selectedRole: currentRole || undefined,
    };
  });
  const [selectedRole, setSelectedRoleState] = useState<string | null>(() => {
    if (!authService.isAuthenticated()) return null;
    return authService.getSelectedRole();
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateUser = (updates: Partial<UserInfo>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Cập nhật localStorage để persist data
      // Chỉ lưu các field cần thiết, không lưu roles và selectedRole vì đã có riêng
      authService.setUserInfo({
        accountId: updatedUser.accountId,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        imageAccountUrl: updatedUser.imageAccountUrl,
      });
    }
  };

  const setSelectedRole = (role: string) => {
    authService.setSelectedRole(role);
    setSelectedRoleState(role);
    if (user) {
      setUser({ ...user, selectedRole: role });
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setSelectedRoleState(null);
  };

  return (
    <AppContext.Provider 
      value={{ 
        theme, 
        toggleTheme,
        user,
        isAuthenticated,
        selectedRole,
        setUser,
        updateUser,
        setSelectedRole,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
}


