import { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { Dialog } from '../../components/ui/Dialog';
import { clubService } from '../../api/services/club.service';
import { membershipService } from '../../api/services/membership.service';
import type { ClubListItem } from '../../api/types/club.types';

// Extended club type for UI display
interface DisplayClub {
  id: string;
  name: string;
  description: string;
  members?: number;
  fee: number;
  recruiting: boolean;
  imageUrl?: string | null;
  establishedDate?: string;
}

// Helper component for club avatar with fallback
function ClubAvatar({ imageUrl, name, size = 'md' }: { imageUrl?: string | null; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = {
    sm: 'h-12 w-12 text-sm',
    md: 'h-16 w-16 text-base',
    lg: 'h-24 w-24 text-xl',
  };
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} flex-shrink-0 rounded-2xl object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 font-semibold text-blue-700`}>
      {initials}
    </div>
  );
}

function StudentExplorePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [clubs, setClubs] = useState<DisplayClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<DisplayClub | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Registration form data
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    major: '',
    year: '1',
    motivation: '',
    experience: '',
    availability: [] as string[],
    agreedToTerms: false,
  });

  // Only validate fields required by API: fullName, email, phone, motivation (reason)
  const requiredFieldKeys: Array<keyof typeof formData> = ['fullName', 'email', 'phone', 'motivation'];
  const filledRequiredFields = requiredFieldKeys.filter((key) => {
    const value = formData[key];
    return typeof value === 'string' && value.trim() !== '';
  }).length;
  const completionPercentage = Math.min(
    100,
    Math.round((filledRequiredFields / requiredFieldKeys.length) * 100),
  );

  // Fetch clubs from API
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiClubs = await clubService.getAllClubs();
        
        // Debug: Log để kiểm tra dữ liệu từ API
        console.log('API Clubs data:', apiClubs);
        if (apiClubs.length > 0) {
          console.log('First club sample:', apiClubs[0]);
          console.log('Has establishedDate?', 'establishedDate' in apiClubs[0], apiClubs[0].establishedDate);
        }
        
        // Map API response to display format
        const mappedClubs: DisplayClub[] = apiClubs.map((club: ClubListItem) => ({
          id: club.id.toString(),
          name: club.name,
          description: club.description,
          members: club.memberCount,
          fee: club.membershipFee,
          recruiting: club.status?.toLowerCase() === 'active',
          imageUrl: club.imageClubsUrl,
          establishedDate: club.establishedDate,
        }));
        
        // Debug: Log mapped clubs
        console.log('Mapped clubs:', mappedClubs);
        if (mappedClubs.length > 0) {
          console.log('First mapped club:', mappedClubs[0]);
        }
        
        setClubs(mappedClubs);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError('Không thể tải danh sách CLB. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filteredClubs = clubs;

  const handleRegister = (club: DisplayClub) => {
    setSelectedClub(club);
    // Reset form
    setFormData({
      fullName: '',
      studentId: '',
      email: '',
      phone: '',
      major: '',
      year: '1',
      motivation: '',
      experience: '',
      availability: [],
      agreedToTerms: false,
    });
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    // Only validate fields required by API
    return formData.fullName.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.phone.trim() !== '' &&
           formData.motivation.trim() !== '';
  };

  const confirmRegistration = async () => {
    if (!isFormValid() || !selectedClub) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsRegistering(true);
    try {
      // Call API to create membership request
      await membershipService.createStudentRequest({
        clubId: parseInt(selectedClub.id),
        reason: formData.motivation,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      
      setRegistrationSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSelectedClub(null);
        setRegistrationSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting membership request:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <StudentLayout
      title="Khám phá CLB"
      subtitle="Tìm kiếm, so sánh và đăng ký CLB phù hợp với mục tiêu phát triển của bạn."
    >
      <div className="space-y-6">
        {/* Layout 2 cột: Bộ lọc + Kết quả */}
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          {/* Cột trái: Bộ lọc */}
        

          {/* Cột phải: Kết quả & chế độ xem */}
          <section className="space-y-4">
            {/* Header kết quả + chế độ xem */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Kết quả phù hợp</p>
                <p className="mt-1 text-sm text-slate-600">
                  Tìm thấy{' '}
                  <span className="font-semibold text-slate-900">{filteredClubs.length}</span>{' '}
                  CLB theo bộ lọc hiện tại.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Sắp xếp:</span>
                  <select className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none">
                    <option>Phổ biến nhất</option>
                    <option>Đánh giá cao</option>
                    <option>Mới nhất</option>
                    <option>Thành viên nhiều nhất</option>
                  </select>
                </div>
                <div className="inline-flex rounded-full border border-slate-300 bg-white p-1 text-xs text-slate-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded-full px-3 py-1.5 transition ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'
                    }`}
                  >
                    Lưới
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded-full px-3 py-1.5 transition ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'
                    }`}
                  >
                    Danh sách
                  </button>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-sm text-slate-600">Đang tải danh sách CLB...</p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-10 text-center shadow-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <h4 className="text-lg font-semibold text-red-700">Lỗi tải dữ liệu</h4>
                  <p className="text-sm text-slate-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            ) : filteredClubs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <h4 className="text-lg font-semibold text-slate-900">Không tìm thấy CLB phù hợp</h4>
                  <p className="text-sm text-slate-600">
                    Hãy thử xóa bớt từ khóa, chuyển sang chủ đề khác hoặc xem toàn bộ danh sách bằng cách chọn{' '}
                    <span className="font-medium text-slate-700">"Tất cả"</span>.
                  </p>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    {/* Avatar hình ảnh hoặc chữ cái */}
                    <div className="mb-3 flex items-center gap-3">
                      <ClubAvatar imageUrl={club.imageUrl} name={club.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">{club.name}</h3>
                        {club.establishedDate ? (
                          <p className="mt-0.5 text-xs text-slate-500">
                            Thành lập: {new Date(club.establishedDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-xs text-slate-400 italic">Chưa có thông tin ngày thành lập</p>
                        )}
                      </div>
                    </div>

                    <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">
                      {club.description}
                    </p>

                    {/* Stats + tags */}
                    <div className="mt-3 space-y-3">
                      <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                        {/* Hình ảnh CLB */}
                        {club.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={club.imageUrl}
                              alt={club.name}
                              className="h-16 w-16 rounded-lg object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {/* Thông tin phí và thành viên */}
                      <div className={`flex-1 grid gap-2 text-center text-[11px] text-slate-600 ${(club.members ?? 0) > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {(club.members ?? 0) > 0 && (
                            <div>
                              <p className="text-[11px] text-slate-500">Thành viên</p>
                              <p className="mt-0.5 text-sm font-semibold text-slate-900">{club.members}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-[11px] text-slate-500">Phí/tháng</p>
                            <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                              {club.fee === 0 ? 'Miễn phí' : club.fee.toLocaleString() + 'đ'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {club.recruiting && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleRegister(club)}
                          className="w-full rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                        >
                          Đăng ký ngay
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="group flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:flex-row"
                  >
                    {/* Trái: Avatar + mô tả */}
                    <div className="flex flex-1 items-start gap-4">
                      <ClubAvatar imageUrl={club.imageUrl} name={club.name} size="md" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{club.name}</h3>
                        </div>
                        {club.establishedDate ? (
                          <p className="text-xs text-slate-500">
                            Thành lập: {new Date(club.establishedDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Chưa có thông tin ngày thành lập</p>
                        )}
                        <p className="text-[13px] leading-relaxed text-slate-600">{club.description}</p>
                      </div>
                    </div>

                    {/* Phải: thống kê & action */}
                    <div className="flex flex-col justify-between gap-3 sm:w-72 sm:flex-shrink-0">
                      <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                        {/* Hình ảnh CLB */}
                        {club.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={club.imageUrl}
                              alt={club.name}
                              className="h-20 w-20 rounded-lg object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {/* Thông tin phí và thành viên */}
                        <div className={`flex-1 grid gap-2 text-center text-[11px] text-slate-600 ${(club.members ?? 0) > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {(club.members ?? 0) > 0 && (
                            <div>
                              <p className="text-[11px] text-slate-500">Thành viên</p>
                              <p className="mt-0.5 text-base font-semibold text-slate-900">{club.members}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-[11px] text-slate-500">Phí/tháng</p>
                            <p className="mt-0.5 text-base font-semibold text-emerald-700">
                              {club.fee === 0 ? 'Miễn phí' : club.fee.toLocaleString() + 'đ/tháng'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {club.recruiting && (
                        <div className="flex">
                          <button
                            onClick={() => handleRegister(club)}
                            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                          >
                            Đăng ký ngay
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={selectedClub !== null} onOpenChange={(open) => !open && setSelectedClub(null)}>
        {selectedClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedClub(null)} />
            <div className="relative z-10 w-full max-w-5xl">
              <div className="relative max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <button
                  onClick={() => setSelectedClub(null)}
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Đóng"
                >
                  ×
                </button>

                {!registrationSuccess ? (
                  <div className="grid h-full max-h-[90vh] grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_1.9fr]">
                    <aside className="flex flex-col gap-6 overflow-y-auto border-b border-slate-200 bg-slate-50 px-6 py-8 lg:border-b-0 lg:border-r">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">CLB bạn chọn</p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedClub.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">{selectedClub.description}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        {(selectedClub.members ?? 0) > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-slate-600">Độ phủ cộng đồng</p>
                            <p className="text-lg font-semibold text-slate-900">{selectedClub.members}+ thành viên</p>
                          </div>
                        )}
                        {/* Hình ảnh và phí/tháng */}
                        <div className="mb-3 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          {selectedClub.imageUrl && (
                            <div className="flex-shrink-0">
                              <img
                                src={selectedClub.imageUrl}
                                alt={selectedClub.name}
                                className="h-20 w-20 rounded-lg object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">Phí/tháng</p>
                            <p className="text-lg font-semibold text-emerald-700">
                              {selectedClub.fee === 0 ? 'Miễn phí' : `${selectedClub.fee.toLocaleString()}đ/tháng`}
                            </p>
                          </div>
                        </div>
                        {/* Ngày thành lập */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Ngày thành lập</p>
                          {selectedClub.establishedDate ? (
                            <p className="text-lg font-semibold text-slate-900">
                              {new Date(selectedClub.establishedDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-400 italic">Chưa có thông tin</p>
                          )}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Tiến độ hồ sơ</span>
                          <span className="font-semibold text-slate-900">{completionPercentage}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${completionPercentage}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Điền đầy đủ thông tin & chọn lịch tham gia để đạt 100%</p>
                      </div>

                    </aside>

                    <section className="flex h-full max-h-[90vh] flex-col overflow-hidden px-6 py-6">
                      <header className="flex-shrink-0 pb-5">
                        <span className="text-xs uppercase tracking-[0.4em] text-slate-500">Đơn đăng ký</span>
                        <h3 className="mt-2 text-3xl font-semibold text-slate-900">Tạo hồ sơ tham gia</h3>
                        <p className="mt-2 text-sm text-slate-600">
                          Thông tin càng chi tiết, Ban Quản Lý càng dễ kết nối bạn với nhóm phù hợp.
                        </p>
                      </header>

                      <div className="min-h-0 flex-1 overflow-y-auto space-y-6 pr-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">1</span>
                            Thông tin cá nhân
                          </h5>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">Họ và tên *</label>
                              <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleFormChange('fullName', e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">Email *</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                                placeholder="nguyenvana@fpt.edu.vn"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">Số điện thoại *</label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleFormChange('phone', e.target.value)}
                                placeholder="0912345678"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">Lý do tham gia *</label>
                              <textarea
                                value={formData.motivation}
                                onChange={(e) => handleFormChange('motivation', e.target.value)}
                                rows={4}
                                placeholder="Chia sẻ bạn mong muốn điều gì khi tham gia CLB..."
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nút hành động - luôn hiển thị ở cuối */}
                      <div className="mt-6 flex flex-shrink-0 flex-col gap-3 border-t border-slate-200 bg-white pt-5 pb-2 sm:flex-row" style={{ zIndex: 10 }}>
                        <button
                          type="button"
                          onClick={() => setSelectedClub(null)}
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                          Để sau
                        </button>
                        <button
                          type="button"
                          onClick={confirmRegistration}
                          disabled={isRegistering || !isFormValid()}
                          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isRegistering ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              Đang gửi...
                            </span>
                          ) : (
                            'Gửi đơn ngay'
                          )}
                        </button>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
                      ✓
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.5em] text-emerald-700">Hoàn tất</p>
                      <h4 className="text-3xl font-bold text-slate-900">Đăng ký thành công!</h4>
                      <p className="text-base text-slate-600">
                        Cảm ơn bạn đã đăng ký tham gia <span className="text-blue-700">{selectedClub.name}</span>. Chúng tôi sẽ gửi phản hồi sớm nhất qua email.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClub(null);
                        setRegistrationSuccess(false);
                      }}
                      className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </StudentLayout>
  );
}

export default StudentExplorePage;



