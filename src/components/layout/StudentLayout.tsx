import { type ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { membershipService } from '../../api/services/membership.service';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import RoleSwitcher from '../RoleSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { cn } from '../utils/cn';

type StudentLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  hideHeader?: boolean;
};

type MenuItem = {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: string | number;
};

// Icon components
const Icons = {
  Dashboard: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Clubs: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Explore: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Requests: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Activities: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  MyActivities: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Leader: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Search: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Menu: () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Logout: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  User: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Payment: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
};

function StudentLayout({
  title = 'Không gian sinh viên',
  subtitle = 'Khám phá, tham gia và quản lý hoạt động CLB',
  children,
  hideHeader = false,
}: StudentLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAppContext();
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const requests = await membershipService.getStudentRequests();
        const statusLower = (status: string) => status.toLowerCase();
        const pending = requests.filter(
          (req) => {
            const status = statusLower(req.status);
            return status === 'pending' || status === 'approved_pending_payment';
          }
        ).length;
        setPendingRequestsCount(pending);
      } catch {
        // Silent fail - just don't show badge if error
      }
    };

    fetchPendingCount();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems: MenuItem[] = [
    { label: 'CLB của tôi', path: '/student/clubs', icon: <Icons.Clubs /> },
    { label: 'Khám phá', path: '/student/explore', icon: <Icons.Explore /> },
    { 
      label: 'Yêu cầu', 
      path: '/student/membership-requests', 
      icon: <Icons.Requests />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { label: 'Hoạt động', path: '/student/activities', icon: <Icons.Activities /> },
    { label: 'Hoạt động của tôi', path: '/student/my-activities', icon: <Icons.MyActivities /> },
    { label: 'Trở thành Leader', path: '/student/become-leader', icon: <Icons.Leader /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Top Navigation */}
      {!hideHeader && (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex h-20 items-center gap-6 overflow-hidden">
            {/* Logo */}
            <Link to="/student/clubs" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-75 blur group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white shadow-lg">
                  SC
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Club Management </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div 
              className="hidden lg:flex lg:items-center lg:justify-center lg:gap-1 flex-1 min-w-0 overflow-x-auto nav-scroll" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'group relative flex items-center gap-2 rounded-lg px-3 xl:px-4 py-2 text-sm font-medium transition-all flex-shrink-0',
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <span className={cn(
                      'flex-shrink-0 flex items-center justify-center',
                      isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
                    )}>
                      {item.icon}
                    </span>
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className="ml-1.5 flex-shrink-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* User Menu */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-1.5 hover:bg-slate-100 transition-colors">
                      <div className="hidden xl:block text-right">
                        <p className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{user.fullName}</p>
                      </div>
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        {user.imageAccountUrl && (
                          <AvatarImage src={user.imageAccountUrl} alt={user.fullName} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <RoleSwitcher />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate('/student/profile')}
                      className="cursor-pointer"
                    >
                      <Icons.User />
                      <span>Thông tin cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/student/payment-history')}
                      className="cursor-pointer"
                    >
                      <Icons.Payment />
                      <span>Lịch sử giao dịch</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Icons.Logout />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {isMobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span className={cn(
                      'flex-shrink-0 flex items-center justify-center',
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    )}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="flex-shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      )}

      {/* Main Content */}
      <main className="overflow-x-hidden pt-20">
        {/* Page Header */}
        {location.pathname !== '/student/clubs' && (
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-[1536px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
              {subtitle && <p className="mt-2 text-lg text-slate-600">{subtitle}</p>}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-[1536px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;
