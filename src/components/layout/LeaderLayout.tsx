import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

type LeaderLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

const leaderMenu = [
  { label: 'Dashboard', path: '/leader', badge: 'Live' },
  { label: 'Thông tin CLB', path: '/leader/club-info' },
  { label: 'Thành viên & Đơn', path: '/leader/members' },
  { label: 'Hoạt động', path: '/leader/activities' },
  { label: 'Tài chính', path: '/leader/finance' },
  { label: 'Báo cáo & Xuất dữ liệu', path: '/leader/reports' },
];

function LeaderLayout({
  title = 'Không gian điều hành CLB',
  subtitle = 'Theo dõi hoạt động, thành viên và tài chính trong một màn hình',
  children,
}: LeaderLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAppContext();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col border-b border-white/5 bg-slate-950/90 px-6 py-8 backdrop-blur lg:border-b-0 lg:border-r">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-400 p-3 text-xl font-bold text-white">
              CL
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Leader Control</p>
              <p className="text-lg font-semibold text-white">ClubOS 2025</p>
            </div>
          </Link>

          <nav className="mt-10 space-y-2 text-sm">
            {leaderMenu.map((item) => {
              const isBasePath = item.path === '/leader';
              const isActive = isBasePath
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-600/80 to-orange-500/70 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && <span className="text-xs font-semibold text-amber-200">{item.badge}</span>}
                </Link>
              );
            })}
          </nav>
          
          {/* User Info & Logout */}
          <div className="mt-auto border-t border-white/5 pt-6">
            {user && (
              <div className="mb-4 rounded-xl bg-white/5 px-4 py-3">
                <p className="text-xs text-slate-400">Đăng nhập bởi</p>
                <p className="mt-1 text-sm font-semibold text-white">{user.fullName}</p>
                <p className="mt-0.5 text-xs text-slate-400">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:border-red-500/50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        <div className="relative isolate overflow-hidden border-t border-white/5 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/70">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.15),transparent_55%)]" />
          <div className="relative h-full w-full">
            <header className="flex flex-col gap-4 border-b border-white/5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-orange-200">Leader Workspace</p>
                <h1 className="mt-1 text-3xl font-semibold text-white">{title}</h1>
                <p className="text-sm text-slate-300">{subtitle}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên, hoạt động, báo cáo..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-300 focus:outline-none md:w-80"
                />

              </div>
            </header>

            <main className="px-4 py-6 md:px-6 lg:py-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderLayout;


