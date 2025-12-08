import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

type StudentLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

type MenuItem = {
  label: string;
  path: string;
  badge?: string | number;
};

const menuItems: MenuItem[] = [
  { label: 'Tổng quan', path: '/student'},
  { label: 'CLB của tôi', path: '/student/clubs' },
  { label: 'Khám phá CLB', path: '/student/explore' },
  { label: 'Hoạt động', path: '/student/activities' },
  { label: 'Hoạt động của tôi', path: '/student/my-activities' },
  { label: 'Tài chính', path: '/student/fees' },
  { label: 'Yêu cầu trở thành Club Leader', path: '/student/become-leader' },
];

function StudentLayout({
  title = 'Không gian sinh viên',
  subtitle = 'Khám phá, tham gia và quản lý hoạt động CLB',
  children,
}: StudentLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950/95 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-900/40 bg-slate-950/80 px-6 py-6 backdrop-blur lg:border-b-0 lg:border-r">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-3 text-xl font-bold text-white">
              SC
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Student Portal</p>
              <p className="text-lg font-semibold text-white">ClubOS 2025</p>
            </div>
          </Link>
          <nav className="mt-8 space-y-2 text-sm">
            {menuItems.map((item) => {
              const isBasePath = item.path === '/student';
              const isActive = isBasePath
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/70 text-white shadow-lg shadow-violet-600/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-semibold text-fuchsia-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="relative isolate overflow-hidden border-t border-slate-900/40 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/60">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.15),transparent_55%)]" />
          <div className="relative h-full w-full">
            <header className="flex flex-col gap-4 border-b border-white/5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-200">Workspace</p>
                <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">{title}</h1>
                <p className="text-sm text-slate-300">{subtitle}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm hoạt động, CLB"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none md:w-72"
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

export default StudentLayout;
