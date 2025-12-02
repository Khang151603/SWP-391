import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';

function LoginPage() {
  return (
    <AuthLayout title="Đăng nhập">
      <form className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email trường</label>
          <input
            id="email"
            type="email"
            placeholder="name@student.edu.vn"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="password" className="font-medium text-slate-300">Mật khẩu</label>
            <button type="button" className="text-fuchsia-200 hover:text-white">Quên mật khẩu?</button>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent text-fuchsia-500 focus:ring-fuchsia-400" />
          Giữ tôi luôn đăng nhập
        </label>
        <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:translate-y-0.5">
          Đăng nhập
        </button>
      </form>
      <div className="text-sm text-slate-400">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-medium text-white hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;


