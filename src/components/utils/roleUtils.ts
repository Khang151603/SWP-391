/**
 * Utility functions for role management
 */

/**
 * Normalize role string by converting to lowercase and removing spaces
 */
export function normalizeRole(role: string): string {
  return role.toLowerCase().replace(/\s+/g, '');
}

/**
 * Get display information for a role
 */
export function getRoleDisplay(role: string): { title: string; icon: string } {
  const normalizedRole = normalizeRole(role);
  
  if (normalizedRole === 'student') {
    return { title: 'Sinh viên', icon: '🎓' };
  } else if (normalizedRole === 'clubleader') {
    return { title: 'Trưởng CLB', icon: '👑' };
  } else {
    return { title: role, icon: '👤' };
  }
}

/**
 * Get navigation path for a role
 */
export function getRolePath(role: string): string {
  const normalizedRole = normalizeRole(role);
  
  if (normalizedRole === 'student') {
    return '/student';
  } else if (normalizedRole === 'clubleader') {
    return '/leader';
  } else {
    return '/';
  }
}

