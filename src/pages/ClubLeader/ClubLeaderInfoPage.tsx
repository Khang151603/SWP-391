import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { clubService } from '../../api/services/club.service';
import { membershipService } from '../../api/services/membership.service';
import type {
  CreateLeaderClubRequest,
  LeaderClubListItem,
} from '../../api/types/club.types';
import { showSuccessToast } from '../../utils/toast';
import { cn } from '../../components/utils/cn';

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
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  activityFrequency?: string | null;
};

type ExtendedLeaderClubListItem = LeaderClubListItem & {
  avatarPublicId?: string | null;
  memberCount?: number | null;
  totalRevenue?: number | null;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  activityFrequency?: string | null;
};

function ClubLeaderInfoPage() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<ClubProfile[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusLabel = (status: string | null | undefined): string => {
    if (!status) return 'Đang hoạt động';
    const statusLower = status.toLowerCase();
    if (statusLower === 'active') return 'Đang hoạt động';
    if (statusLower === 'unactive' || statusLower === 'inactive') return 'Bị khoá';
    return status; // Giữ nguyên nếu không match
  };

  // Load clubs of current leader on mount
  useEffect(() => {
    const loadClubs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const myClubs = await clubService.getMyLeaderClubs();
        
        // Fetch member count for each club
        const clubsWithData = await Promise.all(
          myClubs.map(async (club: ExtendedLeaderClubListItem) => {
            let memberCount = 0;
            let totalRevenue = 0;
            
            try {
              // Get members for this club
              const members = await membershipService.getLeaderClubMembers(club.id);
              
              // Count only active members (those who have paid)
              memberCount = members.filter(m => 
                m.member.status?.toLowerCase() === 'active'
              ).length;
              
              // Calculate total revenue (membershipFee * active members)
              totalRevenue = (club.membershipFee || 0) * memberCount;
            } catch (error) {
              // Failed to fetch data for club
            }
            
            return {
              id: String(club.id),
              name: club.name,
              description: club.description,
              establishedDate: club.establishedDate,
              imageClubsUrl: club.imageClubsUrl,
              avatarPublicId: club.avatarPublicId || null,
              membershipFee: club.membershipFee,
              status: club.status,
              memberCount,
              totalRevenue,
              location: club.location || null,
              contactEmail: club.contactEmail || null,
              contactPhone: club.contactPhone || null,
              activityFrequency: club.activityFrequency || null,
            };
          })
        );
        
        setClubs(clubsWithData);
      } catch {
        const message = 'Không thể tải danh sách CLB. Vui lòng thử lại sau.';
        setError(message);
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
    location: '',
    contactEmail: '',
    contactPhone: '',
    activityFrequency: '',
  });

  const handleViewDetail = (clubId: string) => {
    navigate(`/leader/club-info/${clubId}`);
  };

  const handleCreateClub = async () => {
    if (!createFormData.name || !createFormData.description) {
      const message = 'Vui lòng điền đầy đủ tên và mô tả CLB';
      setError(message);
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
        location: createFormData.location || null,
        contactEmail: createFormData.contactEmail || null,
        contactPhone: createFormData.contactPhone || null,
        activityFrequency: createFormData.activityFrequency || null,
      };

      setClubs((prev) => [...prev, clubProfile]);
      setShowCreateForm(false);
      showSuccessToast('Tạo CLB mới thành công!');
      // Navigate to detail page
      navigate(`/leader/club-info/${clubProfile.id}`);
      
      // Reset form
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setCreateFormData({
        name: '',
        description: '',
        establishedDate: today.toISOString(),
        imageClubsUrl: '',
        membershipFee: 0,
        location: '',
        contactEmail: '',
        contactPhone: '',
        activityFrequency: '',
      });
      setDateInputValue(formatDateToDDMMYYYY(today.toISOString()));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo CLB';
      setError(message);
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

  // State for date input display value (DD/MM/YYYY format)
  const [dateInputValue, setDateInputValue] = useState<string>('');
  // Ref for hidden date picker
  const datePickerRef = useRef<HTMLInputElement>(null);

  // Format date to DD/MM/YYYY (local timezone)
  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
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

  return (
    <>
      <LeaderLayout
        title="Quản lý hồ sơ CLB"
        subtitle="Thiết lập nhanh thông tin hiển thị"
      >
        <div className="space-y-8">
          {/* Header with Create Button and quick stats */}
          {!showCreateForm && (
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

          {!showCreateForm && (
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

          {/* Clubs Table */}
          {(
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
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 h-full hover:border-blue-200 transition"
                    >
                      {/* Image section - always present with fixed height */}
                      <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        {club.imageClubsUrl ? (
                          <img
                            src={club.imageClubsUrl}
                            alt={club.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-start justify-between gap-3 flex-shrink-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{club.name}</p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{club.description || 'Chưa có mô tả'}</p>
                        </div>
                        {(() => {
                          const statusLower = (club.status || 'active').toLowerCase();
                          const isActive = statusLower === 'active';
                          return (
                            <span className={cn(
                              'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 flex-shrink-0',
                              isActive 
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                : 'bg-red-50 text-red-700 ring-red-200'
                            )}>
                              {getStatusLabel(club.status)}
                            </span>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 flex-shrink-0">
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

                      <div className="flex justify-between items-center pt-2 mt-auto">
                        <button
                          onClick={() => handleViewDetail(club.id)}
                          className="rounded-xl bg-blue-50 border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </LeaderLayout>

      {/* Create Club Modal - Outside Layout */}
      {showCreateForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
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
                      location: '',
                      contactEmail: '',
                      contactPhone: '',
                      activityFrequency: '',
                    });
                    setDateInputValue(formatDateToDDMMYYYY(today.toISOString()));
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>

              {error && (
                <div className="mx-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex-shrink-0">
                  {error}
                </div>
              )}

              <div className="space-y-4 overflow-y-auto px-6 py-6 flex-1 min-h-0">
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
                  <label className="block text-sm text-slate-800">
                    Địa điểm
                    <input
                      type="text"
                      value={createFormData.location ?? ''}
                      onChange={(e) => handleCreateFormChange('location', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                      placeholder="Ví dụ: Phòng A101, Tòa nhà B"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-slate-800">
                    Email liên hệ
                    <input
                      type="email"
                      value={createFormData.contactEmail ?? ''}
                      onChange={(e) => handleCreateFormChange('contactEmail', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                      placeholder="club@example.com"
                    />
                  </label>
                  <label className="block text-sm text-slate-800">
                    Số điện thoại liên hệ
                    <input
                      type="tel"
                      value={createFormData.contactPhone ?? ''}
                      onChange={(e) => handleCreateFormChange('contactPhone', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                      placeholder="0123456789"
                    />
                  </label>
                </div>

                <label className="block text-sm text-slate-800">
                  Tần suất hoạt động
                  <input
                    type="text"
                    value={createFormData.activityFrequency ?? ''}
                    onChange={(e) => handleCreateFormChange('activityFrequency', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    placeholder="Ví dụ: Hàng tuần, 2 lần/tháng, Hàng tháng"
                  />
                </label>

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
                </label>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0">
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
        )}
      </>
    );
  }

export default ClubLeaderInfoPage;
