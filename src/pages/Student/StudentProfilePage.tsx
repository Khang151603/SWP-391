import { useState, useEffect, useRef } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { Button } from '../../components/ui/Button';
import { authService } from '../../api';
import { useAppContext } from '../../context/AppContext';
import { httpClient } from '../../api/config/client';
import { USER_ENDPOINTS } from '../../api/config/constants';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

function StudentProfilePage() {
  const { user, updateUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // Load user data khi component mount
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: '', // Phone không có trong UserInfo, sẽ cần fetch từ API nếu cần
      });
      // Load avatar URL from user context - đảm bảo luôn sync với context
      setAvatarUrl(user.imageAccountUrl || null);
      setAvatarPreview(null); // Clear preview when loading from context
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      showErrorToast('Họ và tên không được để trống');
      return;
    }

    if (!formData.email.trim()) {
      showErrorToast('Email không được để trống');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showErrorToast('Email không đúng định dạng');
      return;
    }

    if (formData.phone && !/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(formData.phone)) {
      showErrorToast('Số điện thoại không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      // Call API update profile: PUT /api/Account/profile
      const response = await authService.updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        imageAccountUrl: avatarUrl || undefined,
      });

      // Update context với thông tin mới từ response
      // Response từ BE đã bao gồm imageAccountUrl
      if (updateUser) {
        updateUser({
          ...user!,
          fullName: response.fullName,
          email: response.email,
          imageAccountUrl: response.imageAccountUrl || avatarUrl || undefined, // Fallback to current avatarUrl if response doesn't include it
        });
      }

      // Update local state to match saved data
      if (response.imageAccountUrl) {
        setAvatarUrl(response.imageAccountUrl);
        setAvatarPreview(null); // Clear preview since we're using the saved URL now
      }

      showSuccessToast('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : 'Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form về giá trị ban đầu
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: '',
      });
    }
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showErrorToast('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call API upload avatar
      // Không set Content-Type header để browser tự động set với boundary
      const response = await httpClient.post<{ message?: string; avatarUrl: string; publicId: string }>(
        USER_ENDPOINTS.UPLOAD_AVATAR,
        formData,
        {
          skipContentType: true, // Quan trọng: để browser tự động set Content-Type với boundary
        }
      );

      setAvatarUrl(response.avatarUrl);
      showSuccessToast('Upload ảnh đại diện thành công!');
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : 'Không thể upload ảnh. Vui lòng thử lại.');
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <StudentLayout title="Thông tin cá nhân" subtitle="Quản lý thông tin tài khoản của bạn">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Thông tin cá nhân</h1>
            <p className="mt-1 text-sm text-slate-600">Cập nhật thông tin tài khoản của bạn</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              Chỉnh sửa
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Avatar Section */}
          <div className="mb-8 flex items-center gap-6">
            <div className="relative group">
              {avatarPreview || avatarUrl ? (
                <img 
                  src={avatarPreview || avatarUrl || ''} 
                  alt="Avatar" 
                  className="h-24 w-24 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white shadow-lg">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              
              {isEditing && (
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 hover:bg-opacity-50 transition-all cursor-pointer group-hover:bg-opacity-40"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    {isUploadingAvatar ? (
                      <div className="flex flex-col items-center">
                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-xs mt-1">Đang tải...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs mt-1">Đổi ảnh</span>
                      </div>
                    )}
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{user?.fullName}</h2>
              <p className="text-sm text-slate-500">{user?.username}</p>
              {isEditing && (
                <p className="mt-1 text-xs text-slate-600">
                  Click vào ảnh để thay đổi (Max 5MB)
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {user?.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username (read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">Tên đăng nhập không thể thay đổi</p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full rounded-xl border ${
                  isEditing ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50'
                } px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:text-slate-500`}
                placeholder="Nguyễn Văn A"
              />
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
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full rounded-xl border ${
                  isEditing ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50'
                } px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:text-slate-500`}
                placeholder="example@email.com"
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
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full rounded-xl border ${
                  isEditing ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50'
                } px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:text-slate-500`}
                placeholder="0987654321"
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Lưu ý khi cập nhật thông tin</p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-blue-700">
                <li>Email phải là địa chỉ email hợp lệ và chưa được sử dụng bởi tài khoản khác</li>
                <li>Số điện thoại phải là số di động Việt Nam hợp lệ (10 chữ số)</li>
                <li>Thông tin cập nhật sẽ được áp dụng cho tất cả các hoạt động của bạn trong hệ thống</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentProfilePage;
