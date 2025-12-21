import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { authService } from '../api';
import { showErrorToast } from '../utils/toast';
import { cn } from '../components/utils/cn';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Regex for Vietnamese phone carriers
  const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Username: at least 3 characters
    if (!formData.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    // Full name: no numbers
    if (!formData.fullName.trim()) {
      errors.fullName = 'Họ và tên không được để trống';
    } else if (/\d/.test(formData.fullName)) {
      errors.fullName = 'Họ và tên không được chứa số';
    }

    // Email: valid format
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }

    // Phone: Vietnamese carriers only
    if (!formData.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9+]+$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại chỉ được chứa số';
    } else if (!vietnamPhoneRegex.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ (Viettel, Vinaphone, Mobiphone)';
    }

    // Password: min 8 chars, uppercase
    if (!formData.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 8) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }
    
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
      showErrorToast(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700">
            Tên đăng nhập <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="babt"
            value={formData.username}
            onChange={handleChange}
            className={cn(
              'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
              validationErrors.username ? 'border-red-500' : 'border-slate-300'
            )}
          />
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
          )}
        </div>

        {/* Fullname */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nguyễn Minh Khang"
            value={formData.fullName}
            onChange={handleChange}
            className={cn(
              'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
              validationErrors.fullName ? 'border-red-500' : 'border-slate-300'
            )}
          />
          {validationErrors.fullName && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="string@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className={cn(
              'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
              validationErrors.email ? 'border-red-500' : 'border-slate-300'
            )}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0987654321"
            value={formData.phone}
            onChange={handleChange}
            className={cn(
              'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
              validationErrors.phone ? 'border-red-500' : 'border-slate-300'
            )}
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ít nhất 8 ký tự và chữ hoa"
              value={formData.password}
              onChange={handleChange}
              className={cn(
                'mt-2 w-full rounded-xl border bg-white px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
                validationErrors.password ? 'border-red-500' : 'border-slate-300'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
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
