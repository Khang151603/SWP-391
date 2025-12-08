import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../api/utils/tokenManager';

function RoleSelectionPage() {
  const navigate = useNavigate();
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
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading role selection data:', error);
        setIsLoading(false);
        // Redirect về login nếu có lỗi
        navigate('/login', { replace: true });
      }
    };

    // Đảm bảo data được load sau khi component mount
    loadData();
  }, [navigate]);

  const handleRoleSelect = useCallback((role: string) => {
    tokenManager.setSelectedRole(role);

    // Chuyển hướng dựa trên role (chuẩn hóa để so sánh)
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '');
    if (normalizedRole === 'student') {
      navigate('/student');
    } else if (normalizedRole === 'clubleader') {
      navigate('/leader');
    } else {
      navigate('/');
    }
  }, [navigate]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Đang tải...</div>
      </div>
    );
  }

  // Không render gì nếu đang redirect hoặc không có data
  if (!roles.length || roles.length === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Đang chuyển hướng...</div>
      </div>
    );
  }

  const getRoleDisplay = (role: string): { title: string; description: string; icon: string } => {
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '');
    
    if (normalizedRole === 'student') {
      return {
        title: 'Sinh viên',
        description: 'Tham gia các câu lạc bộ, hoạt động và quản lý thông tin cá nhân',
        icon: '🎓'
      };
    } else if (normalizedRole === 'clubleader') {
      return {
        title: 'Trưởng CLB',
        description: 'Quản lý câu lạc bộ, thành viên, hoạt động và tài chính',
        icon: '👑'
      };
    } else {
      return {
        title: role,
        description: 'Chọn vai trò này để tiếp tục',
        icon: '👤'
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-white">
              Chọn vai trò của bạn
            </h1>
            <p className="text-lg text-slate-300">
              Xin chào, <span className="font-semibold text-white">{userInfo?.fullName}</span>
            </p>
            <p className="text-sm text-slate-400">{userInfo?.email}</p>
          </div>

          {/* Role Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => {
              const roleInfo = getRoleDisplay(role);
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur-sm transition-all hover:scale-105 hover:border-fuchsia-400/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-fuchsia-500/20"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="mb-4 text-5xl">{roleInfo.icon}</div>
                    <h2 className="mb-2 text-2xl font-bold text-white">
                      {roleInfo.title}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {roleInfo.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="absolute bottom-6 right-6 text-3xl text-white/50 transition-all group-hover:translate-x-1 group-hover:text-fuchsia-400">
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
              className="text-sm text-slate-400 transition hover:text-white"
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
