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
      hideHeader={isDetailDialogOpen}
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredClubs.map((item) => {
              const clubName = item.clubDetails?.name || item.club.name;
              const clubDescription = item.clubDetails?.description || item.club.description || '';
              // Ưu tiên lấy memberCount từ clubDetails (nếu có), sau đó từ club, cuối cùng từ item.memberCount
              const memberCount = item.clubDetails?.memberCount ?? item.club.memberCount ?? item.memberCount;
              const membershipFee = item.clubDetails?.membershipFee ?? item.club.membershipFee;
              const imageUrl = item.clubDetails?.imageUrl || item.clubDetails?.imageClubsUrl || item.club.imageClubsUrl;
              const establishedDate = item.clubDetails?.establishedDate ?? item.club.establishedDate;
              const location = item.clubDetails?.location ?? item.club.location;
              const statusMeta = getMembershipStatusMeta(item.membership.status);
              const canLeave = statusMeta.normalized === 'active';
              const isLeaving = leavingClubId === item.club.id;
              
              return (
                <div
                  key={item.club.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 hover:border-blue-200 transition"
                >
                  {/* Hình ảnh CLB ở đầu card - luôn hiển thị khung */}
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200 relative">
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
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Status Badge */}
                    {statusMeta.label && (
                      <div className="absolute right-2 top-2 z-10">
                        <span className={cn(
                          'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1',
                          statusMeta.badgeClass
                        )}>
                          {statusMeta.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thông tin CLB */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{clubName}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{clubDescription || 'Chưa có mô tả'}</p>
                    </div>
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    {establishedDate && (
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">Ngày thành lập</p>
                        <p className="mt-1 text-sm text-slate-900">
                          {new Date(establishedDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    )}
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-500">Phí thành viên</p>
                      <p className="mt-1 text-sm text-slate-900">
                        {membershipFee === 0 || !membershipFee ? 'Miễn phí' : membershipFee.toLocaleString('vi-VN') + ' đ'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-500">Số thành viên</p>
                      <p className="mt-1 text-sm text-slate-900">
                        {memberCount !== undefined && memberCount !== null ? memberCount : '--'}
                      </p>
                    </div>
                    {location && (
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">Địa điểm</p>
                        <p className="mt-1 text-sm text-slate-900 line-clamp-1">{location}</p>
                      </div>
                    )}
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-500">Ngày tham gia</p>
                      <p className="mt-1 text-sm text-slate-900">
                        {(() => {
                          if (!item.membership.joinDate) return '--';
                          try {
                            const date = new Date(item.membership.joinDate);
                            if (isNaN(date.getTime())) return '--';
                            return date.toLocaleDateString('vi-VN');
                          } catch {
                            return '--';
                          }
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Nút xem chi tiết */}
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleLeaveClubClick(item)}
                      disabled={!canLeave || isLeaving}
                      className={cn(
                        'w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition',
                        canLeave
                          ? 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed',
                        isLeaving && 'opacity-80'
                      )}
                    >
                      {isLeaving ? 'Đang rời...' : 'Rời CLB'}
                    </button>
                  </div>
                  {!canLeave && (
                    <p className="text-[11px] text-slate-500">
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedClub && (() => {
              const detailStatusMeta = getMembershipStatusMeta(selectedClub.membership.status);
              const canLeaveSelected = detailStatusMeta.normalized === 'active';
              const isLeavingSelected = leavingClubId === selectedClub.club.id;

              return (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedClub.clubDetails?.name || selectedClub.club.name}
                    </DialogTitle>
                    <DialogDescription>
                      Thông tin chi tiết về câu lạc bộ
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Hình ảnh CLB */}
                    <div className="w-full h-64 rounded-lg overflow-hidden bg-slate-200 relative">
                      {(() => {
                        const imageUrl = selectedClub.clubDetails?.imageUrl || 
                                        selectedClub.clubDetails?.imageClubsUrl || 
                                        selectedClub.club.imageClubsUrl;
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={selectedClub.clubDetails?.name || selectedClub.club.name}
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
                        );
                      })()}
                      {/* Status Badge */}
                      {detailStatusMeta.label && (
                        <div className="absolute right-3 top-3 z-[60]">
                          <span className={cn(
                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1',
                            detailStatusMeta.badgeClass
                          )}>
                            {detailStatusMeta.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mô tả */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">Mô tả</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {selectedClub.clubDetails?.description || selectedClub.club.description || 'Chưa có mô tả'}
                      </p>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Thông tin chi tiết</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {(() => {
                          const establishedDate = selectedClub.clubDetails?.establishedDate ?? selectedClub.club.establishedDate;
                          return establishedDate && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p className="text-xs uppercase text-slate-500 mb-1">Ngày thành lập</p>
                              <p className="text-sm font-medium text-slate-900">
                                {new Date(establishedDate).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          );
                        })()}
                        
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs uppercase text-slate-500 mb-1">Phí thành viên</p>
                          <p className="text-sm font-medium text-slate-900">
                            {(() => {
                              const membershipFee = selectedClub.clubDetails?.membershipFee ?? selectedClub.club.membershipFee;
                              return membershipFee === 0 || !membershipFee ? 'Miễn phí' : membershipFee.toLocaleString('vi-VN') + ' đ';
                            })()}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs uppercase text-slate-500 mb-1">Số thành viên</p>
                          <p className="text-sm font-medium text-slate-900">
                            {selectedClub.memberCount ?? selectedClub.clubDetails?.memberCount ?? selectedClub.club.memberCount ?? '--'}
                          </p>
                        </div>

                        {(() => {
                          const location = selectedClub.clubDetails?.location ?? selectedClub.club.location;
                          return location && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p className="text-xs uppercase text-slate-500 mb-1">Địa điểm</p>
                              <p className="text-sm font-medium text-slate-900">{location}</p>
                            </div>
                          );
                        })()}

                        {(() => {
                          const contactEmail = selectedClub.clubDetails?.contactEmail ?? selectedClub.club.contactEmail;
                          return contactEmail && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p className="text-xs uppercase text-slate-500 mb-1">Email liên hệ</p>
                              <a 
                                href={`mailto:${contactEmail}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                              >
                                {contactEmail}
                              </a>
                            </div>
                          );
                        })()}

                        {(() => {
                          const contactPhone = selectedClub.clubDetails?.contactPhone ?? selectedClub.club.contactPhone;
                          return contactPhone && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p className="text-xs uppercase text-slate-500 mb-1">Điện thoại</p>
                              <a 
                                href={`tel:${contactPhone}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                {contactPhone}
                              </a>
                            </div>
                          );
                        })()}

                        {(() => {
                          const activityFrequency = selectedClub.clubDetails?.activityFrequency ?? selectedClub.club.activityFrequency;
                          return activityFrequency && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p className="text-xs uppercase text-slate-500 mb-1">Tần suất hoạt động</p>
                              <p className="text-sm font-medium text-slate-900">{activityFrequency}</p>
                            </div>
                          );
                        })()}

                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs uppercase text-slate-500 mb-1">Ngày tham gia</p>
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

                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs uppercase text-slate-500 mb-1">Trạng thái thành viên</p>
                          <p className="text-sm font-medium text-slate-900">
                            {detailStatusMeta.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    {canLeaveSelected && (
                      <button
                        onClick={() => handleLeaveClubClick(selectedClub)}
                        disabled={isLeavingSelected}
                        className={cn(
                          'w-full sm:w-auto rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm transition',
                          isLeavingSelected
                            ? 'bg-rose-200 text-rose-700 cursor-not-allowed'
                            : 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md'
                        )}
                      >
                        {isLeavingSelected ? 'Đang rời...' : 'Rời CLB'}
                      </button>
                    )}
                    <DialogClose asChild>
                      <button className="w-full sm:w-auto rounded-xl bg-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300">
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