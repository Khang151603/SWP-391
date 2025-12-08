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
      subtitle="Thiết lập nhanh thông tin hiển thị"
    >
      <div className="space-y-8">
        {/* Header with Create Button */}

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
                    <h2 className="text-xl font-semibold text-white">Chỉnh sửa: {formData.name || 'CLB mới'}</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* Main layout: form only */}
            <section className="space-y-6">
              {/* Basic info */}
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-orange-100/80">Thông tin hiển thị</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Thông tin cơ bản</h2>
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
                    Mô tả chi tiết
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                      rows={4}
                      placeholder="Tóm tắt sứ mệnh, hoạt động nổi bật, văn hoá."
                      maxLength={600}
                    />
                    <div className="mt-1 flex items-center justify-end text-[0.7rem] text-slate-400">
                      <span>~ {formData.description.length}/600 ký tự</span>
                    </div>
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-slate-200">
                      Ảnh cover (link)
                      <input
                        value={formData.cover}
                        onChange={(e) => handleInputChange('cover', e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                        placeholder="URL ảnh bìa"
                      />
                    </label>
                    <label className="block text-sm text-slate-200">
                      Phân loại / lĩnh vực
                      <input
                        value={formData.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                        placeholder="Ví dụ: Truyền thông, Tình nguyện..."
                      />
                    </label>
                  </div>
                </div>
              </div>
              {/* Contact section */}
              <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Thông tin liên hệ</h3>
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
                  </label>

                  <label className="text-sm text-slate-200">
                    Số điện thoại liên hệ
                    <input
                      value={formData.contact.phone}
                      onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                      placeholder="Số trưởng ban/ban đối ngoại"
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* Action bar */}
            <section className="flex flex-col justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-200 md:flex-row md:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-400" />
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
