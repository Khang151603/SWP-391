import { useEffect, useState } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { activityService } from '../../api/services/activity.service';
import type { Activity, CreateActivityRequest } from '../../api/types/activity.types';
import { clubService } from '../../api/services/club.service';
import type { LeaderClubListItem } from '../../api/types/club.types';

function ClubLeaderActivitiesPage() {
  const [clubs, setClubs] = useState<LeaderClubListItem[]>([]);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<CreateActivityRequest>({
    clubId: 0,
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const isValid =
    !!form.clubId && !!form.title && !!form.description && !!form.startTime && !!form.endTime && !!form.location;

  const loadActivities = async (clubId: number) => {
    if (!clubId) return;
    setActivitiesLoading(true);
    try {
      const data = await activityService.getByClub(clubId);
      setActivities(data);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Không thể tải hoạt động' });
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Load clubs for dropdown
  useEffect(() => {
    const fetchClubs = async () => {
      setClubsLoading(true);
      try {
        const data = await clubService.getMyLeaderClubs();
        setClubs(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, clubId: data[0].id }));
          loadActivities(data[0].id);
        }
      } catch (err) {
        setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Không thể tải danh sách CLB' });
      } finally {
        setClubsLoading(false);
      }
    };
    fetchClubs();
  }, []);

  // Reload activities when club changes
  useEffect(() => {
    if (form.clubId) {
      loadActivities(form.clubId);
    }
  }, [form.clubId]);

  const handleChange = (field: keyof CreateActivityRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!form.clubId || !form.title || !form.description || !form.startTime || !form.endTime || !form.location) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
      return;
    }
    if (form.startTime && form.endTime && new Date(form.endTime) < new Date(form.startTime)) {
      setMessage({ type: 'error', text: 'Thời gian kết thúc phải sau thời gian bắt đầu' });
      return;
    }
    setIsLoading(true);
    try {
      await activityService.create(form);
      setMessage({ type: 'success', text: 'Tạo hoạt động thành công' });
      loadActivities(form.clubId);
      setForm({
        clubId: form.clubId,
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
      });
      setShowCreateModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Không thể tạo hoạt động' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeaderLayout
      title="Quản lý hoạt động & sự kiện"
      subtitle="Lên kế hoạch, theo dõi tiến độ và truyền thông hoạt động nội bộ trong một màn hình."
    >
      <div className="space-y-6">
        {/* Header and actions */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Hoạt động</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">Danh sách hoạt động theo CLB</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={form.clubId || ''}
              onChange={(e) => handleChange('clubId', Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
              disabled={clubsLoading || clubs.length === 0}
            >
              {clubs.length === 0 && <option value="">Không có CLB</option>}
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setMessage(null);
              }}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
              disabled={!form.clubId}
            >
              + Tạo hoạt động
            </button>
          </div>
        </section>

        {/* Activities list */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">CLB</p>
              <h3 className="text-lg font-semibold text-slate-900">
                {clubs.find((c) => c.id === form.clubId)?.name || 'Chưa chọn CLB'}
              </h3>
            </div>
            {activitiesLoading && <p className="text-xs text-slate-500">Đang tải hoạt động...</p>}
          </div>

          {message && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {activities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
              CLB chưa có hoạt động nào. Nhấn “+ Tạo hoạt động” để bắt đầu.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activities.map((act) => {
                const start = new Date(act.startTime);
                const end = new Date(act.endTime);
                const status = (act.status || 'Pending').toLowerCase();
                const statusStyle =
                  status === 'pending'
                    ? 'bg-amber-50 text-amber-700 ring-amber-200'
                    : status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : status === 'completed'
                        ? 'bg-blue-50 text-blue-700 ring-blue-200'
                        : 'bg-slate-50 text-slate-700 ring-slate-200';

                return (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{act.title}</p>
                        <p className="text-xs text-slate-600 line-clamp-2">{act.description}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyle}`}>
                        {act.status || 'Pending'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 space-y-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">Thời gian</p>
                        <p className="mt-1 text-sm text-slate-900">
                          {start.toLocaleString('vi-VN')} → {end.toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Địa điểm:</span>
                        <span className="text-slate-800">{act.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Create Activity Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Tạo hoạt động</p>
                  <h3 className="text-xl font-semibold text-slate-900 mt-1">
                    {clubs.find((c) => c.id === form.clubId)?.name || 'Chọn CLB'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setMessage(null);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>

              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="text-sm text-slate-800 md:col-span-2">
                  CLB
                  <select
                    value={form.clubId || ''}
                    onChange={(e) => handleChange('clubId', Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
                    disabled={clubsLoading || clubs.length === 0}
                  >
                    {clubs.length === 0 && <option value="">Không có CLB</option>}
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm text-slate-800">
                  Tên hoạt động
                  <input
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ví dụ: Media Camp 2025"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </label>

                <label className="text-sm text-slate-800">
                  Địa điểm
                  <input
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Ví dụ: Hội trường lớn, sân vận động trường..."
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </label>

                <label className="text-sm text-slate-800">
                  Thời gian bắt đầu
                  <input
                    type="datetime-local"
                    value={form.startTime ? form.startTime.slice(0, 16) : ''}
                    onChange={(e) => handleChange('startTime', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    required
                  />
                  <p className="mt-1 text-xs text-slate-500">Đặt sớm hơn thời gian kết thúc.</p>
                </label>

                <label className="text-sm text-slate-800">
                  Thời gian kết thúc
                  <input
                    type="datetime-local"
                    value={form.endTime ? form.endTime.slice(0, 16) : ''}
                    min={form.startTime ? form.startTime.slice(0, 16) : undefined}
                    onChange={(e) => handleChange('endTime', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </label>

                <label className="text-sm text-slate-800 md:col-span-2">
                  Nội dung chính
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Mô tả mục tiêu, nhóm đối tượng, hạng mục chuẩn bị và KPIs..."
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    rows={4}
                    required
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap items-center gap-3 text-sm">
                  <button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isLoading ? 'Đang tạo...' : 'Tạo hoạt động'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderActivitiesPage;