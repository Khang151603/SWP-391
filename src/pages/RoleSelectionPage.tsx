import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../api/utils/tokenManager';
import { useAppContext } from '../context/AppContext';
import { normalizeRole, getRoleDisplay, getRolePath } from '../components/utils/roleUtils';

function RoleSelectionPage() {
  const navigate = useNavigate();
  const { user, setUser, setSelectedRole: setContextRole } = useAppContext();
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<{
    accountId: number;
    username: string;
    email: string;
    fullName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data từ localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedRoles = tokenManager.getRoles();
        const loadedUserInfo = tokenManager.getUserInfo();
        
        setRoles(loadedRoles || []);
        setUserInfo(loadedUserInfo);
        
        // Update AppContext with user data if not already set
        if (!user && loadedUserInfo && loadedRoles) {
          setUser({
            accountId: loadedUserInfo.accountId,
            username: loadedUserInfo.username,
            email: loadedUserInfo.email,
            fullName: loadedUserInfo.fullName,
            imageAccountUrl: loadedUserInfo.imageAccountUrl,
            roles: loadedRoles,
          });
        }
        
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        // Redirect về login nếu có lỗi
        navigate('/login', { replace: true });
      }
    };

    // Đảm bảo data được load sau khi component mount
    loadData();
  }, [navigate, user, setUser]);

  const handleRoleSelect = useCallback((role: string) => {
    tokenManager.setSelectedRole(role);
    
    // Update selected role in AppContext
    setContextRole(role);
    
    // Update user object with selected role
    if (user) {
      setUser({
        ...user,
        selectedRole: role,
      });
    }

    // Chuyển hướng dựa trên role
    navigate(getRolePath(role));
  }, [navigate, setContextRole, user, setUser]);

  useEffect(() => {
    if (isLoading) return;

    // Redirect nếu không có roles
    if (!roles.length) {
      navigate('/login', { replace: true });
      return;
    }

    // Nếu chỉ có 1 role, tự động chọn và chuyển hướng
    if (roles.length === 1) {
      handleRoleSelect(roles[0]);
    }
  }, [roles, navigate, handleRoleSelect, isLoading]);

  // Hiển thị loading hoặc redirect message
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-700 text-lg">Đang tải...</div>
      </div>
    );
  }

  // Không render gì nếu đang redirect hoặc không có data
  if (!roles.length || roles.length === 1) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-700 text-lg">Đang chuyển hướng...</div>
      </div>
    );
  }

  const getRoleDisplayWithDescription = (role: string): { title: string; description: string; icon: string } => {
    const roleInfo = getRoleDisplay(role);
    const normalizedRole = normalizeRole(role);
    
    let description = 'Chọn vai trò này để tiếp tục';
    if (normalizedRole === 'student') {
      description = 'Tham gia các câu lạc bộ, hoạt động và quản lý thông tin cá nhân';
    } else if (normalizedRole === 'clubleader') {
      description = 'Quản lý câu lạc bộ, thành viên, hoạt động và tài chính';
    }
    
    return {
      title: roleInfo.title,
      description,
      icon: roleInfo.icon,
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-slate-900">
              Chọn vai trò của bạn
            </h1>
            <p className="text-lg text-slate-600">
              Xin chào, <span className="font-semibold text-slate-900">{userInfo?.fullName}</span>
            </p>
            <p className="text-sm text-slate-500">{userInfo?.email}</p>
          </div>

          {/* Role Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => {
              const roleInfo = getRoleDisplayWithDescription(role);
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition-all hover:scale-105 hover:border-blue-300 hover:shadow-md"
                >
                  {/* Content */}
                  <div className="relative">
                    <div className="mb-4 text-5xl">{roleInfo.icon}</div>
                    <h2 className="mb-2 text-2xl font-bold text-slate-900">
                      {roleInfo.title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {roleInfo.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="absolute bottom-6 right-6 text-3xl text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </div>
                </button>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                tokenManager.clear();
                navigate('/login');
              }}
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
