import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { authService } from '../api';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await authService.register(formData);
      
      // Xóa token vì chưa muốn auto-login
      authService.logout();
      
      // Chuyển về trang login với thông báo thành công
      navigate('/login', { 
        state: { 
          message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
          username: formData.username 
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700">
            Tên đăng nhập
          </label>
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

        {/* Fullname */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
            Họ và tên
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nguyễn Minh Khang"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="string@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0123456789"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký ngay'}
        </button>
      </form>

      <div className="text-sm text-slate-600">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
          Đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
