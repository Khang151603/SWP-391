import type { ReactNode } from 'react';

type AuthLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

function AuthLayout({ title = 'SCMS', children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <div>
          <h2 className="mt-3 text-3xl font-semibold text-white text-balance text-center">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;


