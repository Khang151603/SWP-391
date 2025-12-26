import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { membershipService } from '../../api/services/membership.service';
import { clubService } from '../../api/services/club.service';
import type { StudentMyClub } from '../../api/types/membership.types';
import type { ClubListItem } from '../../api/types/club.types';
import { showApiErrorToast, showSuccessToast } from '../../utils/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../components/ui/Dialog';
import { cn } from '../../components/utils/cn';

interface ClubWithDetails extends StudentMyClub {
  clubDetails?: ClubListItem;
  memberCount?: number;
}

function StudentClubsPage() {
  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState<ClubWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedClub, setSelectedClub] = useState<ClubWithDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [leavingClubId, setLeavingClubId] = useState<number | null>(null);
  const [clubToLeave, setClubToLeave] = useState<ClubWithDetails | null>(null);
  const [isLeaveConfirmDialogOpen, setIsLeaveConfirmDialogOpen] = useState(false);

  const getMembershipStatusMeta = (status: string | undefined | null) => {
    const normalized = status?.trim().toLowerCase() ?? '';
    switch (normalized) {
      case 'active':
        return {
          label: 'Đang hoạt động',
          badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
          normalized,
        };
      case 'pending_payment':
        return {
          label: 'Chờ thanh toán phí',
          badgeClass: 'bg-amber-50 text-amber-700 ring-amber-200',
          normalized,
        };
      case 'locked':
        return {
          label: 'Đã khóa',
          badgeClass: 'bg-rose-50 text-rose-700 ring-rose-200',
          normalized,
        };
      default:
        return {
          label: status || 'Không xác định',
          badgeClass: 'bg-slate-50 text-slate-700 ring-slate-200',
          normalized,
        };
    }
  };

  // Function to fetch clubs data
  const fetchMyClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get list of clubs student is member of
      const myClubs = await membershipService.getStudentMyClubs();
      
      // Fetch detailed information for each club using /api/clubs/{id}
      // Note: This endpoint may require leader role, so we catch errors gracefully
      const clubsWithDetails = await Promise.all(
        myClubs.map(async (item) => {
          try {
            const clubDetails = await clubService.getClubDetailsById(item.club.id);
            
            return {
              ...item,
              clubDetails,
              // Ensure memberCount is preserved from clubDetails if available
              memberCount: clubDetails.memberCount ?? item.club.memberCount,
            };
          } catch {
            // Return item without details if fetch fails (e.g., student doesn't have leader permission)
            // The memberCount from item.club.memberCount should still be available if API returns it
            return item;
          }
        })
      );
      
      setClubs(clubsWithDetails);
    } catch {
      const message = 'Không thể tải danh sách CLB. Vui lòng thử lại sau.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when refreshKey changes
  useEffect(() => {
    fetchMyClubs();
  }, [refreshKey]);

  // Auto-refresh when user returns to the page/tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && clubs.length > 0) {
        // Silently refresh data in background when user returns to tab
        setRefreshKey((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clubs.length]);

  // Manual refresh handler
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Handle view details
  const handleViewDetails = (club: ClubWithDetails) => {
    setSelectedClub(club);
    setIsDetailDialogOpen(true);
  };

  const handleLeaveClubClick = (club: ClubWithDetails) => {
    setClubToLeave(club);
    setIsLeaveConfirmDialogOpen(true);
  };

  const handleLeaveClubConfirm = async () => {
    if (!clubToLeave) return;

    const clubName = clubToLeave.clubDetails?.name || clubToLeave.club.name;
    setLeavingClubId(clubToLeave.club.id);
    setIsLeaveConfirmDialogOpen(false);
    
    try {
      await membershipService.leaveClub(clubToLeave.club.id);
      showSuccessToast(`Đã rời CLB "${clubName}".`);
      setClubs((prev) => prev.filter((item) => item.club.id !== clubToLeave.club.id));
      setIsDetailDialogOpen(false);
    } catch (error) {
      showApiErrorToast(error, 'Không thể rời CLB. Vui lòng thử lại.');
    } finally {
      setLeavingClubId(null);
      setClubToLeave(null);
    }
  };

  const filteredClubs = useMemo(() => {
    return clubs.filter((item) => {
      const matchSearch =
        !search ||
        item.membership.clubName.toLowerCase().includes(search.toLowerCase()) ||
        item.club.name.toLowerCase().includes(search.toLowerCase()) ||
        item.clubDetails?.name.toLowerCase().includes(search.toLowerCase());

      return matchSearch;
    });
  }, [clubs, search]);

  const hasNoClub = clubs.length === 0;

  return (
    <StudentLayout
      title="CLB đang tham gia"
      subtitle="Quản lý các câu lạc bộ bạn đang tham gia"
    >
      <div className="space-y-8">
    
        {/* Controls: search + refresh button */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên CLB..."
              className="h-8 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Làm mới danh sách CLB"
          >
            <svg 
              className={cn('h-4 w-4', loading && 'animate-spin')} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Làm mới
          </button>
        </div>

        {/* Clubs list + empty states */}
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
        ) : hasNoClub ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-slate-900">Bạn chưa tham gia CLB nào</h4>
              <p className="mb-4 text-sm text-slate-600">
                Khám phá các CLB học thuật, nghệ thuật, thể thao và nhiều hơn nữa để bắt đầu hành trình đại học sôi động hơn.
              </p>
              <Link
                to="/student/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
              >
                Khám phá ngay
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center shadow-sm">
            <div className="mx-auto max-w-md space-y-3">
              <p className="text-sm font-medium text-amber-800">
                Không tìm thấy CLB phù hợp với bộ lọc hiện tại.
              </p>
              <p className="text-xs text-amber-700">
                Thử xoá từ khóa tìm kiếm để xem thêm CLB.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-100 border border-amber-300 px-4 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredClubs.map((item) => {
              const clubName = item.clubDetails?.name || item.club.name;
              const clubDescription = item.clubDetails?.description || item.club.description || '';
              const memberCount = item.clubDetails?.memberCount ?? item.club.memberCount ?? item.memberCount;
              const membershipFee = item.clubDetails?.membershipFee ?? item.club.membershipFee;
              const imageUrl = item.clubDetails?.imageUrl || item.clubDetails?.imageClubsUrl || item.club.imageClubsUrl;
              const statusMeta = getMembershipStatusMeta(item.membership.status);
              const canLeave = statusMeta.normalized === 'active';
              const isLeaving = leavingClubId === item.club.id;

              return (
                <div
                  key={item.club.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300"
                >
                  {/* Header với ảnh và status */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={clubName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{clubName}</h3>
                        {statusMeta.label && (
                          <span className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 flex-shrink-0',
                            statusMeta.badgeClass
                          )}>
                            {statusMeta.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{clubDescription || 'Chưa có mô tả'}</p>
                    </div>
                  </div>

                  {/* Thông tin cơ bản */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-slate-700">{memberCount || 0} thành viên</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-slate-700">
                        {membershipFee === 0 || !membershipFee ? 'Miễn phí' : `${membershipFee.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleLeaveClubClick(item)}
                      disabled={!canLeave || isLeaving}
                      className={cn(
                        'rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition flex-shrink-0',
                        canLeave
                          ? 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed',
                        isLeaving && 'opacity-80'
                      )}
                    >
                      {isLeaving ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {!canLeave && (
                    <p className="text-xs text-slate-500 mt-2">
                      Chỉ rời CLB khi trạng thái thành viên đang hoạt động.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Dialog xác nhận rời CLB */}
        <Dialog 
          open={isLeaveConfirmDialogOpen} 
          onOpenChange={(open) => {
            setIsLeaveConfirmDialogOpen(open);
            if (!open) {
              setClubToLeave(null);
            }
          }}
        >
          <DialogContent className="max-w-md">
            {clubToLeave && (
              <>
                <DialogHeader>
                  <DialogTitle>Xác nhận rời CLB</DialogTitle>
                  <DialogDescription>
                    Bạn chắc chắn muốn rời CLB "{clubToLeave.clubDetails?.name || clubToLeave.club.name}"?
                  </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                  <p className="text-sm text-slate-600">
                    Lịch sử thanh toán và hoạt động đã tham gia vẫn sẽ được giữ lại.
                  </p>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    onClick={() => {
                      setIsLeaveConfirmDialogOpen(false);
                      setClubToLeave(null);
                    }}
                    className="rounded-xl bg-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleLeaveClubConfirm}
                    disabled={leavingClubId !== null}
                    className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {leavingClubId !== null ? 'Đang xử lý...' : 'Xác nhận'}
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog chi tiết CLB */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedClub && (() => {
              const detailStatusMeta = getMembershipStatusMeta(selectedClub.membership.status);
              const canLeaveSelected = detailStatusMeta.normalized === 'active';
              const isLeavingSelected = leavingClubId === selectedClub.club.id;
              const clubName = selectedClub.clubDetails?.name || selectedClub.club.name;
              const clubDescription = selectedClub.clubDetails?.description || selectedClub.club.description || '';
              const memberCount = selectedClub.memberCount ?? selectedClub.clubDetails?.memberCount ?? selectedClub.club.memberCount ?? 0;
              const membershipFee = selectedClub.clubDetails?.membershipFee ?? selectedClub.club.membershipFee;
              const imageUrl = selectedClub.clubDetails?.imageUrl || selectedClub.clubDetails?.imageClubsUrl || selectedClub.club.imageClubsUrl;
              const establishedDate = selectedClub.clubDetails?.establishedDate ?? selectedClub.club.establishedDate;
              const location = selectedClub.clubDetails?.location ?? selectedClub.club.location;

              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{clubName}</DialogTitle>
                    <DialogDescription>
                      Thông tin chi tiết về câu lạc bộ
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Header với ảnh và thông tin cơ bản */}
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Hình ảnh */}
                      <div className="w-full sm:w-80 h-48 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={clubName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Thông tin cơ bản */}
                      <div className="flex-1 space-y-4">
                        {/* Status và mô tả */}
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className={cn(
                              'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1',
                              detailStatusMeta.badgeClass
                            )}>
                              {detailStatusMeta.label}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{clubDescription || 'Chưa có mô tả'}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Thành viên</p>
                              <p className="text-lg font-semibold text-slate-900">{memberCount}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Phí thành viên</p>
                              <p className="text-lg font-semibold text-slate-900">
                                {membershipFee === 0 || !membershipFee ? 'Miễn phí' : `${membershipFee.toLocaleString('vi-VN')}đ`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Cột 1 */}
                      <div className="space-y-4">
                        {establishedDate && (
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-sm text-slate-500">Ngày thành lập</p>
                              <p className="text-sm font-medium text-slate-900">
                                {new Date(establishedDate).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {location && (
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                              <p className="text-sm text-slate-500">Địa điểm</p>
                              <p className="text-sm font-medium text-slate-900">{location}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <div>
                            <p className="text-sm text-slate-500">Ngày tham gia</p>
                            <p className="text-sm font-medium text-slate-900">
                              {(() => {
                                if (!selectedClub.membership.joinDate) return '--';
                                try {
                                  const date = new Date(selectedClub.membership.joinDate);
                                  if (isNaN(date.getTime())) return '--';
                                  return date.toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  });
                                } catch {
                                  return '--';
                                }
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cột 2 */}
                      <div className="space-y-4">
                        {(() => {
                          const contactEmail = selectedClub.clubDetails?.contactEmail ?? selectedClub.club.contactEmail;
                          return contactEmail && (
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <div>
                                <p className="text-sm text-slate-500">Email liên hệ</p>
                                <a
                                  href={`mailto:${contactEmail}`}
                                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                  {contactEmail}
                                </a>
                              </div>
                            </div>
                          );
                        })()}

                        {(() => {
                          const contactPhone = selectedClub.clubDetails?.contactPhone ?? selectedClub.club.contactPhone;
                          return contactPhone && (
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <div>
                                <p className="text-sm text-slate-500">Điện thoại</p>
                                <a
                                  href={`tel:${contactPhone}`}
                                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                  {contactPhone}
                                </a>
                              </div>
                            </div>
                          );
                        })()}

                        {(() => {
                          const activityFrequency = selectedClub.clubDetails?.activityFrequency ?? selectedClub.club.activityFrequency;
                          return activityFrequency && (
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-sm text-slate-500">Tần suất hoạt động</p>
                                <p className="text-sm font-medium text-slate-900">{activityFrequency}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    {canLeaveSelected && (
                      <button
                        onClick={() => handleLeaveClubClick(selectedClub)}
                        disabled={isLeavingSelected}
                        className={cn(
                          'rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm transition',
                          isLeavingSelected
                            ? 'bg-rose-200 text-rose-700 cursor-not-allowed'
                            : 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md'
                        )}
                      >
                        {isLeavingSelected ? (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Đang rời...
                          </div>
                        ) : (
                          'Rời CLB'
                        )}
                      </button>
                    )}
                    <DialogClose asChild>
                      <button className="rounded-xl bg-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300">
                        Đóng
                      </button>
                    </DialogClose>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  );
}

export default StudentClubsPage;