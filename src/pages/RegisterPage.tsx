import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
    clubName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Xử lý đăng ký ở đây
  };

  return (
    <AuthLayout title="Tạo tài khoản">
      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Fullname */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
            Họ và tên
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nguyễn Minh Khang"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email trường
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="khangnm@student.edu.vn"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            required
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Vai trò
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                formData.role === 'student'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              Sinh viên
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'leader' })}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                formData.role === 'leader'
                  ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              Ban điều hành
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-fuchsia-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:translate-y-0.5"
        >
          Đăng ký ngay
        </button>
      </form>

      <div className="text-sm text-slate-400">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-medium text-white hover:underline">
          Đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
