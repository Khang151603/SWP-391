import { useNavigate } from 'react-router-dom';
import { authService } from '../api';

/**
 * Component cho phép user chuyển đổi giữa các role
 * Hiển thị trong dropdown menu khi user có nhiều role
 */
function RoleSwitcher() {
  const navigate = useNavigate();
  
  const roles = authService.getRoles();
  const selectedRole = authService.getSelectedRole();

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

  return (
    <div className="px-2 py-1.5">
      <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        Chuyển đổi vai trò
      </p>
      <div className="space-y-1 mt-1">
        {roles.map((role) => {
          const roleInfo = getRoleDisplay(role);
          const isSelected = role === selectedRole;
          
          return (
            <button
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                isSelected
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">{roleInfo.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{roleInfo.title}</p>
              </div>
              {isSelected && (
                <svg
                  className="h-4 w-4 flex-shrink-0"
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
  );
}

export default RoleSwitcher;
