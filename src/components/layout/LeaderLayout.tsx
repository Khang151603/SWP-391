import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

type LeaderLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

const leaderMenu = [
  { label: 'Dashboard', path: '/leader',},
  { label: 'Thông tin CLB', path: '/leader/club-info' },
  { label: 'Thành viên & Đơn', path: '/leader/members' },
  { label: 'Hoạt động', path: '/leader/activities' },
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col border-b border-slate-200 bg-white px-6 py-8 lg:border-b-0 lg:border-r">
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
          
          {/* User Info & Logout */}
          <div className="mt-auto border-t border-slate-200 pt-6">
            {user && (
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Đăng nhập bởi</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.fullName}</p>
                <p className="mt-0.5 text-xs text-slate-500">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        <div className="relative overflow-hidden border-t border-slate-200 bg-slate-50">
          <div className="relative h-full w-full">
            <header className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 lg:flex-row lg:items-center lg:justify-between bg-white">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Leader Workspace</p>
                <h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-600">{subtitle}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên, hoạt động, báo cáo..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none md:w-80"
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


