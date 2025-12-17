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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedEditImage, setSelectedEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Date input display states
  const [startDateDisplay, setStartDateDisplay] = useState('');
  const [endDateDisplay, setEndDateDisplay] = useState('');
  const startDatePickerRef = useRef<HTMLInputElement>(null);
  const endDatePickerRef = useRef<HTMLInputElement>(null);
  
  const isValid =
    !!form.clubId && !!form.title && !!form.description && !!form.startTime && !!form.endTime && !!form.location;

  const normalizeStatus = (status?: string) => {
    if (!status) return 'notyetopen';
    return status.toLowerCase().replace(/_/g, '');
  };

  const statusLabel: Record<string, string> = {
    notyetopen: 'Chưa mở',
    pending: 'Chưa mở',
    active: 'Đã mở đăng ký',
    ongoing: 'Đang diễn ra',
    completed: 'Đã kết thúc',
  };

  const statusStyle: Record<string, string> = {
    notyetopen: 'bg-amber-50 text-amber-700 ring-amber-200',
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    active: 'bg-blue-50 text-blue-700 ring-blue-200',
    ongoing: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    completed: 'bg-slate-50 text-slate-700 ring-slate-200',
  };
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Vui lòng chọn file ảnh' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Vui lòng chọn file ảnh' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }
      setSelectedEditImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEditImage = () => {
    setSelectedEditImage(null);
    setEditImagePreview(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
  };

  const resetCreateForm = () => {
    setForm({
      clubId: clubs.length > 0 ? clubs[0].id : 0,
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
    });
    setStartDateDisplay('');
    setEndDateDisplay('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage(null);
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
      const newActivity = await activityService.create(form);
      
      // Upload image if selected
      if (selectedImage && newActivity.id) {
        try {
          await activityService.uploadImage(newActivity.id, selectedImage);
          setMessage({ type: 'success', text: 'Tạo hoạt động và tải ảnh lên thành công' });
        } catch (error) {
          console.error('Failed to upload image:', error);
          setMessage({ type: 'error', text: 'Tạo hoạt động thành công nhưng không thể tải ảnh lên' });
        }
      } else {
        setMessage({ type: 'success', text: 'Tạo hoạt động thành công' });
      }
      
      // Reload activities to show new activity with image
      await loadActivities(form.clubId);
      
      setForm({
        clubId: form.clubId,
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create activity:', error);
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
    // Set current image preview if exists
    if (activity.imageActsUrl) {
      setEditImagePreview(activity.imageActsUrl);
    } else {
      setEditImagePreview(null);
    }
    setSelectedEditImage(null);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    
    setIsLoading(true);
    setMessage(null);
    try {
      await activityService.update(selectedActivity.id, editForm);
      
      // Upload new image if selected
      if (selectedEditImage) {
        try {
          await activityService.uploadImage(selectedActivity.id, selectedEditImage);
          setMessage({ type: 'success', text: 'Cập nhật hoạt động và ảnh thành công' });
        } catch (error) {
          console.error('Failed to upload image:', error);
          setMessage({ type: 'error', text: 'Cập nhật hoạt động thành công nhưng không thể tải ảnh lên' });
        }
      } else {
        setMessage({ type: 'success', text: 'Cập nhật hoạt động thành công' });
      }
      
      await loadActivities(form.clubId);
      setShowEditModal(false);
      setSelectedActivity(null);
      setSelectedEditImage(null);
      setEditImagePreview(null);
    } catch {
      setMessage({ type: 'error', text: 'Không thể cập nhật hoạt động. Vui lòng thử lại sau.' });
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
      await loadActivities(form.clubId);
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
      // Update with full activity info, only changing status
      await activityService.update(activity.id, {
        clubId: activity.clubId,
        title: activity.title,
        description: activity.description,
        startTime: activity.startTime,
        endTime: activity.endTime,
        location: activity.location,
        status: 'Ongoing',
      });
      setMessage({ type: 'success', text: 'Đã bắt đầu hoạt động' });
      await loadActivities(form.clubId);
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
      // Update with full activity info, only changing status
      await activityService.update(activity.id, {
        clubId: activity.clubId,
        title: activity.title,
        description: activity.description,
        startTime: activity.startTime,
        endTime: activity.endTime,
        location: activity.location,
        status: 'Completed',
      });
      setMessage({ type: 'success', text: 'Đã dừng hoạt động' });
      await loadActivities(form.clubId);
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
      <div className="space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-emerald-50 p-6 lg:p-8 shadow-sm">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%)] pointer-events-none" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Hoạt động</p>
              <h2 className="text-2xl font-semibold text-slate-900">Danh sách hoạt động theo CLB</h2>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <select
                value={form.clubId || ''}
                onChange={(e) => handleChange('clubId', Number(e.target.value))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none min-w-[220px]"
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
                  resetCreateForm();
                  setShowCreateModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
                disabled={!form.clubId}
              >
                <span>+ Tạo hoạt động</span>
              </button>
            </div>
          </div>
        </section>


        {/* Activities */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 lg:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {clubs.find((c) => c.id === form.clubId)?.name || 'Chưa chọn CLB'}
              </h3>
            </div>
            {activitiesLoading && (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                Đang tải hoạt động...
              </span>
            )}
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

          {activitiesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                <div
                  key={skeleton}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 animate-pulse"
                >
                  <div className="h-36 w-full rounded-xl bg-slate-200" />
                  <div className="h-3 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                  <div className="flex gap-2">
                    <div className="h-8 w-16 rounded-lg bg-slate-200" />
                    <div className="h-8 w-20 rounded-lg bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
              CLB chưa có hoạt động nào. Nhấn “+ Tạo hoạt động” để bắt đầu.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activities.map((act) => {
                const start = new Date(act.startTime);
                const end = new Date(act.endTime);
                const status = normalizeStatus(act.status);
                const statusVietnamese = statusLabel[status] || statusLabel.notyetopen;
                const badgeStyle = statusStyle[status] || statusStyle.notyetopen;

                return (
                  <div
                    key={act.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-blue-100"
                  >
                    <span className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${badgeStyle}`}>
                      {statusVietnamese}
                    </span>

                    {act.imageActsUrl ? (
                      <div className="overflow-hidden">
                        <img
                          src={act.imageActsUrl}
                          alt={act.title}
                          className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center bg-slate-50 text-xs text-slate-500">
                        Chưa có ảnh hoạt động
                      </div>
                    )}

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{act.title}</p>
                        <p className="text-xs text-slate-600 line-clamp-2">{act.description}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Thời gian</p>
                          <p className="text-sm text-slate-900">{start.toLocaleString('vi-VN')} → {end.toLocaleString('vi-VN')}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Địa điểm</p>
                          <p className="text-sm text-slate-900">{act.location}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                        {status !== 'completed' && (
                          <button
                            onClick={() => handleEdit(act)}
                            className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            Sửa
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
                        {(status === 'ongoing' || act.status?.toLowerCase().includes('ongoing')) && (
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
                          Xem thành viên
                        </button>
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
                    resetCreateForm();
                    setShowCreateModal(false);
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

                {/* Image Upload Section */}
                <div className="text-sm text-slate-800 md:col-span-2">
                  <label className="block mb-2">Ảnh đại diện hoạt động</label>
                  <div className="space-y-3">
                    {!imagePreview ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                      >
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-semibold text-blue-600">Nhấn để chọn ảnh</span> hoặc kéo thả vào đây
                        </p>
                        <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF tối đa 5MB</p>
                      </div>
                    ) : (
                      <div className="relative rounded-xl border border-slate-300 overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

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
                    onClick={() => {
                      resetCreateForm();
                      setShowCreateModal(false);
                    }}
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
                    setSelectedEditImage(null);
                    setEditImagePreview(null);
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

                {/* Edit Image Upload Section */}
                <div className="text-sm text-slate-800 md:col-span-2">
                  <label className="block mb-2">Ảnh đại diện hoạt động</label>
                  <div className="space-y-3">
                    {!editImagePreview ? (
                      <div 
                        onClick={() => editFileInputRef.current?.click()}
                        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                      >
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-semibold text-blue-600">Nhấn để chọn ảnh mới</span> hoặc kéo thả vào đây
                        </p>
                        <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF tối đa 5MB</p>
                      </div>
                    ) : (
                      <div className="relative rounded-xl border border-slate-300 overflow-hidden">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveEditImage}
                          className="absolute top-2 right-2 rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {!selectedEditImage && (
                          <div className="absolute bottom-2 left-2 rounded-lg bg-blue-500/90 backdrop-blur-sm px-3 py-1 text-xs text-white">
                            Ảnh hiện tại
                          </div>
                        )}
                        {selectedEditImage && (
                          <div className="absolute bottom-2 left-2 rounded-lg bg-emerald-500/90 backdrop-blur-sm px-3 py-1 text-xs text-white">
                            Ảnh mới sẽ được tải lên
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

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
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedEditImage(null);
                      setEditImagePreview(null);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
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