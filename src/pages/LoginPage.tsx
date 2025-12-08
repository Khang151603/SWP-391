import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { authService } from '../api';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy thông báo từ navigation state
  useEffect(() => {
    const state = location.state as { message?: string; username?: string } | null;
    if (state?.message) {
      setSuccessMessage(state.message);
      // Pre-fill username nếu có
      if (state.username) {
        setFormData(prev => ({ ...prev, username: state.username }));
      }
      // Clear state để tránh hiển thị lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      // Nếu có nhiều role, chuyển đến trang chọn role
      if (response.roles.length > 1) {
        navigate('/select-role');
      } else {
        // Nếu chỉ có 1 role, tự động chọn và chuyển hướng
        const role = response.roles[0];
        const normalizedRole = role.toLowerCase().replace(/\s+/g, '');
        
        // Lưu role gốc từ API
        authService.setSelectedRole(role);
        
        // Chuyển hướng dựa trên role đã chuẩn hóa
        if (normalizedRole === 'student') {
          navigate('/student');
        } else if (normalizedRole === 'clubleader') {
          navigate('/leader');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {successMessage && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-300">Tên đăng nhập</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="babt"
            value={formData.username}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="password" className="font-medium text-slate-300">Mật khẩu</label>
            <button type="button" className="text-fuchsia-200 hover:text-white">Quên mật khẩu?</button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            required
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent text-fuchsia-500 focus:ring-fuchsia-400" />
          Giữ tôi luôn đăng nhập
        </label>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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


