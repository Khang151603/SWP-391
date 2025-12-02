import type { ReactNode } from 'react';

type AuthLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

function AuthLayout({
  title = 'SCMS',
  subtitle = 'Student Club Management System',
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      {/* Background highlight for better focus */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.18),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-slate-900/85 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold text-white">
            SC
          </div>
          <h1 className="text-2xl font-semibold text-white text-balance">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-400 text-balance">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;


