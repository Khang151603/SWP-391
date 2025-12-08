import { useState, useEffect, useMemo } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';

type ClubProfile = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stats: {
    members: number;
    activitiesPerMonth: number;
    rating: number;
  };
  goals: string[];
  contact: {
    email: string;
    phone: string;
    facebook: string;
    workspace: string;
  };
  cover: string;
  category?: string;
  visibility: 'public' | 'internal';
};

const defaultClubProfile: ClubProfile = {
  id: '1',
  name: 'CLB Truyền thông',
  tagline: 'Media Lab • Creative & Impactful',
  description:
    'Tạo ra các chiến dịch truyền thông sáng tạo, kết nối sinh viên với hoạt động cộng đồng và xây dựng hình ảnh trường năng động.',
  stats: {
    members: 84,
    activitiesPerMonth: 12,
    rating: 4.9,
  },
  goals: [
    'Tổ chức tối thiểu 2 chiến dịch truyền thông lớn mỗi học kỳ',
    'Xây dựng đội ngũ mentor nội bộ cho member mới',
    'Mở rộng mạng lưới đối tác doanh nghiệp về truyền thông số',
  ],
  contact: {
    email: 'leader.media@university.edu.vn',
    phone: '0966 888 123',
    facebook: 'facebook.com/clb-truyen-thong',
    workspace: 'Notion: clubos.cc/medialab',
  },
  cover: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&q=80&w=1200',
  category: 'Media & Communication',
  visibility: 'public',
};

function ClubLeaderInfoPage() {
  const [clubs, setClubs] = useState<ClubProfile[]>([defaultClubProfile]);
  const [selectedClubId, setSelectedClubId] = useState<string>(defaultClubProfile.id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);

  const selectedClub = useMemo(
    () => clubs.find((club) => club.id === selectedClubId) || clubs[0],
    [clubs, selectedClubId]
  );
  
  const [formData, setFormData] = useState<ClubProfile>(selectedClub);

  // Update form data when selected club changes
  useEffect(() => {
    const club = clubs.find((c) => c.id === selectedClubId);
    if (club) {
      setFormData({ ...club });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClubId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof ClubProfile] as object),
            [child]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleGoalChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newGoals = [...prev.goals];
      newGoals[index] = value;
      return { ...prev, goals: newGoals };
    });
  };

  const handleAddGoal = () => {
    setFormData((prev) => ({
      ...prev,
      goals: [...prev.goals, ''],
    }));
  };

  const handleRemoveGoal = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const handleCreateNewClub = () => {
    const newClub: ClubProfile = {
      id: Date.now().toString(),
      name: '',
      tagline: '',
      description: '',
      stats: {
        members: 0,
        activitiesPerMonth: 0,
        rating: 0,
      },
      goals: [],
      contact: {
        email: '',
        phone: '',
        facebook: '',
        workspace: '',
      },
      cover: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&q=80&w=1200',
      category: '',
      visibility: 'public',
    };
    setClubs([...clubs, newClub]);
    setSelectedClubId(newClub.id);
    setFormData(newClub);
  };

  const handleSaveClub = () => {
    setClubs((prev) => prev.map((club) => (club.id === selectedClubId ? formData : club)));
  };

  const handleDeleteClub = () => {
    if (clubs.length === 1) {
      alert('Không thể xóa CLB cuối cùng. Vui lòng tạo CLB mới trước.');
      return;
    }
    setClubs((prev) => prev.filter((club) => club.id !== selectedClubId));
    const remainingClubs = clubs.filter((club) => club.id !== selectedClubId);
    if (remainingClubs.length > 0) {
      setSelectedClubId(remainingClubs[0].id);
      setFormData(remainingClubs[0]);
    }
    setShowDeleteConfirm(false);
  };

  const handleViewDetail = (clubId: string) => {
    const club = clubs.find((c) => c.id === clubId);
    if (club) {
      setSelectedClubId(clubId);
      setFormData(club);
      setShowDetailView(true);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailView(false);
    // Save any unsaved changes before closing
    handleSaveClub();
  };
  return (
    <LeaderLayout
      title="Quản lý hồ sơ CLB"
      subtitle="Thiết lập thông tin hiển thị với sinh viên, nhà trường và trên trang truyền thông"
    >
      <div className="space-y-8">
        {/* Header with Create Button */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Danh sách CLB</h2>
              <p className="mt-1 text-sm text-slate-400">
                Quản lý thông tin và cài đặt cho {clubs.length} {clubs.length === 1 ? 'CLB' : 'CLB'} của bạn
              </p>
            </div>
            <button
              onClick={handleCreateNewClub}
              className="rounded-2xl bg-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-400 whitespace-nowrap"
            >
              + Tạo CLB mới
            </button>
          </div>
        </section>

        {/* Clubs Table */}
        {!showDetailView && (
          <section className="rounded-3xl border border-white/10 bg-slate-950/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Tên CLB
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Tagline
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Thành viên
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Hoạt động
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Đánh giá
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clubs.map((club) => (
                    <tr
                      key={club.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={club.cover}
                              alt={club.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {club.name || `CLB mới (${club.id.slice(-6)})`}
                            </p>
                            {club.category && (
                              <p className="text-xs text-slate-400 mt-0.5">{club.category}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300 line-clamp-1 max-w-xs">
                          {club.tagline || 'Chưa có tagline'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-200 ring-1 ring-fuchsia-400/40">
                          {club.stats.members}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200 ring-1 ring-amber-400/40">
                          {club.stats.activitiesPerMonth}/tháng
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-medium text-emerald-200">
                            {club.stats.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-slate-400">/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                            club.visibility === 'public'
                              ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/50'
                              : 'bg-slate-500/10 text-slate-300 ring-slate-400/50'
                          }`}
                        >
                          {club.visibility === 'public' ? 'Công khai' : 'Nội bộ'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(club.id)}
                            className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/60 px-3 py-1.5 text-xs font-semibold text-fuchsia-100 hover:bg-fuchsia-500/20 transition-colors"
                          >
                            Chi tiết
                          </button>
                          {clubs.length > 1 && (
                            <button
                              onClick={() => {
                                setSelectedClubId(club.id);
                                setShowDeleteConfirm(true);
                              }}
                              className="rounded-xl border border-red-400/60 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-500/20 transition-colors"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {clubs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">Chưa có CLB nào. Hãy tạo CLB mới để bắt đầu.</p>
              </div>
            )}
          </section>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-white mb-2">Xác nhận xóa CLB</h3>
              <p className="text-sm text-slate-300 mb-6">
                Bạn có chắc chắn muốn xóa CLB "{selectedClub.name}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteClub}
                  className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
                >
                  Xóa CLB
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail View: form + live preview */}
        {showDetailView && (
          <>
            {/* Back Button Header */}
            <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCloseDetail}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors"
                  >
                    ← Quay lại danh sách
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Chỉnh sửa: {formData.name || 'CLB mới'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">Cập nhật thông tin chi tiết của CLB</p>
                  </div>
                </div>
                <button className="hidden rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-white/10 md:inline-flex">
                  Xem trước ở trang sinh viên
                </button>
              </div>
            </section>

            {/* Main layout: form + live preview */}
            <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* Left: form area */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-orange-100/80">Thông tin hiển thị</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">Thông tin cơ bản của CLB</h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Tên, tagline và mô tả sẽ xuất hiện trong danh sách CLB cũng như các chiến dịch truyền thông.
                      </p>
                    </div>
                  </div>

              <div className="mt-5 space-y-4">
                <label className="block text-sm text-slate-200">
                  Tên CLB
                  <input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                    placeholder="Ví dụ: CLB Truyền thông"
                  />
                </label>

                <label className="block text-sm text-slate-200">
                  Tagline / Câu mô tả ngắn
                  <input
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                    placeholder="Câu giới thiệu nhanh về CLB (tối đa 80 ký tự)"
                    maxLength={80}
                  />
                  <p className="mt-1 text-[0.7rem] text-slate-400">Hiển thị ở list CLB & card sự kiện.</p>
                </label>

                <label className="block text-sm text-slate-200">
                  Mô tả chi tiết
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                    rows={5}
                    placeholder="Giới thiệu sứ mệnh, hoạt động nổi bật, văn hoá và giá trị mà CLB mang lại cho sinh viên."
                    maxLength={600}
                  />
                  <div className="mt-1 flex items-center justify-between text-[0.7rem] text-slate-400">
                    <span>Nên giữ trong khoảng 3–6 câu để sinh viên dễ đọc nhanh.</span>
                    <span>~ {formData.description.length}/600 ký tự</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Goals section */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Mục tiêu trọng tâm trong năm</h3>
                  <p className="text-xs text-slate-400">
                    Chọn 3–5 mục tiêu chiến lược để hiển thị với nhà trường và trong báo cáo tổng kết.
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="rounded-2xl border border-white/15 bg-white/5 px-3 py-1.5 text-slate-100 hover:bg-white/10">
                    Nhập từ file
                  </button>
                  <button
                    onClick={handleAddGoal}
                    className="rounded-2xl bg-fuchsia-500 px-3 py-1.5 font-semibold text-white hover:bg-fuchsia-400"
                  >
                    + Thêm mục tiêu
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-100">
                {formData.goals.length === 0 ? (
                  <p className="text-center py-4 text-slate-400 text-sm">Chưa có mục tiêu nào. Nhấn "+ Thêm mục tiêu" để bắt đầu.</p>
                ) : (
                  formData.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="flex gap-3 flex-1">
                        <span className="mt-0.5 h-6 w-6 rounded-full bg-slate-900/70 text-center text-xs font-semibold text-slate-200 ring-1 ring-white/15 flex-shrink-0">
                          {index + 1}
                        </span>
                        <input
                          value={goal}
                          onChange={(e) => handleGoalChange(index, e.target.value)}
                          className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none focus:border-b border-fuchsia-300/50 pb-1"
                          placeholder="Nhập mục tiêu..."
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[0.7rem]">
                        <button
                          onClick={() => handleRemoveGoal(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: live preview card */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">Xem trước</p>
              <p className="mt-1 text-sm text-slate-200">
                Giao diện mô phỏng card CLB mà sinh viên sẽ thấy trong màn hình khám phá.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-[0_24px_80px_rgba(15,23,42,1)]">
              <div className="relative h-40 w-full overflow-hidden">
                <img src={formData.cover} alt="Club cover" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-orange-100/90">
                      {formData.category || 'Chưa phân loại'}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">{formData.name || 'Tên CLB'}</h2>
                    <p className="text-xs text-slate-200/90">{formData.tagline || 'Tagline'}</p>
                  </div>
                  <span className="rounded-full bg-black/50 px-3 py-1 text-[0.7rem] font-medium text-emerald-200 ring-1 ring-emerald-400/50">
                    Đang tuyển member
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4 text-xs text-slate-200">
                <p className="line-clamp-3 text-slate-200/90">{formData.description || 'Chưa có mô tả'}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[0.7rem] text-fuchsia-200 ring-1 ring-fuchsia-400/40">
                    {formData.stats.members} thành viên
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[0.7rem] text-amber-200 ring-1 ring-amber-400/40">
                    {formData.stats.activitiesPerMonth} hoạt động/tháng
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[0.7rem] text-emerald-200 ring-1 ring-emerald-400/40">
                    Đánh giá {formData.stats.rating}/5
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 text-[0.7rem] text-slate-400">
                    <span>#content</span>
                    <span>#event</span>
                    <span>#social</span>
                  </div>
                  <button className="rounded-full bg-white px-3 py-1 text-[0.7rem] font-semibold text-slate-900 hover:bg-white/90">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
              <p className="text-[0.7rem] font-medium text-slate-200">Trạng thái hiển thị</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleInputChange('visibility', 'public')}
                  className={`rounded-full px-3 py-1.5 text-[0.7rem] font-semibold ring-1 ${
                    formData.visibility === 'public'
                      ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/50'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10 ring-white/20'
                  }`}
                >
                  Hiển thị với tất cả sinh viên
                </button>
                <button
                  onClick={() => handleInputChange('visibility', 'internal')}
                  className={`rounded-full px-3 py-1.5 text-[0.7rem] font-semibold ring-1 ${
                    formData.visibility === 'internal'
                      ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/50'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10 ring-white/20'
                  }`}
                >
                  Ẩn với sinh viên ngoài trường
                </button>
              </div>
            </div>
          </aside>
        </section>

        {/* Contact section */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Thông tin liên hệ & kênh truyền thông</h3>
              <p className="text-xs text-slate-400">
                Cập nhật email, số điện thoại và workspace nội bộ để Ban cố vấn & sinh viên dễ dàng kết nối.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="rounded-2xl border border-white/15 bg-white/5 px-3 py-1.5 text-slate-100 hover:bg-white/10">
                Đồng bộ từ website trường
              </button>
              <button className="rounded-2xl border border-sky-400/60 bg-sky-500/10 px-3 py-1.5 font-semibold text-sky-100 hover:bg-sky-500/20">
                Gửi bản PDF giới thiệu
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-200">
              Email chính thức của CLB
              <input
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Ví dụ: clb.media@university.edu.vn"
              />
              <p className="mt-1 text-[0.7rem] text-slate-400">Dùng cho trao đổi với phòng CTSV & đối tác.</p>
            </label>

            <label className="text-sm text-slate-200">
              Số điện thoại liên hệ
              <input
                value={formData.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Số trưởng ban/ban đối ngoại"
              />
              <p className="mt-1 text-[0.7rem] text-slate-400">Hiển thị cho sinh viên sau khi đăng ký tham gia.</p>
            </label>

            <label className="text-sm text-slate-200">
              Trang Facebook / Fanpage
              <input
                value={formData.contact.facebook}
                onChange={(e) => handleInputChange('contact.facebook', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Link tới fanpage chính thức"
              />
            </label>

            <label className="text-sm text-slate-200">
              Workspace nội bộ (Notion, ClickUp...)
              <input
                value={formData.contact.workspace}
                onChange={(e) => handleInputChange('contact.workspace', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Link workspace để Ban chủ nhiệm và core-team sử dụng"
              />
            </label>
          </div>
        </section>

            {/* Action bar */}
            <section className="flex flex-col justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-200 md:flex-row md:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Thay đổi gần đây chưa được đồng bộ lên website trường.</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCloseDetail}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    handleSaveClub();
                    setShowDetailView(false);
                  }}
                  className="rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-orange-500/20 hover:bg-white/95"
                >
                  Lưu & quay lại
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderInfoPage;
