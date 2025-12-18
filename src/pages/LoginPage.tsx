import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { authService } from '../api';
import { useAppContext } from '../context/AppContext';
import { showErrorToast, showSuccessToast } from '../utils/toast';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Lấy thông báo từ navigation state
  useEffect(() => {
    const state = location.state as { message?: string; username?: string } | null;
    if (state?.message) {
      showSuccessToast(state.message);
      // Pre-fill username nếu có
      if (state.username) {
        setFormData(prev => ({ ...prev, username: state.username || '' }));
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
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      // Cập nhật user vào AppContext
      setUser({
        accountId: response.accountId,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        imageAccountUrl: response.imageAccountUrl,
        roles: response.roles,
        selectedRole: response.roles.length === 1 ? response.roles[0] : undefined,
      });
      
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
      // Hiển thị thông báo lỗi thân thiện cho người dùng
      if (err instanceof Error) {
          showErrorToast(err.message);
      } else {
        showErrorToast('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700">Tên đăng nhập</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="babt"
            value={formData.username}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">Mật khẩu</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Giữ tôi luôn đăng nhập
          </label>
          <button type="button" className="text-blue-600 hover:text-blue-700">Quên mật khẩu?</button>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      <div className="text-sm text-slate-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;


