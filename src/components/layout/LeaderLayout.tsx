import { type ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../ProfileDropdown';
import { cn } from '../utils/cn';

type LeaderLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

const leaderMenu = [
  { label: 'Dashboard', path: '/leader' },
  { label: 'Thông tin CLB', path: '/leader/club-info' },
  { label: 'Thành viên', path: '/leader/members' },
  { label: 'Đơn', path: '/leader/requests' },
  { label: 'Hoạt động', path: '/leader/activities' },
  { label: 'Báo cáo', path: '/leader/reports' },
  { label: 'Lịch sử thanh toán', path: '/leader/payment-history' },
];

function LeaderLayout({
  title = 'Không gian điều hành CLB',
  subtitle = 'Theo dõi hoạt động, thành viên và tài chính trong một màn hình',
  children,
}: LeaderLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Mặc định mở trên desktop, đóng trên mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return true;
  });

  // Đóng sidebar khi chuyển sang mobile
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:bg-transparent lg:pointer-events-none"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-[280px] flex flex-col border-r border-slate-200 bg-white px-6 py-8 overflow-y-auto transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3 text-xl font-bold text-white">CL</div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Leader Control</p>
              <p className="text-lg font-semibold text-slate-900">ClubOS 2025</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            aria-label="Đóng sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-10 space-y-2 text-sm">
          {leaderMenu.map((item) => {
            const isBasePath = item.path === '/leader';
            const isActive =
              isBasePath
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-between rounded-xl px-4 py-3 transition',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="mt-6 border-t border-slate-200 pt-6">
          <ProfileDropdown />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        'min-h-screen transition-all duration-300',
        isSidebarOpen ? 'lg:ml-[280px]' : 'ml-0'
      )}>
        <div className="relative h-full w-full">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-6 bg-white">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
              <div>
                <h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-600">{subtitle}</p>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 md:px-6 lg:py-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LeaderLayout;


