import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api';

/**
 * Component cho phép user chuyển đổi giữa các role
 * Hiển thị trong header/navbar khi user có nhiều role
 */
function RoleSwitcher() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const roles = authService.getRoles();
  const selectedRole = authService.getSelectedRole();
  const userInfo = authService.getUserInfo();

  // Không hiển thị nếu chỉ có 1 role
  if (roles.length <= 1) {
    return null;
  }

  const getRoleDisplay = (role: string): { title: string; icon: string } => {
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '');
    
    if (normalizedRole === 'student') {
      return { title: 'Sinh viên', icon: '🎓' };
    } else if (normalizedRole === 'clubleader') {
      return { title: 'Trưởng CLB', icon: '👑' };
    } else {
      return { title: role, icon: '👤' };
    }
  };

  const handleRoleSwitch = (role: string) => {
    authService.setSelectedRole(role);
    setIsOpen(false);

    // Chuyển hướng dựa trên role (chuẩn hóa để so sánh)
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '');
    if (normalizedRole === 'student') {
      navigate('/student');
    } else if (normalizedRole === 'clubleader') {
      navigate('/leader');
    } else {
      navigate('/');
    }
  };

  const currentRoleDisplay = selectedRole ? getRoleDisplay(selectedRole) : null;

  return (
    <div className="relative">
      {/* Current Role Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
      >
        <span className="text-lg">{currentRoleDisplay?.icon}</span>
        <span className="font-medium">{currentRoleDisplay?.title}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-sm shadow-2xl">
            {/* User Info */}
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-medium text-white">{userInfo?.fullName}</p>
              <p className="text-xs text-slate-400">{userInfo?.email}</p>
            </div>

            {/* Role List */}
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Chuyển đổi vai trò
              </p>
              {roles.map((role) => {
                const roleInfo = getRoleDisplay(role);
                const isSelected = role === selectedRole;
                
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`w-full rounded-xl px-3 py-2 text-left transition ${
                      isSelected
                        ? 'bg-fuchsia-500/20 text-fuchsia-300'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{roleInfo.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{roleInfo.title}</p>
                      </div>
                      {isSelected && (
                        <svg
                          className="h-5 w-5 text-fuchsia-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RoleSwitcher;
