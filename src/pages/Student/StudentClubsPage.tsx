import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { membershipService } from '../../api/services/membership.service';
import { clubService } from '../../api/services/club.service';
import type { StudentMyClub } from '../../api/types/membership.types';
import type { ClubListItem } from '../../api/types/club.types';

interface ClubWithDetails extends StudentMyClub {
  clubDetails?: ClubListItem;
}

function StudentClubsPage() {
  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState<ClubWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to fetch clubs data
  const fetchMyClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get list of clubs student is member of
      const myClubs = await membershipService.getStudentMyClubs();
      
      // Fetch detailed information for each club using /api/clubs/{id}
      const clubsWithDetails = await Promise.all(
        myClubs.map(async (item) => {
          try {
            const clubDetails = await clubService.getClubDetailsById(item.club.id);
            return {
              ...item,
              clubDetails,
            };
          } catch {
            // Return item without details if fetch fails
            return item;
          }
        })
      );
      
      setClubs(clubsWithDetails);
    } catch {
      setError('Không thể tải danh sách CLB. Vui lòng thử lại sau.');
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
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
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
              const memberCount = item.clubDetails?.memberCount;
              const membershipFee = item.clubDetails?.membershipFee ?? item.club.membershipFee;
              const imageUrl = item.clubDetails?.imageClubsUrl;
              const establishedDate = item.clubDetails?.establishedDate;
              
              return (
                <div
                  key={item.club.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 hover:border-blue-200 transition"
                >
                  {/* Hình ảnh CLB ở đầu card */}
                  {imageUrl && (
                    <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200 relative">
                      <img
                        src={imageUrl}
                        alt={clubName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Status Badge */}
                      {item.membership.status && (
                        <div className="absolute right-2 top-2 z-10">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${
                            item.membership.status.toLowerCase() === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' 
                              : item.membership.status.toLowerCase() === 'pending_payment'
                              ? 'bg-amber-50 text-amber-700 ring-amber-200'
                              : 'bg-slate-50 text-slate-700 ring-slate-200'
                          }`}>
                            {item.membership.status.toLowerCase() === 'active' 
                              ? 'Đang hoạt động' 
                              : item.membership.status.toLowerCase() === 'pending_payment'
                              ? 'Chờ thanh toán'
                              : item.membership.status}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Thông tin CLB */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{clubName}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{clubDescription || 'Chưa có mô tả'}</p>
                    </div>
                    {!imageUrl && item.membership.status && (
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${
                        item.membership.status.toLowerCase() === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' 
                          : item.membership.status.toLowerCase() === 'pending_payment'
                          ? 'bg-amber-50 text-amber-700 ring-amber-200'
                          : 'bg-slate-50 text-slate-700 ring-slate-200'
                      }`}>
                        {item.membership.status.toLowerCase() === 'active' 
                          ? 'Đang hoạt động' 
                          : item.membership.status.toLowerCase() === 'pending_payment'
                          ? 'Chờ thanh toán'
                          : item.membership.status}
                      </span>
                    )}
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
                      <p className="mt-1 text-sm text-slate-900">{memberCount ?? '--'}</p>
                    </div>
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentClubsPage;