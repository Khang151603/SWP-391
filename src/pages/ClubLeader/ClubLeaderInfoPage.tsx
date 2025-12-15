import { useState, useEffect, useMemo, useRef } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { clubService } from '../../api/services/club.service';
import type {
  CreateLeaderClubRequest,
  LeaderClubListItem,
  UpdateLeaderClubRequest,
} from '../../api/types/club.types';

type ClubProfile = {
  id: string;
  name: string;
  description: string;
  establishedDate: string;
  imageClubsUrl: string | null;
  avatarPublicId: string | null;
  membershipFee: number;
  status: string;
  memberCount: number | null;
  totalRevenue: number | null;
};

type ExtendedLeaderClubListItem = LeaderClubListItem & {
  avatarPublicId?: string | null;
  memberCount?: number | null;
  totalRevenue?: number | null;
};

function ClubLeaderInfoPage() {
  const [clubs, setClubs] = useState<ClubProfile[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: clubs.length,
      active: clubs.filter((c) => c.status?.toLowerCase() === 'active').length,
      feeAvg:
        clubs.length === 0
          ? 0
          : Math.round(clubs.reduce((sum, c) => sum + (c.membershipFee || 0), 0) / clubs.length),
    }),
    [clubs]
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  // Load clubs of current leader on mount
  useEffect(() => {
    const loadClubs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const myClubs = await clubService.getMyLeaderClubs();
        const mapped: ClubProfile[] = myClubs.map((club: ExtendedLeaderClubListItem) => ({
          id: String(club.id),
          name: club.name,
          description: club.description,
          establishedDate: club.establishedDate,
          imageClubsUrl: club.imageClubsUrl,
          avatarPublicId: club.avatarPublicId || null,
          membershipFee: club.membershipFee,
          status: club.status,
          memberCount: club.memberCount ?? null,
          totalRevenue: club.totalRevenue ?? null,
        }));
        setClubs(mapped);
        if (mapped.length > 0) {
          setSelectedClubId(mapped[0].id);
          setFormData(mapped[0]);
        }
      } catch {
        setError('Không thể tải danh sách CLB. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadClubs();
  }, []);
  
  // Form data for creating new club
  const [createFormData, setCreateFormData] = useState<CreateLeaderClubRequest>({
    name: '',
    description: '',
    establishedDate: new Date().toISOString(),
    imageClubsUrl: '',
    membershipFee: undefined,
  });

  const selectedClub = useMemo(
    () => clubs.find((club) => club.id === selectedClubId) || null,
    [clubs, selectedClubId]
  );
  
  const [formData, setFormData] = useState<ClubProfile | null>(selectedClub);

  // Update form data when selected club changes
  useEffect(() => {
    const club = clubs.find((c) => c.id === selectedClubId);
    if (club) {
      setFormData({ ...club });
    } else {
      setFormData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClubId]);

  const handleInputChange = (field: keyof ClubProfile, value: string | number | null) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value ?? '' } : prev));
  };

  const handleDeleteClub = async () => {
    if (!selectedClubId) return;
    setIsLoading(true);
    setError(null);
    try {
      await clubService.deleteLeaderClub(Number(selectedClubId));
      setClubs((prev) => prev.filter((club) => club.id !== selectedClubId));
      const remainingClubs = clubs.filter((club) => club.id !== selectedClubId);
      if (remainingClubs.length > 0) {
        setSelectedClubId(remainingClubs[0].id);
        setFormData(remainingClubs[0]);
      } else {
        setSelectedClubId('');
        setFormData(null);
      }
    } catch {
      setError('Không thể xóa CLB. Vui lòng thử lại sau.');
    } finally {
      setShowDeleteConfirm(false);
      setIsLoading(false);
    }
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
  };

  const handleUpdateClub = async () => {
    if (!formData) return;
    if (!formData.name || !formData.description) {
      setError('Tên và mô tả CLB là bắt buộc');
      return;
    }

    const payload: UpdateLeaderClubRequest = {
      name: formData.name,
      description: formData.description,
      establishedDate: formData.establishedDate,
      imageClubsUrl: formData.imageClubsUrl || '',
      membershipFee: formData.membershipFee,
      status: (formData.status as UpdateLeaderClubRequest['status']) || 'Active',
    };

    setIsLoading(true);
    setError(null);
    try {
      await clubService.updateLeaderClub(Number(formData.id), payload);
      
      // API only returns "Updated" string, so use formData as the source of truth
      const updatedProfile: ClubProfile = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        establishedDate: formData.establishedDate,
        imageClubsUrl: formData.imageClubsUrl,
        avatarPublicId: formData.avatarPublicId,
        membershipFee: formData.membershipFee,
        status: formData.status,
        memberCount: formData.memberCount,
        totalRevenue: formData.totalRevenue,
      };
      
      // Update clubs list
      setClubs((prev) => prev.map((club) => (club.id === updatedProfile.id ? updatedProfile : club)));
      
      setFormData(updatedProfile);
      setShowDetailView(false);
      
      // Show success message
      setSuccessMessage('Cập nhật thông tin CLB thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('=== UPDATE FAILED ===');
      console.error('Error details:', err);
      setError('Không thể cập nhật thông tin CLB. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClub = async () => {
    if (!createFormData.name || !createFormData.description) {
      setError('Vui lòng điền đầy đủ tên và mô tả CLB');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure membershipFee is a number (0 if undefined)
      const payload: CreateLeaderClubRequest = {
        ...createFormData,
        membershipFee: createFormData.membershipFee ?? 0,
      };
      const newClub = await clubService.createLeaderClub(payload);
      
      // Convert API response to ClubProfile format
      const extendedClub = newClub as ExtendedLeaderClubListItem;
      const clubProfile: ClubProfile = {
        id: String(newClub.id),
        name: newClub.name,
        description: newClub.description,
        establishedDate: newClub.establishedDate,
        imageClubsUrl: newClub.imageClubsUrl,
        avatarPublicId: extendedClub.avatarPublicId || null,
        membershipFee: newClub.membershipFee,
        status: newClub.status || 'active',
        memberCount: extendedClub.memberCount ?? null,
        totalRevenue: extendedClub.totalRevenue ?? null,
      };

      setClubs((prev) => [...prev, clubProfile]);
      setSelectedClubId(clubProfile.id);
      setFormData(clubProfile);
      setShowCreateForm(false);
      
      // Reset form
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setCreateFormData({
        name: '',
        description: '',
        establishedDate: today.toISOString(),
        imageClubsUrl: '',
        membershipFee: 0,
      });
      setDateInputValue(formatDateToDDMMYYYY(today.toISOString()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo CLB');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFormChange = (field: keyof CreateLeaderClubRequest, value: string | number | undefined) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadImage = async () => {
    if (!selectedImageFile || !formData) return;
    
    setIsUploadingImage(true);
    setError(null);
    
    try {
      const result = await clubService.uploadClubImage(formData.id, selectedImageFile);
      
      // Update formData and clubs state with new image URL
      const updatedFormData = { ...formData, imageClubsUrl: result.imageUrl };
      setFormData(updatedFormData);
      setClubs((prev) => prev.map((club) => (club.id === formData.id ? updatedFormData : club)));
      
      // Clear selected file after successful upload
      setSelectedImageFile(null);
      
      // Show success message briefly
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể upload ảnh');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh (jpg, png, gif, ...)');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setSelectedImageFile(file);
      setError(null);
    }
  };

  // State for date input display value (DD/MM/YYYY format)
  const [dateInputValue, setDateInputValue] = useState<string>('');
  const [editDateInputValue, setEditDateInputValue] = useState<string>('');
  // Ref for hidden date picker
  const datePickerRef = useRef<HTMLInputElement>(null);
  const editDatePickerRef = useRef<HTMLInputElement>(null);

  // Format date to DD/MM/YYYY
  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      // Use UTC to avoid timezone issues
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  // Parse DD/MM/YYYY to ISO string
  const parseDDMMYYYYToISO = (dateString: string): string | null => {
    if (!dateString || dateString.trim() === '') return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) return null;
    
    // Use UTC to avoid timezone issues
    const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    
    // Validate date
    if (date.getUTCDate() !== day || date.getUTCMonth() !== month || date.getUTCFullYear() !== year) {
      return null; // Invalid date
    }
    
    return date.toISOString();
  };

  // Initialize date input value when form opens
  useEffect(() => {
    if (showCreateForm) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setDateInputValue(formatDateToDDMMYYYY(today.toISOString()));
    } else {
      setDateInputValue('');
    }
  }, [showCreateForm]);

  // Initialize edit date input value when detail view opens
  useEffect(() => {
    if (showDetailView && formData?.establishedDate) {
      setEditDateInputValue(formatDateToDDMMYYYY(formData.establishedDate));
    } else {
      setEditDateInputValue('');
    }
  }, [showDetailView, formData?.establishedDate]);
  return (
    <LeaderLayout
      title="Quản lý hồ sơ CLB"
      subtitle="Thiết lập nhanh thông tin hiển thị"
    >
      {/* Success Toast Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="flex-1 text-sm font-medium">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="flex-shrink-0 hover:bg-green-600 rounded p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">{/* Header with Create Button and quick stats */}
        {/* Header with Create Button and quick stats */}
        {!showDetailView && !showCreateForm && (
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tổng quan</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">CLB của bạn</h2>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              + Tạo CLB mới
            </button>
          </section>
        )}

        {!showDetailView && !showCreateForm && (
          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Tổng CLB</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Đang hoạt động</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{stats.active}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Phí TB</p>
              <p className="mt-2 text-2xl font-semibold text-blue-700">{formatCurrency(stats.feeAvg)}</p>
            </div>
          </section>
        )}

        {/* Create Club Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Tạo CLB</p>
                  <h2 className="text-xl font-semibold text-slate-900 mt-1">Thông tin cơ bản</h2>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setError(null);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    setCreateFormData({
                      name: '',
                      description: '',
                      establishedDate: today.toISOString(),
                      imageClubsUrl: '',
                      membershipFee: 0,
                    });
                    setDateInputValue(formatDateToDDMMYYYY(today.toISOString()));
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                <label className="block text-sm text-slate-800">
                  Tên CLB <span className="text-red-500">*</span>
                  <input
                    value={createFormData.name}
                    onChange={(e) => handleCreateFormChange('name', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    placeholder="Ví dụ: CLB Truyền thông"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-800">
                  Mô tả <span className="text-red-500">*</span>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => handleCreateFormChange('description', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    rows={4}
                    placeholder="Mô tả về CLB, sứ mệnh, hoạt động..."
                    required
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-slate-800">
                    URL ảnh CLB
                    <input
                      value={createFormData.imageClubsUrl}
                      onChange={(e) => handleCreateFormChange('imageClubsUrl', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </label>

                  <label className="block text-sm text-slate-800">
                    Phí thành viên (VNĐ)
                    <input
                      type="number"
                      value={createFormData.membershipFee ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        handleCreateFormChange('membershipFee', value);
                      }}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                      placeholder="Nhập phí thành viên"
                      min="0"
                    />
                  </label>
                </div>

                <label className="block text-sm text-slate-800">
                  Ngày thành lập
                  <div className="mt-2 relative">
                    <input
                      type="text"
                      value={dateInputValue}
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        // Remove all non-digit characters except slash
                        inputValue = inputValue.replace(/[^\d/]/g, '');
                        
                        // Auto-format as user types: DD/MM/YYYY
                        let formatted = inputValue;
                        if (inputValue.length > 2 && !inputValue.includes('/')) {
                          formatted = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
                        }
                        if (formatted.length > 5 && formatted.split('/').length === 2) {
                          formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
                        }
                        // Limit to 10 characters (DD/MM/YYYY)
                        formatted = formatted.slice(0, 10);
                        
                        setDateInputValue(formatted);
                        
                        // Try to parse and update ISO date if valid
                        const isoDate = parseDDMMYYYYToISO(formatted);
                        if (isoDate) {
                          const date = new Date(isoDate);
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          if (date <= today) {
                            handleCreateFormChange('establishedDate', isoDate);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const inputValue = e.target.value.trim();
                        if (inputValue === '') {
                          // If empty, set to today
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const todayFormatted = formatDateToDDMMYYYY(today.toISOString());
                          setDateInputValue(todayFormatted);
                          handleCreateFormChange('establishedDate', today.toISOString());
                          return;
                        }
                        
                        const isoDate = parseDDMMYYYYToISO(inputValue);
                        if (isoDate) {
                          const date = new Date(isoDate);
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          if (date <= today) {
                            handleCreateFormChange('establishedDate', isoDate);
                          } else {
                            // Future date, reset to today
                            const todayFormatted = formatDateToDDMMYYYY(today.toISOString());
                            setDateInputValue(todayFormatted);
                            today.setHours(0, 0, 0, 0);
                            handleCreateFormChange('establishedDate', today.toISOString());
                          }
                        } else {
                          // Invalid date, reset to current date
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const todayFormatted = formatDateToDDMMYYYY(today.toISOString());
                          setDateInputValue(todayFormatted);
                          handleCreateFormChange('establishedDate', today.toISOString());
                        }
                      }}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-4 pr-12 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    {/* Hidden date picker */}
                    <input
                      ref={datePickerRef}
                      type="date"
                      value={
                        createFormData.establishedDate
                          ? new Date(createFormData.establishedDate).toISOString().split('T')[0]
                          : ''
                      }
                      className="absolute opacity-0 pointer-events-none w-0 h-0"
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        if (e.target.value) {
                          // e.target.value is in YYYY-MM-DD format
                          const [year, month, day] = e.target.value.split('-').map(Number);
                          const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
                          const formatted = formatDateToDDMMYYYY(date.toISOString());
                          setDateInputValue(formatted);
                          handleCreateFormChange('establishedDate', date.toISOString());
                        }
                      }}
                    />
                    {/* Calendar icon on the right - clickable */}
                    <button
                      type="button"
                      onClick={() => {
                        datePickerRef.current?.showPicker?.();
                        // Fallback for browsers that don't support showPicker
                        if (!datePickerRef.current?.showPicker) {
                          datePickerRef.current?.click();
                        }
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity"
                      tabIndex={-1}
                    >
                      <svg
                        className="w-5 h-5 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Nhập ngày thành lập theo định dạng DD/MM/YYYY hoặc click vào icon lịch để chọn ngày (không thể chọn ngày trong tương lai)
                  </p>
                </label>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setError(null);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateClub}
                    disabled={isLoading}
                    className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang tạo...' : 'Tạo CLB'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clubs Table */}
        {!showDetailView && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Danh sách CLB</h3>
              <p className="text-xs text-slate-600">Nhấn "Chi tiết" để xem thông tin</p>
            </div>

            {clubs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-sm">Chưa có CLB nào. Hãy tạo CLB mới để bắt đầu.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 hover:border-blue-200 transition"
                  >
                    {club.imageClubsUrl && (
                      <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200">
                        <img
                          src={club.imageClubsUrl}
                          alt={club.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{club.name}</p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{club.description || 'Chưa có mô tả'}</p>
                      </div>
                      {(() => {
                        const statusLower = (club.status || 'active').toLowerCase();
                        const isActive = statusLower === 'active';
                        return (
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${
                            isActive 
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' 
                              : 'bg-red-50 text-red-700 ring-red-200'
                          }`}>
                            {club.status || 'active'}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">Ngày thành lập</p>
                        <p className="mt-1 text-sm text-slate-900">
                          {club.establishedDate ? new Date(club.establishedDate).toLocaleDateString('vi-VN') : '--'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">Phí thành viên</p>
                        <p className="mt-1 text-sm text-slate-900">{club.membershipFee.toLocaleString('vi-VN')} đ</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">Số thành viên</p>
                        <p className="mt-1 text-sm text-slate-900">{club.memberCount ?? '--'}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">Tổng doanh thu</p>
                        <p className="mt-1 text-sm text-slate-900">
                          {club.totalRevenue !== null ? formatCurrency(club.totalRevenue) : '--'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => handleViewDetail(club.id)}
                        className="rounded-xl bg-blue-50 border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Chi tiết
                      </button>
                      {clubs.length > 1 && (
                        <button
                          onClick={() => {
                            setSelectedClubId(club.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Xác nhận xóa CLB</h3>
              <p className="text-sm text-slate-600 mb-6">
                Bạn có chắc chắn muốn xóa CLB "{selectedClub.name}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteClub}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Xóa CLB
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail View: form + live preview */}
        {showDetailView && formData && (
          <>
            {/* Back Button Header */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCloseDetail}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    ← Quay lại danh sách
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Chỉnh sửa: {formData.name || 'CLB mới'}</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* Main layout: form editable */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="grid gap-4 md:grid-cols-1">
                  <label className="block text-sm text-slate-800">
                    Tên CLB <span className="text-red-500">*</span>
                    <input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Ví dụ: CLB Truyền thông"
                    />
                  </label>
                </div>

                <label className="block text-sm text-slate-800">
                  Mô tả
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={4}
                    placeholder="Tóm tắt sứ mệnh, hoạt động nổi bật, văn hoá."
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="block text-sm text-slate-800 md:col-span-2 space-y-3">
                    <label>
                      Ảnh CLB (URL)
                      <input
                        value={formData.imageClubsUrl || ''}
                        onChange={(e) => handleInputChange('imageClubsUrl', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="https://example.com/image.jpg"
                      />
                    </label>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">Hoặc upload ảnh từ máy tính</p>
                      <div className="flex items-center gap-3">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                            id="club-image-upload"
                          />
                          <label
                            htmlFor="club-image-upload"
                            className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {selectedImageFile ? selectedImageFile.name : 'Chọn ảnh'}
                          </label>
                        </label>
                        {selectedImageFile && (
                          <button
                            onClick={handleUploadImage}
                            disabled={isUploadingImage}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploadingImage ? 'Đang upload...' : 'Upload'}
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Chấp nhận file ảnh (jpg, png, gif, ...), tối đa 5MB</p>
                    </div>

                    {formData.imageClubsUrl ? (
                      <img
                        src={formData.imageClubsUrl}
                        alt={formData.name}
                        className="mt-3 h-56 w-full rounded-xl object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">Chưa có ảnh</p>
                    )}
                  </div>

                  <label className="block text-sm text-slate-800">
                    Phí thành viên
                    <input
                      type="number"
                      value={formData.membershipFee}
                      onChange={(e) => handleInputChange('membershipFee', Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      min="0"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-slate-800">
                    Avatar Public ID
                    <input
                      value={formData.avatarPublicId || ''}
                      onChange={(e) => handleInputChange('avatarPublicId', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="studentclub/xxx"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-slate-500">ID công khai của ảnh đại diện (chỉ đọc)</p>
                  </label>

                  <label className="block text-sm text-slate-800">
                    Số thành viên
                    <input
                      type="number"
                      value={formData.memberCount ?? ''}
                      onChange={(e) => handleInputChange('memberCount', e.target.value === '' ? null : Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="0"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-slate-500">Tổng số thành viên hiện tại (chỉ đọc)</p>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-slate-800">
                    Tổng doanh thu
                    <input
                      type="number"
                      value={formData.totalRevenue ?? ''}
                      onChange={(e) => handleInputChange('totalRevenue', e.target.value === '' ? null : Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="0"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-slate-500">Tổng doanh thu từ phí thành viên (chỉ đọc)</p>
                  </label>

                  <label className="block text-sm text-slate-800">
                    Trạng thái
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm text-slate-800">
                  Ngày thành lập
                  <div className="mt-2 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={editDateInputValue}
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        // Remove all non-digit characters except slash
                        inputValue = inputValue.replace(/[^\d/]/g, '');
                        
                        // Count digits only (not slashes)
                        const digits = inputValue.replace(/\//g, '');
                        
                        // Auto-format as user types: DD/MM/YYYY
                        let formatted = inputValue;
                        
                        // Only auto-add slashes if user hasn't typed them
                        if (!inputValue.includes('/')) {
                          if (digits.length >= 3) {
                            // Add first slash after day
                            formatted = digits.slice(0, 2) + '/' + digits.slice(2);
                          }
                          if (digits.length >= 5) {
                            // Add second slash after month
                            formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
                          }
                        } else {
                          // User has typed slashes, just ensure correct positions
                          const parts = inputValue.split('/');
                          if (parts.length === 2 && parts[1].length >= 3) {
                            formatted = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2);
                          }
                        }
                        
                        // Limit to 10 characters (DD/MM/YYYY)
                        formatted = formatted.slice(0, 10);
                        
                        setEditDateInputValue(formatted);
                        
                        // Try to parse and update ISO date if valid
                        const isoDate = parseDDMMYYYYToISO(formatted);
                        
                        if (isoDate) {
                          const date = new Date(isoDate);
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          
                          if (date <= today) {
                            handleInputChange('establishedDate', isoDate);
                          }
                        }
                      }}
                      onBlur={() => {
                        // Validate on blur
                        const isoDate = parseDDMMYYYYToISO(editDateInputValue);
                        if (!isoDate && editDateInputValue.trim() !== '') {
                          // Invalid date - reset to current value
                          if (formData.establishedDate) {
                            setEditDateInputValue(formatDateToDDMMYYYY(formData.establishedDate));
                          }
                        } else if (isoDate) {
                          const date = new Date(isoDate);
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          if (date > today) {
                            // Future date - set to today
                            const todayFormatted = formatDateToDDMMYYYY(today.toISOString());
                            setEditDateInputValue(todayFormatted);
                            handleInputChange('establishedDate', today.toISOString());
                          }
                        }
                      }}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-12 pr-12 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    {/* Hidden date picker */}
                    <input
                      ref={editDatePickerRef}
                      type="date"
                      value={
                        formData.establishedDate
                          ? new Date(formData.establishedDate).toISOString().split('T')[0]
                          : ''
                      }
                      className="absolute opacity-0 pointer-events-none w-0 h-0"
                      max={(() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      })()}
                      onChange={(e) => {
                        if (e.target.value) {
                          // e.target.value is in YYYY-MM-DD format
                          const [year, month, day] = e.target.value.split('-').map(Number);
                          const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
                          const formatted = formatDateToDDMMYYYY(date.toISOString());
                          setEditDateInputValue(formatted);
                          handleInputChange('establishedDate', date.toISOString());
                        }
                      }}
                    />
                    {/* Calendar icon on the right - clickable */}
                    <button
                      type="button"
                      onClick={() => {
                        editDatePickerRef.current?.showPicker?.();
                        // Fallback for browsers that don't support showPicker
                        if (!editDatePickerRef.current?.showPicker) {
                          editDatePickerRef.current?.click();
                        }
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer z-10"
                      aria-label="Chọn ngày từ lịch"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </label>
              </div>
            </section>

            {/* Action bar */}
            <section className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 text-sm md:flex-row md:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-500" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setSelectedClubId(formData.id);
                  }}
                  className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                  disabled={isLoading}
                >
                  Xóa
                </button>
                <button
                  onClick={handleCloseDetail}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  disabled={isLoading}
                >
                  Đóng
                </button>
                <button
                  onClick={handleUpdateClub}
                  disabled={isLoading}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
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
