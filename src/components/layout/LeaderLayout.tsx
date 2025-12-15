import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../ProfileDropdown';
import { NotificationBell } from '../NotificationBell';

type LeaderLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

const leaderMenu = [
  { label: 'Dashboard', path: '/leader',},
  { label: 'Thông tin CLB', path: '/leader/club-info' },
  { label: 'Thành viên', path: '/leader/members' },
  { label: 'Đơn', path: '/leader/requests' },
  { label: 'Hoạt động', path: '/leader/activities' },
];

function LeaderLayout({
  title = 'Không gian điều hành CLB',
  subtitle = 'Theo dõi hoạt động, thành viên và tài chính trong một màn hình',
  children,
}: LeaderLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-20 h-screen w-[280px] flex flex-col border-r border-slate-200 bg-white px-6 py-8 overflow-y-auto">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3 text-xl font-bold text-white">CL</div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Leader Control</p>
            <p className="text-lg font-semibold text-slate-900">ClubOS 2025</p>
          </div>
        </Link>

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
                className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
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
      <div className="lg:ml-[280px] min-h-screen">
        <div className="relative h-full w-full">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-6 bg-white">
            <div>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-600">{subtitle}</p>
            </div>
            <NotificationBell />
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


