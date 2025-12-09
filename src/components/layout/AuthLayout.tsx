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
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
            SC
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 text-balance">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-600 text-balance">
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


