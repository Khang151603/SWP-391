import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { authService } from '../api';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from './ui/DropdownMenu';

function ProfileDropdown() {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const roles = authService.getRoles();
  const selectedRole = authService.getSelectedRole();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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

    // Chuyển hướng dựa trên role
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '');
    if (normalizedRole === 'student') {
      navigate('/student');
    } else if (normalizedRole === 'clubleader') {
      navigate('/leader');
    } else {
      navigate('/');
    }
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors">
          {user.imageAccountUrl ? (
            <img
              src={user.imageAccountUrl}
              alt={user.fullName || 'User'}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {user.fullName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-medium text-slate-900 truncate">{user.fullName || user.username}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
          <svg
            className="h-4 w-4 text-slate-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="start" 
        sideOffset={8}
        className="w-64 p-0 mt-2"
      >
        {/* Role Switcher Section */}
        {roles.length > 1 && (
          <>
            <div className="px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">CHUYỂN ĐỔI VAI TRÒ</p>
              <div className="space-y-1">
                {roles.map((role) => {
                  const roleInfo = getRoleDisplay(role);
                  const isSelected = role === selectedRole;
                  
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{roleInfo.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{roleInfo.title}</p>
                      </div>
                      {isSelected && (
                        <svg
                          className="h-4 w-4 flex-shrink-0 text-white"
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
                    </button>
                  );
                })}
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Logout Button */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;

