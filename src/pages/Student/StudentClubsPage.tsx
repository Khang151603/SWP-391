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
          } catch (err) {
            // Return item without details if fetch fails
            return item;
          }
        })
      );
      
      setClubs(clubsWithDetails);
    } catch (err) {
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredClubs.map((item) => {
              const clubName = item.clubDetails?.name || item.club.name;
              const clubDescription = item.clubDetails?.description || item.club.description || '';
              const memberCount = item.clubDetails?.memberCount;
              const membershipFee = item.clubDetails?.membershipFee ?? item.club.membershipFee;
              const imageUrl = item.clubDetails?.imageClubsUrl;
              
              return (
                <div
                  key={item.club.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                >
                  {/* Club Image */}
                  <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={clubName}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badge - moved outside image */}
                  {item.membership.status && (
                    <div className="absolute right-2 top-2 z-10">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold shadow-md ${
                        item.membership.status.toLowerCase() === 'active' 
                          ? 'bg-emerald-500 text-white' 
                          : item.membership.status.toLowerCase() === 'pending_payment'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}>
                        {item.membership.status.toLowerCase() === 'active' 
                          ? 'Đang hoạt động' 
                          : item.membership.status.toLowerCase() === 'pending_payment'
                          ? 'Chờ thanh toán'
                          : item.membership.status}
                      </span>
                    </div>
                  )}

                  {/* Club Content */}
                  <div className="p-4">
                    <h3 className="mb-1.5 text-lg font-bold text-slate-900 line-clamp-1">{clubName}</h3>
                    
                    {clubDescription && (
                      <p className="mb-3 text-xs text-slate-600 line-clamp-2">{clubDescription}</p>
                    )}

                    {/* Club Stats */}
                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      {memberCount !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <svg className="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <span className="font-medium text-slate-900">{memberCount}</span>
                          <span className="text-slate-500">thành viên</span>
                        </div>
                      )}
                      
                      {membershipFee !== undefined && membershipFee !== null && membershipFee > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-emerald-700">
                            {membershipFee?.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-slate-500">phí thành viên</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-slate-500">Tham gia:</span>
                        <span className="font-medium text-slate-900">
                          {(() => {
                            if (!item.membership.joinDate) return '--';
                            try {
                              const date = new Date(item.membership.joinDate);
                              if (isNaN(date.getTime())) return '--';
                              return date.toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              });
                            } catch (e) {
                              return '--';
                            }
                          })()}
                        </span>
                      </div>
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