import { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { Dialog } from '../../components/ui/Dialog';

const allClubs = [
  {
    id: 'innovation',
    name: 'CLB Lập trình Sáng tạo',
    category: 'tech',
    description: 'Học và chia sẻ kinh nghiệm lập trình, xây dựng dự án thực tế',
    members: 127,
    activities: 2,
    fee: 500000,
    rating: 4.8,
    reviews: 45,
    tags: ['React', 'AI', 'Hackathon'],
    badge: 'Top Pick',
    nextEvent: 'Workshop React - 15/12',
    recruiting: true,
  },
  {
    id: 'english',
    name: 'CLB Tiếng Anh Giao tiếp',
    category: 'language',
    description: 'Rèn luyện kỹ năng giao tiếp tiếng Anh qua hoạt động thực tế',
    members: 95,
    activities: 3,
    fee: 350000,
    rating: 4.6,
    reviews: 38,
    tags: ['Speaking', 'TOEIC', 'Networking'],
    badge: 'Popular',
    nextEvent: 'English Club - 12/12',
    recruiting: true,
  },
  {
    id: 'design',
    name: 'CLB Thiết kế Đồ họa',
    category: 'creative',
    description: 'Sáng tạo các tác phẩm thiết kế chuyên nghiệp',
    members: 68,
    activities: 1,
    fee: 0,
    rating: 4.7,
    reviews: 29,
    tags: ['UI/UX', 'Photoshop', 'Illustrator'],
    badge: 'Free',
    nextEvent: 'Design Contest - 18/12',
    recruiting: true,
  },
  {
    id: 'volunteer',
    name: 'CLB Tình nguyện Xanh',
    category: 'creative',
    description: 'Hoạt động tình nguyện vì cộng đồng và môi trường',
    members: 156,
    activities: 2,
    fee: 0,
    rating: 4.9,
    reviews: 87,
    tags: ['Thiện nguyện', 'Môi trường', 'Cộng đồng'],
    badge: 'Top Rated',
    nextEvent: 'Mùa đông ấm - 10/12',
    recruiting: true,
  },
  {
    id: 'blockchain',
    name: 'CLB Blockchain & Web3',
    category: 'tech',
    description: 'Nghiên cứu và phát triển ứng dụng Blockchain',
    members: 82,
    activities: 1,
    fee: 400000,
    rating: 4.5,
    reviews: 31,
    tags: ['Blockchain', 'Smart Contract', 'DeFi'],
    badge: 'Popular',
    nextEvent: 'Seminar Web3 - 20/12',
    recruiting: false,
  },
  {
    id: 'football',
    name: 'CLB Bóng đá FPT',
    category: 'sport',
    description: 'Rèn luyện sức khỏe và kỹ năng bóng đá',
    members: 143,
    activities: 3,
    fee: 200000,
    rating: 4.6,
    reviews: 56,
    tags: ['Thể thao', 'Sức khỏe', 'Teamwork'],
    nextEvent: 'Giao hữu - Thứ 7',
    recruiting: true,
  },
];

const availabilityOptions = [
  { id: 'weekday-evening', label: 'Tối trong tuần', subtext: '18:00 - 21:00' },
  { id: 'weekday-morning', label: 'Sáng trong tuần', subtext: '07:30 - 11:00' },
  { id: 'weekend', label: 'Cuối tuần', subtext: 'Thứ 7 - Chủ nhật' },
  { id: 'hybrid', label: 'Hybrid', subtext: 'Online + Offline' },
  { id: 'remote', label: 'Online', subtext: 'Qua Teams/Zoom' },
];

function StudentExplorePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClub, setSelectedClub] = useState<typeof allClubs[0] | null>(null);
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

  const requiredFieldKeys: Array<keyof typeof formData> = ['fullName', 'studentId', 'email', 'phone', 'major', 'motivation'];
  const filledRequiredFields = requiredFieldKeys.filter((key) => {
    const value = formData[key];
    return typeof value === 'string' && value.trim() !== '';
  }).length;
  const completionPercentage = Math.min(
    100,
    Math.round(
      ((filledRequiredFields + (formData.availability.length ? 1 : 0) + (formData.agreedToTerms ? 1 : 0)) /
        (requiredFieldKeys.length + 2)) *
        100,
    ),
  );

  const filteredClubs = allClubs;

  const handleRegister = (club: typeof allClubs[0]) => {
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

  const toggleAvailability = (slotId: string) => {
    setFormData(prev => {
      const isSelected = prev.availability.includes(slotId);
      return {
        ...prev,
        availability: isSelected ? prev.availability.filter(id => id !== slotId) : [...prev.availability, slotId],
      };
    });
  };

  const isFormValid = () => {
    return formData.fullName.trim() !== '' &&
           formData.studentId.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.phone.trim() !== '' &&
           formData.major.trim() !== '' &&
           formData.motivation.trim() !== '' &&
           formData.availability.length > 0 &&
           formData.agreedToTerms;
  };

  const confirmRegistration = async () => {
    if (!isFormValid()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsRegistering(true);
    // Simulate API call with form data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Registration data:', {
      club: selectedClub?.name,
      ...formData
    });
    
    setIsRegistering(false);
    setRegistrationSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSelectedClub(null);
      setRegistrationSuccess(false);
    }, 3000);
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
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Kết quả phù hợp</p>
                <p className="mt-1 text-sm text-slate-300">
                  Tìm thấy{' '}
                  <span className="font-semibold text-white">{filteredClubs.length}</span>{' '}
                  CLB theo bộ lọc hiện tại.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Sắp xếp:</span>
                  <select className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs text-white focus:border-violet-500/50 focus:outline-none">
                    <option>Phổ biến nhất</option>
                    <option>Đánh giá cao</option>
                    <option>Mới nhất</option>
                    <option>Thành viên nhiều nhất</option>
                  </select>
                </div>
                <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1 text-xs text-slate-300">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded-full px-3 py-1.5 transition ${
                      viewMode === 'grid' ? 'bg-violet-600 text-white' : 'hover:bg-white/10'
                    }`}
                  >
                    Lưới
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded-full px-3 py-1.5 transition ${
                      viewMode === 'list' ? 'bg-violet-600 text-white' : 'hover:bg-white/10'
                    }`}
                  >
                    Danh sách
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách CLB hoặc empty state */}
            {filteredClubs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center backdrop-blur-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <h4 className="text-lg font-semibold text-white">Không tìm thấy CLB phù hợp</h4>
                  <p className="text-sm text-slate-400">
                    Hãy thử xóa bớt từ khóa, chuyển sang chủ đề khác hoặc xem toàn bộ danh sách bằng cách chọn{' '}
                    <span className="font-medium text-slate-200">“Tất cả”</span>.
                  </p>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm transition hover:border-violet-500/40 hover:bg-slate-950/90 hover:shadow-xl hover:shadow-violet-500/15"
                  >
                    {/* Badge */}
                    {club.badge && (
                      <div className="absolute right-4 top-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                            club.badge === 'Top Pick'
                              ? 'border border-amber-500/40 bg-amber-500/20 text-amber-200'
                              : club.badge === 'Popular'
                              ? 'border border-violet-500/40 bg-violet-500/20 text-violet-100'
                              : club.badge === 'Free'
                              ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-100'
                              : 'border border-blue-500/40 bg-blue-500/20 text-blue-100'
                          }`}
                        >
                          {club.badge}
                        </span>
                      </div>
                    )}

                    {/* Avatar chữ cái */}
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 text-sm font-semibold text-white/90">
                        {club.name
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-white sm:text-base">{club.name}</h3>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          {club.category === 'tech'
                            ? 'Kỹ thuật & Công nghệ'
                            : club.category === 'creative'
                            ? 'Sáng tạo & Cộng đồng'
                            : club.category === 'language'
                            ? 'Ngôn ngữ & Giao tiếp'
                            : club.category === 'sport'
                            ? 'Thể thao & Sức khỏe'
                            : 'Khác'}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-300">
                      {club.description}
                    </p>

                    {/* Stats + tags */}
                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-center text-[11px] text-slate-300">
                        <div>
                          <p className="text-[11px] text-slate-400">Thành viên</p>
                          <p className="mt-0.5 text-sm font-semibold text-white">{club.members}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">HĐ/tuần</p>
                          <p className="mt-0.5 text-sm font-semibold text-white">{club.activities}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">Phí</p>
                          <p className="mt-0.5 text-sm font-semibold text-emerald-400">
                            {club.fee === 0 ? 'Miễn phí' : club.fee.toLocaleString() + 'đ'}
                          </p>
                        </div>
                      </div>

                      {club.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {club.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/student/explore/${club.id}`}
                        className="flex-1 rounded-xl border border-white/15 px-3.5 py-2.5 text-center text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                      >
                        Xem chi tiết
                      </Link>
                      {club.recruiting ? (
                        <button
                          onClick={() => handleRegister(club)}
                          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/30 transition hover:shadow-violet-500/60"
                        >
                          Đăng ký ngay
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 cursor-not-allowed rounded-xl bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-400"
                        >
                          Đã đóng đơn
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm transition hover:border-violet-500/40 hover:bg-slate-950/90 sm:flex-row"
                  >
                    {/* Trái: Avatar + mô tả */}
                    <div className="flex flex-1 items-start gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 text-base font-semibold text-white/90">
                        {club.name
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-white sm:text-lg">{club.name}</h3>
                          {club.badge && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                club.badge === 'Top Pick'
                                  ? 'border border-amber-500/40 bg-amber-500/20 text-amber-200'
                                  : club.badge === 'Popular'
                                  ? 'border border-violet-500/40 bg-violet-500/20 text-violet-100'
                                  : club.badge === 'Free'
                                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-100'
                                  : 'border border-blue-500/40 bg-blue-500/20 text-blue-100'
                              }`}
                            >
                              {club.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-300">{club.description}</p>
                        {club.tags && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {club.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phải: thống kê & action */}
                    <div className="flex flex-col justify-between gap-3 sm:w-72 sm:flex-shrink-0">
                      <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-center text-[11px] text-slate-300">
                        <div>
                          <p className="text-[11px] text-slate-400">Thành viên</p>
                          <p className="mt-0.5 text-base font-semibold text-white">{club.members}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">HĐ/tuần</p>
                          <p className="mt-0.5 text-base font-semibold text-white">{club.activities}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">Phí tham gia</p>
                          <p className="mt-0.5 text-base font-semibold text-emerald-400">
                            {club.fee === 0 ? 'Miễn phí' : club.fee.toLocaleString() + 'đ'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/student/explore/${club.id}`}
                          className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-center text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                          Xem chi tiết
                        </Link>
                        {club.recruiting ? (
                          <button
                            onClick={() => handleRegister(club)}
                            className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/30 transition hover:shadow-violet-500/60"
                          >
                            Đăng ký ngay
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 cursor-not-allowed rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-400"
                          >
                            Đã đóng đơn
                          </button>
                        )}
                      </div>
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
              <div className="relative max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl">
                <button
                  onClick={() => setSelectedClub(null)}
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Đóng"
                >
                  ×
                </button>

                {!registrationSuccess ? (
                  <div className="grid h-full max-h-[90vh] grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_1.9fr]">
                    <aside className="flex flex-col gap-6 overflow-y-auto border-b border-white/5 bg-gradient-to-b from-violet-900/70 via-fuchsia-900/40 to-slate-950/80 px-6 py-8 text-white lg:border-b-0 lg:border-r">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/70">CLB bạn chọn</p>
                        <h3 className="mt-2 text-2xl font-bold">{selectedClub.name}</h3>
                        <p className="mt-2 text-sm text-white/70">{selectedClub.description}</p>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg shadow-violet-500/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white/80">
                            {selectedClub.name
                              .split(' ')
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="text-sm text-white/70">Độ phủ cộng đồng</p>
                            <p className="text-lg font-semibold">{selectedClub.members}+ thành viên</p>
                          </div>
                        </div>
                        <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs text-white/60">Hoạt động/tuần</p>
                            <p className="text-lg font-semibold text-white">{selectedClub.activities}</p>
                          </li>
                          <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs text-white/60">Chi phí</p>
                            <p className="text-lg font-semibold text-emerald-300">
                              {selectedClub.fee === 0 ? 'Miễn phí' : `${selectedClub.fee.toLocaleString()}đ`}
                            </p>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Focus tags</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedClub.tags?.map(tag => (
                            <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                        <div className="flex items-center justify-between text-sm text-white/70">
                          <span>Tiến độ hồ sơ</span>
                          <span className="font-semibold text-white">{completionPercentage}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 transition-all" style={{ width: `${completionPercentage}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-white/60">Điền đầy đủ thông tin & chọn lịch tham gia để đạt 100%</p>
                      </div>

                      <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-4 text-sm text-amber-100">
                        <p className="font-semibold text-amber-200">Sự kiện sắp tới</p>
                        <p className="mt-1 text-2xl font-bold text-white">{selectedClub.nextEvent ?? 'Sự kiện nội bộ tuần này'}</p>
                        <p className="mt-2 text-xs text-amber-100/90">
                          Đăng ký sớm để giữ chỗ và nhận thông báo chi tiết qua email.
                        </p>
                      </div>
                    </aside>

                    <section className="flex flex-col overflow-y-auto px-6 py-6">
                      <header className="pb-5">
                        <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Đơn đăng ký</span>
                        <h3 className="mt-2 text-3xl font-semibold text-white">Tạo hồ sơ tham gia</h3>
                        <p className="mt-2 text-sm text-slate-400">
                          Thông tin càng chi tiết, Ban Quản Lý càng dễ kết nối bạn với nhóm phù hợp.
                        </p>
                      </header>

                      <div className="space-y-6">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-300">1</span>
                            Thông tin cá nhân
                          </h5>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Họ và tên *</label>
                              <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleFormChange('fullName', e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Mã sinh viên *</label>
                              <input
                                type="text"
                                value={formData.studentId}
                                onChange={(e) => handleFormChange('studentId', e.target.value)}
                                placeholder="SE123456"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Email *</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                                placeholder="nguyenvana@fpt.edu.vn"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Số điện thoại *</label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleFormChange('phone', e.target.value)}
                                placeholder="0912345678"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Chuyên ngành *</label>
                              <input
                                type="text"
                                value={formData.major}
                                onChange={(e) => handleFormChange('major', e.target.value)}
                                placeholder="Software Engineering"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Năm học *</label>
                              <select
                                value={formData.year}
                                onChange={(e) => handleFormChange('year', e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              >
                                <option value="1">Năm 1</option>
                                <option value="2">Năm 2</option>
                                <option value="3">Năm 3</option>
                                <option value="4">Năm 4</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-300">2</span>
                            Mục tiêu & kinh nghiệm
                          </h5>
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Lý do tham gia *</label>
                              <textarea
                                value={formData.motivation}
                                onChange={(e) => handleFormChange('motivation', e.target.value)}
                                rows={4}
                                placeholder="Chia sẻ bạn mong muốn điều gì khi tham gia CLB..."
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Kinh nghiệm liên quan</label>
                              <textarea
                                value={formData.experience}
                                onChange={(e) => handleFormChange('experience', e.target.value)}
                                rows={3}
                                placeholder="Kể về kỹ năng, dự án, thành tựu liên quan..."
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-300">3</span>
                            Thời gian & cam kết
                          </h5>
                          <p className="mt-2 text-sm text-slate-400">Chọn khung thời gian bạn có thể tham gia hoạt động định kỳ.</p>

                          <div className="mt-4 grid gap-3 lg:grid-cols-2">
                            {availabilityOptions.map(slot => {
                              const isSelected = formData.availability.includes(slot.id);
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => toggleAvailability(slot.id)}
                                  aria-pressed={isSelected}
                                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                                    isSelected
                                      ? 'border-emerald-400/60 bg-emerald-400/15 text-white shadow-lg shadow-emerald-500/20'
                                      : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                                  }`}
                                >
                                  <p className="text-sm font-semibold">{slot.label}</p>
                                  <p className="text-xs text-white/60">{slot.subtext}</p>
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <label className="flex cursor-pointer items-start gap-3">
                              <input
                                type="checkbox"
                                checked={formData.agreedToTerms}
                                onChange={(e) => handleFormChange('agreedToTerms', e.target.checked)}
                                className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-900/40 text-violet-600 focus:ring-2 focus:ring-violet-500/20 focus:ring-offset-0"
                              />
                              <span className="text-sm text-slate-300">
                                Tôi cam kết tham gia đầy đủ hoạt động, tuân thủ nội quy và hoàn tất phí nếu có. <span className="text-red-400">*</span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2 rounded-2xl border border-blue-400/30 bg-blue-950/40 p-5 text-sm text-blue-100">
                        <p className="font-semibold">Lưu ý</p>
                        <p>
                          Ban Quản Lý sẽ phản hồi qua email trong 24-48 giờ. Bạn có thể theo dõi trạng thái tại trang
                          “Đơn của tôi”.
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row">
                        <button
                          onClick={() => setSelectedClub(null)}
                          className="w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                          Để sau
                        </button>
                        <button
                          onClick={confirmRegistration}
                          disabled={isRegistering || !isFormValid()}
                          className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isRegistering ? (
                            <span className="flex items-center justify-center gap-2 animate-pulse">
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
                  <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center text-white">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/20 text-3xl font-bold text-emerald-200">
                      ✓
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.5em] text-emerald-200">Hoàn tất</p>
                      <h4 className="text-3xl font-bold">Đăng ký thành công!</h4>
                      <p className="text-base text-slate-300">
                        Cảm ơn bạn đã đăng ký tham gia <span className="text-violet-200">{selectedClub.name}</span>. Chúng tôi sẽ gửi phản hồi sớm nhất qua email.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClub(null);
                        setRegistrationSuccess(false);
                      }}
                      className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
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



