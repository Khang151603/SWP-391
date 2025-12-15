import { useEffect, useState, useRef } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { activityService } from '../../api/services/activity.service';
import type { Activity, CreateActivityRequest, UpdateActivityRequest, ActivityParticipant } from '../../api/types/activity.types';
import { clubService } from '../../api/services/club.service';
import type { LeaderClubListItem } from '../../api/types/club.types';

function ClubLeaderActivitiesPage() {
  const [clubs, setClubs] = useState<LeaderClubListItem[]>([]);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<ActivityParticipant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [form, setForm] = useState<CreateActivityRequest>({
    clubId: 0,
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const [editForm, setEditForm] = useState<UpdateActivityRequest>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Date input display states
  const [startDateDisplay, setStartDateDisplay] = useState('');
  const [endDateDisplay, setEndDateDisplay] = useState('');
  const startDatePickerRef = useRef<HTMLInputElement>(null);
  const endDatePickerRef = useRef<HTMLInputElement>(null);
  
  const isValid =
    !!form.clubId && !!form.title && !!form.description && !!form.startTime && !!form.endTime && !!form.location;

  // Format date to DD/MM/YYYY for display
  const formatDateToDDMMYYYY = (dateTimeString: string): string => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  // Parse DD/MM/YYYY to ISO date string (with validation)
  const parseDDMMYYYYToISO = (dateString: string): string | null => {
    if (!dateString || dateString.trim() === '') return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) return null;
    
    const date = new Date(Date.UTC(year, month, day));
    if (date.getUTCDate() !== day || date.getUTCMonth() !== month || date.getUTCFullYear() !== year) {
      return null;
    }
    
    return date.toISOString();
  };

  // Parse DD/MM/YYYY to YYYY-MM-DD format for date input
  const parseDDMMYYYYToDate = (dateString: string): string => {
    if (!dateString || dateString.trim() === '') return '';
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return '';
    if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) return '';
    
    const date = new Date(year, month, day);
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      return '';
    }
    
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const loadActivities = async (clubId: number) => {
    if (!clubId) return;
    setActivitiesLoading(true);
    try {
      const data = await activityService.getByClub(clubId);
      setActivities(data);
    } catch {
      setMessage({ type: 'error', text: 'Không thể tải danh sách hoạt động. Vui lòng thử lại sau.' });
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
      } catch {
        setMessage({ type: 'error', text: 'Không thể tải danh sách CLB. Vui lòng thử lại sau.' });
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

  const getDatePart = (value: string) => {
    if (!value) return '';
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getTimePart = (value: string) => {
    if (!value) return '';
    const d = new Date(value);
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${min}`;
  };

  const combineDateTime = (date: string, time: string) => {
    if (!date || !time) return '';
    return `${date}T${time}:00`;
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
    } catch {
      setMessage({ type: 'error', text: 'Không thể tạo hoạt động mới. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditForm({
      clubId: activity.clubId,
      title: activity.title,
      description: activity.description,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      status: activity.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    
    setIsLoading(true);
    setMessage(null);
    try {
      await activityService.update(selectedActivity.id, editForm);
      setMessage({ type: 'success', text: 'Cập nhật hoạt động thành công' });
      loadActivities(form.clubId);
      setShowEditModal(false);
      setSelectedActivity(null);
    } catch {
      setMessage({ type: 'error', text: 'Không thể cập nhật hoạt động. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedActivity) return;
    
    setIsLoading(true);
    setMessage(null);
    try {
      await activityService.delete(selectedActivity.id);
      setMessage({ type: 'success', text: 'Xóa hoạt động thành công' });
      loadActivities(form.clubId);
      setShowDeleteConfirm(false);
      setSelectedActivity(null);
    } catch {
      setMessage({ type: 'error', text: 'Không thể xóa hoạt động. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRegistration = async (activity: Activity) => {
    setIsLoading(true);
    setMessage(null);
    try {
      await activityService.openRegistration(activity.id);
      setMessage({ type: 'success', text: 'Đã mở đăng ký' });
      loadActivities(form.clubId);
    } catch {
      setMessage({ type: 'error', text: 'Không thể mở đăng ký hoạt động. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartActivity = async (activity: Activity) => {
    setIsLoading(true);
    setMessage(null);
    try {
      await activityService.update(activity.id, { status: 'Ongoing' });
      setMessage({ type: 'success', text: 'Đã bắt đầu hoạt động' });
      loadActivities(form.clubId);
    } catch {
      setMessage({ type: 'error', text: 'Không thể bắt đầu hoạt động. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopActivity = async (activity: Activity) => {
    setIsLoading(true);
    setMessage(null);
    try {
      await activityService.update(activity.id, { status: 'Completed' });
      setMessage({ type: 'success', text: 'Đã dừng hoạt động' });
      loadActivities(form.clubId);
    } catch {
      setMessage({ type: 'error', text: 'Không thể dừng hoạt động. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewParticipants = async (activity: Activity) => {
    setSelectedActivity(activity);
    setShowParticipantsModal(true);
    setParticipantsLoading(true);
    try {
      const data = await activityService.getParticipants(activity.id);
      setParticipants(data);
    } catch {
      setMessage({ type: 'error', text: 'Không thể tải danh sách người tham gia. Vui lòng thử lại sau.' });
    } finally {
      setParticipantsLoading(false);
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
                const status = (act.status || 'Not_yet_open').toLowerCase().replace(/_/g, '');
                
                // Map status to Vietnamese
                const statusVietnamese = 
                  status === 'notyetopen' ? 'Chưa mở' :
                  status === 'pending' ? 'Chưa mở' :
                  status === 'active' ? 'Đã mở ĐK' :
                  status === 'ongoing' ? 'Đang diễn ra' :
                  status === 'completed' ? 'Đã dừng' : act.status || 'Chưa mở';
                
                const statusStyle =
                  status === 'notyetopen' || status === 'pending'
                    ? 'bg-amber-50 text-amber-700 ring-amber-200'
                    : status === 'active'
                      ? 'bg-blue-50 text-blue-700 ring-blue-200'
                      : status === 'ongoing'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : status === 'completed'
                          ? 'bg-slate-50 text-slate-700 ring-slate-200'
                          : 'bg-slate-50 text-slate-700 ring-slate-200';

                return (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{act.title}</p>
                        <p className="text-xs text-slate-600 line-clamp-2">{act.description}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyle}`}>
                        {statusVietnamese}
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
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      {status !== 'completed' && (
                        <button
                          onClick={() => handleEdit(act)}
                          className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Sửa
                        </button>
                      )}
                      {status === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedActivity(act);
                            setShowDeleteConfirm(true);
                          }}
                          className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Xóa
                        </button>
                      )}
                      {(status === 'pending' || status === 'notyetopen') && (
                        <button
                          onClick={() => handleOpenRegistration(act)}
                          className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Mở đăng ký
                        </button>
                      )}
                      {status === 'active' && (
                        <button
                          onClick={() => handleStartActivity(act)}
                          className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Bắt đầu
                        </button>
                      )}
                      {status === 'ongoing' && (
                        <button
                          onClick={() => handleStopActivity(act)}
                          className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Dừng
                        </button>
                      )}
                      <button
                        onClick={() => handleViewParticipants(act)}
                        className="rounded-lg bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                      >
                        Participants
                      </button>
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
                  <div className="mt-2 grid grid-cols-[1.3fr_1fr] gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={startDateDisplay}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/[^\d/]/g, '');
                          const digits = inputValue.replace(/\//g, '');
                          
                          let formatted = inputValue;
                          if (!inputValue.includes('/')) {
                            if (digits.length >= 3) {
                              formatted = digits.slice(0, 2) + '/' + digits.slice(2);
                            }
                            if (digits.length >= 5) {
                              formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
                            }
                          }
                          
                          formatted = formatted.slice(0, 10);
                          setStartDateDisplay(formatted);
                          
                          const datePart = parseDDMMYYYYToDate(formatted);
                          if (datePart) {
                            const timePart = getTimePart(form.startTime) || '00:00';
                            handleChange('startTime', combineDateTime(datePart, timePart));
                          }
                        }}
                        placeholder="dd/mm/yyyy"
                        maxLength={10}
                        className="w-full rounded-xl border border-slate-300 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                        required
                      />
                      <input
                        ref={startDatePickerRef}
                        type="date"
                        value={getDatePart(form.startTime)}
                        className="absolute opacity-0 pointer-events-none w-0 h-0"
                        onChange={(e) => {
                          if (e.target.value) {
                            const [year, month, day] = e.target.value.split('-').map(Number);
                            setStartDateDisplay(`${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`);
                            const timePart = getTimePart(form.startTime) || '00:00';
                            handleChange('startTime', combineDateTime(e.target.value, timePart));
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => startDatePickerRef.current?.showPicker?.()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70"
                        tabIndex={-1}
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <input
                      lang="vi-VN"
                      type="time"
                      value={getTimePart(form.startTime)}
                      onChange={(e) => {
                        const timePart = e.target.value;
                        const datePart = getDatePart(form.startTime);
                        handleChange('startTime', combineDateTime(datePart, timePart));
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">dd/mm/yyyy giờ:phút (giờ VN).</p>
                </label>

                <label className="text-sm text-slate-800">
                  Thời gian kết thúc
                  <div className="mt-2 grid grid-cols-[1.3fr_1fr] gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={endDateDisplay}
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^\d]/g, '');
                          if (value.length > 8) value = value.slice(0, 8);

                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2);
                          }
                          if (value.length >= 5) {
                            value = value.slice(0, 5) + '/' + value.slice(5);
                          }

                          setEndDateDisplay(value);

                          if (value.length === 10) {
                            const isoDate = parseDDMMYYYYToISO(value);
                            if (isoDate) {
                              const timePart = getTimePart(form.endTime) || '00:00';
                              const datePartFormatted = parseDDMMYYYYToDate(value);
                              if (datePartFormatted) {
                                handleChange('endTime', combineDateTime(datePartFormatted, timePart));
                              }
                            }
                          }
                        }}
                        onBlur={() => {
                          if (form.endTime) {
                            const dateObj = new Date(form.endTime);
                            if (!isNaN(dateObj.getTime())) {
                              setEndDateDisplay(formatDateToDDMMYYYY(dateObj.toISOString()));
                            }
                          }
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                        required
                      />
                      <input
                        ref={endDatePickerRef}
                        type="date"
                        value={form.endTime ? parseDDMMYYYYToDate(formatDateToDDMMYYYY(form.endTime)) || '' : ''}
                        min={form.startTime ? parseDDMMYYYYToDate(formatDateToDDMMYYYY(form.startTime)) || undefined : undefined}
                        onChange={(e) => {
                          const datePart = e.target.value;
                          if (datePart) {
                            const [year, month, day] = datePart.split('-').map(Number);
                            const utcDate = new Date(Date.UTC(year, month - 1, day));
                            const formatted = formatDateToDDMMYYYY(utcDate.toISOString());
                            setEndDateDisplay(formatted);
                            const timePart = getTimePart(form.endTime) || '00:00';
                            handleChange('endTime', combineDateTime(datePart, timePart));
                          }
                        }}
                        className="absolute inset-0 opacity-0 pointer-events-none"
                      />
                      <button
                        type="button"
                        onClick={() => endDatePickerRef.current?.showPicker()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                      </button>
                    </div>
                    <input
                      lang="vi-VN"
                      type="time"
                      value={getTimePart(form.endTime)}
                      onChange={(e) => {
                        const timePart = e.target.value;
                        const datePart = getDatePart(form.endTime);
                        handleChange('endTime', combineDateTime(datePart, timePart));
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">dd/mm/yyyy giờ:phút (giờ VN).</p>
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

        {/* Edit Activity Modal */}
        {showEditModal && selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Chỉnh sửa hoạt động</p>
                  <h3 className="text-xl font-semibold text-slate-900 mt-1">{selectedActivity.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedActivity(null);
                    setMessage(null);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>

              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleUpdateSubmit}>
                <label className="text-sm text-slate-800">
                  Tên hoạt động
                  <input
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Ví dụ: Media Camp 2025"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                  />
                </label>

                <label className="text-sm text-slate-800">
                  Địa điểm
                  <input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Ví dụ: Hội trường lớn"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                  />
                </label>

                <label className="text-sm text-slate-800">
                  Thời gian bắt đầu
                  <div className="mt-2 grid grid-cols-[1.3fr_1fr] gap-2">
                    <input
                      type="date"
                      value={getDatePart(editForm.startTime || '')}
                      onChange={(e) => {
                        const datePart = e.target.value;
                        const timePart = getTimePart(editForm.startTime || '') || '00:00';
                        setEditForm({ ...editForm, startTime: combineDateTime(datePart, timePart) });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900"
                    />
                    <input
                      type="time"
                      value={getTimePart(editForm.startTime || '')}
                      onChange={(e) => {
                        const timePart = e.target.value;
                        const datePart = getDatePart(editForm.startTime || '');
                        setEditForm({ ...editForm, startTime: combineDateTime(datePart, timePart) });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </label>

                <label className="text-sm text-slate-800">
                  Thời gian kết thúc
                  <div className="mt-2 grid grid-cols-[1.3fr_1fr] gap-2">
                    <input
                      type="date"
                      value={getDatePart(editForm.endTime || '')}
                      onChange={(e) => {
                        const datePart = e.target.value;
                        const timePart = getTimePart(editForm.endTime || '') || '00:00';
                        setEditForm({ ...editForm, endTime: combineDateTime(datePart, timePart) });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900"
                    />
                    <input
                      type="time"
                      value={getTimePart(editForm.endTime || '')}
                      onChange={(e) => {
                        const timePart = e.target.value;
                        const datePart = getDatePart(editForm.endTime || '');
                        setEditForm({ ...editForm, endTime: combineDateTime(datePart, timePart) });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </label>

                <label className="text-sm text-slate-800 md:col-span-2">
                  Nội dung chính
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Mô tả hoạt động..."
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    rows={4}
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap items-center gap-3 text-sm">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Xác nhận xóa hoạt động</h3>
              <p className="text-sm text-slate-600 mb-6">
                Bạn có chắc chắn muốn xóa hoạt động "{selectedActivity.title}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedActivity(null);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Đang xóa...' : 'Xóa hoạt động'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants Modal */}
        {showParticipantsModal && selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Danh sách đăng ký</p>
                  <h3 className="text-xl font-semibold text-slate-900 mt-1">{selectedActivity.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setShowParticipantsModal(false);
                    setSelectedActivity(null);
                    setParticipants([]);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>

              {participantsLoading ? (
                <div className="py-12 text-center">
                  <p className="text-slate-500">Đang tải danh sách...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-500">Chưa có người đăng ký</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Họ tên</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Số điện thoại</th>
                        <th className="px-4 py-3">Thời gian ĐK</th>
                        <th className="px-4 py-3 text-center">Tham dự</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p) => (
                        <tr key={p.id} className="border-t border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{p.fullName}</td>
                          <td className="px-4 py-3 text-slate-700">{p.email}</td>
                          <td className="px-4 py-3 text-slate-700">{p.phone || '--'}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {new Date(p.registerTime).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {p.attended ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                                Đã tham dự
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                                Chưa tham dự
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderActivitiesPage;