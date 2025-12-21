import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../api';
import { normalizeRole } from './utils/roleUtils';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requireAuth?: boolean;
}

/**
 * Component bảo vệ routes
 * - Kiểm tra authentication
 * - Kiểm tra role nếu được yêu cầu
 */
function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const selectedRole = authService.getSelectedRole();
  const roles = authService.getRoles();
  const isRoleSelectionPage = location.pathname === '/select-role';

  // Nếu route yêu cầu authentication nhưng chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập nhưng chưa chọn role (và có nhiều role)
  // Trừ khi đang ở trang select-role (để tránh vòng lặp redirect)
  if (isAuthenticated && !selectedRole && roles.length > 1 && !isRoleSelectionPage) {
    return <Navigate to="/select-role" replace />;
  }

  // Nếu route yêu cầu role cụ thể
  if (requiredRole) {
    const normalizedRequiredRole = normalizeRole(requiredRole);
    
    // Kiểm tra xem user có role được yêu cầu không
    const hasRequiredRole = roles.some(role => 
      normalizeRole(role) === normalizedRequiredRole
    );
    
    if (!hasRequiredRole) {
      // User không có role này, redirect về trang phù hợp
      return <Navigate to="/" replace />;
    }

    // Nếu chưa chọn role hoặc selected role không khớp với required role
    if (!selectedRole) {
      // Nếu có nhiều role, redirect đến trang chọn role
      if (roles.length > 1) {
        return <Navigate to="/select-role" replace />;
      }
      // Nếu chỉ có 1 role, tự động chọn role đó
      const singleRole = roles[0];
      if (normalizeRole(singleRole) === normalizedRequiredRole) {
        // Tự động set role và tiếp tục
        authService.setSelectedRole(singleRole);
      } else {
        return <Navigate to="/select-role" replace />;
      }
    } else {
      // Kiểm tra xem selected role có khớp với required role không
      if (normalizeRole(selectedRole) !== normalizedRequiredRole) {
        // Selected role không khớp, redirect về trang role selection để chọn lại
        return <Navigate to="/select-role" replace />;
      }
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
