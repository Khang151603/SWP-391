import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { clubService } from '../../api/services/club.service';
import { membershipService } from '../../api/services/membership.service';
import type {
  UpdateLeaderClubRequest,
  LeaderClubListItem,
} from '../../api/types/club.types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

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

function ClubLeaderDetailPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClubProfile | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editDateInputValue, setEditDateInputValue] = useState<string>('');
  const editDatePickerRef = useRef<HTMLInputElement>(null);

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
    return status;
  };

  // Format date to DD/MM/YYYY
  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
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
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) return null;
    
    const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    
    if (date.getUTCDate() !== day || date.getUTCMonth() !== month || date.getUTCFullYear() !== year) {
      return null;
    }
    
    return date.toISOString();
  };

  // Load club data
  useEffect(() => {
    const loadClub = async () => {
      if (!clubId) {
        navigate('/leader/club-info');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const myClubs = await clubService.getMyLeaderClubs();
        const club = myClubs.find((c) => String(c.id) === clubId) as ExtendedLeaderClubListItem | undefined;
        
        if (!club) {
          setError('Không tìm thấy CLB');
          return;
        }

        let memberCount = 0;
        let totalRevenue = 0;
        
        try {
          const members = await membershipService.getLeaderClubMembers(club.id);
          memberCount = members.filter(m => 
            m.member.status?.toLowerCase() === 'active'
          ).length;
          totalRevenue = (club.membershipFee || 0) * memberCount;
        } catch (error) {
          console.error(`Failed to fetch data for club ${club.id}:`, error);
        }
        
        const clubProfile: ClubProfile = {
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
        
        setFormData(clubProfile);
      } catch {
        const message = 'Không thể tải thông tin CLB. Vui lòng thử lại sau.';
        setError(message);
        showErrorToast(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadClub();
  }, [clubId, navigate]);

  // Initialize edit date input value when edit mode opens
  useEffect(() => {
    if (isEditMode && formData?.establishedDate) {
      setEditDateInputValue(formatDateToDDMMYYYY(formData.establishedDate));
    } else {
      setEditDateInputValue('');
    }
  }, [isEditMode, formData?.establishedDate]);

  const handleInputChange = (field: keyof ClubProfile, value: string | number | null) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value ?? '' } : prev));
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    // Reload club data to reset
    if (clubId) {
      const loadClub = async () => {
        try {
          const myClubs = await clubService.getMyLeaderClubs();
          const club = myClubs.find((c) => String(c.id) === clubId) as ExtendedLeaderClubListItem | undefined;
          
          if (club) {
            let memberCount = 0;
            let totalRevenue = 0;
            
            try {
              const members = await membershipService.getLeaderClubMembers(club.id);
              memberCount = members.filter(m => 
                m.member.status?.toLowerCase() === 'active'
              ).length;
              totalRevenue = (club.membershipFee || 0) * memberCount;
            } catch (error) {
              console.error(`Failed to fetch data for club ${club.id}:`, error);
            }
            
            const clubProfile: ClubProfile = {
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
            
            setFormData(clubProfile);
          }
        } catch (error) {
          console.error('Failed to reload club data:', error);
        }
      };
      loadClub();
    }
    setIsEditMode(false);
  };

  const handleUpdateClub = async () => {
    if (!formData) return;
    if (!formData.name || !formData.description) {
      const message = 'Tên và mô tả CLB là bắt buộc';
      setError(message);
      showErrorToast(message);
      return;
    }

    const statusToUse = formData.status || 'Active';
    const normalizedStatus = statusToUse 
      ? (statusToUse.toLowerCase() === 'active' ? 'Active' : 'Unactive')
      : 'Active';

    const payload: UpdateLeaderClubRequest = {
      name: formData.name,
      description: formData.description,
      establishedDate: formData.establishedDate,
      imageClubsUrl: formData.imageClubsUrl || '',
      membershipFee: formData.membershipFee,
      status: normalizedStatus as UpdateLeaderClubRequest['status'],
      location: formData.location || undefined,
      contactEmail: formData.contactEmail || undefined,
      contactPhone: formData.contactPhone || undefined,
      activityFrequency: formData.activityFrequency || undefined,
    };

    setIsLoading(true);
    setError(null);
    try {
      await clubService.updateLeaderClub(Number(formData.id), payload);
      
      const updatedProfile: ClubProfile = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        establishedDate: formData.establishedDate,
        imageClubsUrl: formData.imageClubsUrl,
        avatarPublicId: formData.avatarPublicId,
        membershipFee: formData.membershipFee,
        status: normalizedStatus,
        memberCount: formData.memberCount,
        totalRevenue: formData.totalRevenue,
        location: formData.location,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        activityFrequency: formData.activityFrequency,
      };
      
      setFormData(updatedProfile);
      setIsEditMode(false);
      
      showSuccessToast('Cập nhật thông tin CLB thành công!');
    } catch (err) {
      console.error('=== UPDATE FAILED ===');
      console.error('Error details:', err);
      const message = 'Không thể cập nhật thông tin CLB. Vui lòng thử lại sau.';
      setError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImageFile || !formData) return;
    
    setIsUploadingImage(true);
    setError(null);
    
    try {
      const result = await clubService.uploadClubImage(formData.id, selectedImageFile);
      
      const updatedFormData = { ...formData, imageClubsUrl: result.imageUrl };
      setFormData(updatedFormData);
      
      setSelectedImageFile(null);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể upload ảnh';
      setError(message);
      showErrorToast(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        const message = 'Vui lòng chọn file ảnh (jpg, png, gif, ...)';
        setError(message);
        showErrorToast(message);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        const message = 'Kích thước ảnh không được vượt quá 5MB';
        setError(message);
        showErrorToast(message);
        return;
      }
      setSelectedImageFile(file);
      setError(null);
    }
  };

  if (isLoading && !formData) {
    return (
      <LeaderLayout title="Chi tiết CLB" subtitle="Đang tải...">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-200 opacity-20"></div>
          </div>
          <p className="mt-6 text-sm font-medium text-slate-600">Đang tải thông tin CLB...</p>
        </div>
      </LeaderLayout>
    );
  }

  if (!formData) {
    return (
      <LeaderLayout title="Chi tiết CLB" subtitle="Không tìm thấy CLB">
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="rounded-full bg-red-100 p-4 mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy CLB</h3>
          <p className="text-slate-600 mb-8 text-center max-w-md">{error || 'CLB không tồn tại hoặc bạn không có quyền truy cập'}</p>
          <button
            onClick={() => navigate('/leader/club-info')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </button>
        </div>
      </LeaderLayout>
    );
  }

  return (
    <LeaderLayout
      title="Chi tiết CLB"
      subtitle={formData.name}
    >

      <div className="space-y-8">
        {/* Detail View: View Mode (Read-only) */}
        {!isEditMode && (
          <>
            {/* Header with Breadcrumb */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/leader/club-info')}
                    className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm active:scale-95"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại
                  </button>
                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Chi tiết CLB</p>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{formData.name || 'CLB mới'}</h2>
                  </div>
                </div>
                <button
                  onClick={handleEditMode}
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </button>
              </div>
            </section>

            {/* View Mode Content */}
            <section className="space-y-6">
              {/* Hero Section with Image and Status */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg">
                {formData.imageClubsUrl && (
                  <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 md:h-96">
                    <img
                      src={formData.imageClubsUrl}
                      alt={formData.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-6 right-6">
                      {(() => {
                        const statusLower = (formData.status || 'active').toLowerCase();
                        const isActive = statusLower === 'active';
                        return (
                          <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-xl backdrop-blur-md border-2 ${
                            isActive 
                              ? 'bg-emerald-500/95 text-white border-emerald-300/50' 
                              : 'bg-red-500/95 text-white border-red-300/50'
                          }`}>
                            <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${isActive ? 'bg-emerald-200' : 'bg-red-200'}`}></span>
                            {getStatusLabel(formData.status)}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                )}
                {!formData.imageClubsUrl && (
                  <div className="flex h-64 items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 md:h-80">
                    <div className="text-center">
                      <div className="mx-auto w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-500">Chưa có ảnh đại diện</p>
                      <p className="text-xs text-slate-400 mt-1">Nhấn "Chỉnh sửa" để thêm ảnh</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Info Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Thông tin chung
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Mô tả</p>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{formData.description || <span className="text-slate-400 italic">Chưa có mô tả</span>}</p>
                  </div>
                </div>

                {/* Contact Information Grid */}
                <div className="grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-2">
                  <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5 transition-all hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Địa điểm</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formData.location || <span className="text-slate-400 font-normal">Chưa cập nhật</span>}</p>
                  </div>

                  <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5 transition-all hover:border-purple-400 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tần suất hoạt động</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formData.activityFrequency || <span className="text-slate-400 font-normal">Chưa cập nhật</span>}</p>
                  </div>

                  <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5 transition-all hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Email liên hệ</p>
                    </div>
                    {formData.contactEmail ? (
                      <a href={`mailto:${formData.contactEmail}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                        {formData.contactEmail}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-400">Chưa cập nhật</p>
                    )}
                  </div>

                  <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5 transition-all hover:border-orange-400 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Số điện thoại</p>
                    </div>
                    {formData.contactPhone ? (
                      <a href={`tel:${formData.contactPhone}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                        {formData.contactPhone}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-400">Chưa cập nhật</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Thống kê
                  </h3>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <div className="group relative rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-blue-50/80 to-white p-6 transition-all hover:border-blue-400 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Ngày thành lập</p>
                    <p className="text-xl font-bold text-slate-900">
                      {formData.establishedDate ? new Date(formData.establishedDate).toLocaleDateString('vi-VN') : '--'}
                    </p>
                  </div>

                  <div className="group relative rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-white p-6 transition-all hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Phí thành viên</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(formData.membershipFee)}</p>
                  </div>

                  <div className="group relative rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-purple-50/80 to-white p-6 transition-all hover:border-purple-400 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">Số thành viên</p>
                    <p className="text-xl font-bold text-slate-900">{formData.memberCount ?? '--'}</p>
                  </div>

                  <div className="group relative rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-orange-50/80 to-white p-6 transition-all hover:border-orange-400 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">Tổng doanh thu</p>
                    <p className="text-xl font-bold text-slate-900">
                      {formData.totalRevenue !== null ? formatCurrency(formData.totalRevenue) : '--'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Detail View: Edit Mode */}
        {isEditMode && (
          <>
            {/* Back Button Header */}
            <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-r from-white via-blue-50/40 to-white p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCancelEdit}
                    className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-95"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Hủy chỉnh sửa
                  </button>
                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Chế độ chỉnh sửa</p>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{formData.name || 'CLB mới'}</h2>
                  </div>
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-2xl bg-red-50 border-2 border-red-200 px-5 py-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-red-700 flex-1">{error}</p>
              </div>
            )}

            {/* Main layout: form editable */}
            <section className="space-y-6">
              {/* Basic Information Section */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Thông tin cơ bản
                  </h3>
                </div>
                <div className="space-y-6">
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700 flex items-center gap-2">
                      Tên CLB 
                      <span className="text-red-500 text-base">*</span>
                    </span>
                    <input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                      placeholder="Ví dụ: CLB Truyền thông"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700">Mô tả</span>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300 resize-none"
                      rows={6}
                      placeholder="Tóm tắt sứ mệnh, hoạt động nổi bật, văn hoá của CLB..."
                    />
                  </label>
                </div>
              </div>

              {/* Image & Media Section */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Ảnh đại diện
                  </h3>
                </div>
                <div className="space-y-6">
                  {formData.imageClubsUrl && (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 shadow-sm">
                      <img
                        src={formData.imageClubsUrl}
                        alt={formData.name}
                        className="h-72 w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 transition-all hover:border-blue-400 hover:bg-blue-50/50">
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                      <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4 md:mb-0 md:float-left md:mr-4">
                          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="mb-1 text-sm font-bold text-slate-700">Upload ảnh mới</p>
                          <p className="text-xs text-slate-500">Chấp nhận file ảnh (jpg, png, gif, ...), tối đa 5MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                            id="club-image-upload"
                          />
                          <label
                            htmlFor="club-image-upload"
                            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border-2 border-blue-400 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:border-blue-500 hover:shadow-md active:scale-95"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {selectedImageFile ? selectedImageFile.name : 'Chọn ảnh'}
                          </label>
                        </label>
                        {selectedImageFile && (
                          <button
                            onClick={handleUploadImage}
                            disabled={isUploadingImage}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700"
                          >
                            {isUploadingImage ? (
                              <>
                                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang upload...
                              </>
                            ) : (
                              <>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-emerald-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Cài đặt & Thông tin liên hệ
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700">Phí thành viên</span>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">VNĐ</span>
                      <input
                        type="number"
                        value={formData.membershipFee}
                        onChange={(e) => handleInputChange('membershipFee', Number(e.target.value))}
                        className="w-full rounded-xl border-2 border-slate-200 bg-white pl-20 pr-5 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700">Trạng thái</span>
                    <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4">
                      {(() => {
                        const statusLower = (formData.status || 'active').toLowerCase();
                        const isActive = statusLower === 'active';
                        return (
                          <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold ${
                            isActive 
                              ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200' 
                              : 'bg-red-100 text-red-700 ring-2 ring-red-200'
                          }`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {getStatusLabel(formData.status)}
                          </span>
                        );
                      })()}
                    </div>
                  </label>
                </div>

                {/* Contact Information */}
                <div className="grid gap-6 md:grid-cols-2 mt-6">
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700">Địa điểm</span>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                      placeholder="Ví dụ: Phòng A101, Tòa nhà B"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700">Tần suất hoạt động</span>
                    <input
                      type="text"
                      value={formData.activityFrequency || ''}
                      onChange={(e) => handleInputChange('activityFrequency', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                      placeholder="Ví dụ: Hàng tuần, 2 lần/tháng"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700">Email liên hệ</span>
                    <input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                      placeholder="club@example.com"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold text-slate-700">Số điện thoại liên hệ</span>
                    <input
                      type="tel"
                      value={formData.contactPhone || ''}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                      placeholder="0123456789"
                    />
                  </label>
                </div>
              </div>

              {/* Date Section */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-600 to-orange-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Ngày thành lập
                  </h3>
                </div>
                <label className="block">
                  <span className="mb-3 block text-sm font-bold text-slate-700">Ngày thành lập</span>
                  <div className="relative mt-2">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <svg
                        className="w-6 h-6 text-slate-400"
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
                        inputValue = inputValue.replace(/[^\d/]/g, '');
                        
                        const digits = inputValue.replace(/\//g, '');
                        
                        let formatted = inputValue;
                        
                        if (!inputValue.includes('/')) {
                          if (digits.length >= 3) {
                            formatted = digits.slice(0, 2) + '/' + digits.slice(2);
                          }
                          if (digits.length >= 5) {
                            formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
                          }
                        } else {
                          const parts = inputValue.split('/');
                          if (parts.length === 2 && parts[1].length >= 3) {
                            formatted = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2);
                          }
                        }
                        
                        formatted = formatted.slice(0, 10);
                        
                        setEditDateInputValue(formatted);
                        
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
                        const isoDate = parseDDMMYYYYToISO(editDateInputValue);
                        if (!isoDate && editDateInputValue.trim() !== '') {
                          if (formData.establishedDate) {
                            setEditDateInputValue(formatDateToDDMMYYYY(formData.establishedDate));
                          }
                        } else if (isoDate) {
                          const date = new Date(isoDate);
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          if (date > today) {
                            const todayFormatted = formatDateToDDMMYYYY(today.toISOString());
                            setEditDateInputValue(todayFormatted);
                            handleInputChange('establishedDate', today.toISOString());
                          }
                        }
                      }}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white pl-14 pr-14 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-slate-300 transition-all"
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
                        if (!editDatePickerRef.current?.showPicker) {
                          editDatePickerRef.current?.click();
                        }
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer z-10 p-1.5 rounded-lg hover:bg-blue-50"
                      aria-label="Chọn ngày từ lịch"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </label>
              </div>
            </section>

            {/* Action bar */}
            <section className="sticky bottom-0 rounded-3xl border-2 border-slate-200/80 bg-white/95 backdrop-blur-md p-6 shadow-2xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-600 bg-blue-50/50 rounded-xl px-4 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Vui lòng kiểm tra kỹ thông tin trước khi lưu</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-95"
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdateClub}
                    disabled={isLoading}
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderDetailPage;

