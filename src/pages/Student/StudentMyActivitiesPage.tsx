import { useState, useEffect, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { activityService } from '../../api/services/activity.service';
import { clubService } from '../../api/services/club.service';
import type { StudentActivity } from '../../api/types/activity.types';
import { cn } from '../../components/utils/cn';

interface MyActivity extends StudentActivity {
  clubName?: string;
  activityTitle?: string;
  activityStatus?: string;
  attended?: boolean;
  cancelReason?: string | null;
  registerTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

function StudentMyActivitiesPage() {
  const [activities, setActivities] = useState<MyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    const configs: Record<string, { label: string; color: string; dotColor: string }> = {
      active: {
        label: 'Đang hoạt động',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-600',
      },
      inactive: {
        label: 'Không hoạt động',
        color: 'bg-slate-100 text-slate-600 border-slate-300',
        dotColor: 'bg-slate-500',
      },
      unactive: {
        label: 'Không hoạt động',
        color: 'bg-slate-100 text-slate-600 border-slate-300',
        dotColor: 'bg-slate-500',
      },
      pending: {
        label: 'Chờ duyệt',
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dotColor: 'bg-yellow-600',
      },
      cancelled: {
        label: 'Đã hủy',
        color: 'bg-red-50 text-red-700 border-red-200',
        dotColor: 'bg-red-600',
      },
      completed: {
        label: 'Đã hoàn thành',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-600',
      },
      finished: {
        label: 'Đã kết thúc',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-600',
      },
      ongoing: {
        label: 'Đang diễn ra',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-600',
      },
      closed: {
        label: 'Đã đóng',
        color: 'bg-slate-100 text-slate-600 border-slate-300',
        dotColor: 'bg-slate-500',
      },
      opened: {
        label: 'Đã mở',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-600',
      },
      'not_yet_open': {
        label: 'Chưa mở',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-600',
      },
      notyetopen: {
        label: 'Chưa mở',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-600',
      },
      locked: {
        label: 'Đã khóa',
        color: 'bg-slate-100 text-slate-600 border-slate-300',
        dotColor: 'bg-slate-500',
      },
      approved: {
        label: 'Đã duyệt',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-600',
      },
      failed: {
        label: 'Thất bại',
        color: 'bg-red-50 text-red-700 border-red-200',
        dotColor: 'bg-red-600',
      },
    };
    return configs[statusLower] || {
      label: status,
      color: 'bg-slate-100 text-slate-600 border-slate-300',
      dotColor: 'bg-slate-500',
    };
  };

  useEffect(() => {
    const fetchMyActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get activities that student has registered for (clicked "Đăng ký tham gia")
        const data = await activityService.getMyActivityHistory();
        
        // Fetch club names
        const activitiesWithDetails = await Promise.all(
          data.map(async (activity) => {
            // Fetch club name if not provided
            let clubName = activity.clubName;
            if (!clubName) {
              try {
                const clubDetails = await clubService.getClubDetailsById(activity.clubId);
                clubName = clubDetails.name;
              } catch {
                clubName = `CLB #${activity.clubId}`;
              }
            }

            return {
              ...activity,
              clubName,
            };
          })
        );
        
        setActivities(activitiesWithDetails);
      } catch {
        const message = 'Không thể tải danh sách hoạt động. Vui lòng thử lại sau.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const name = activity.title || activity.activityTitle || '';
      const matchesSearch =
        !searchTerm ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.clubName && activity.clubName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [activities, searchTerm]);



  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const sortedActivities = useMemo(() => {
    const now = new Date().getTime();
    const cloned = [...filteredActivities];
    return cloned.sort((a, b) => {
      const aTime = new Date(a.startTime).getTime();
      const bTime = new Date(b.startTime).getTime();
      // Upcoming first, then newest
      const aUpcoming = aTime >= now ? 1 : 0;
      const bUpcoming = bTime >= now ? 1 : 0;
      if (aUpcoming !== bUpcoming) return bUpcoming - aUpcoming;
      return bTime - aTime;
    });
  }, [filteredActivities]);

  const stats = useMemo(() => {
    const attended = activities.filter((a) => a.attended).length;
    const upcoming = activities.filter((a) => new Date(a.startTime).getTime() >= Date.now()).length;
    return {
      total: activities.length,
      attended,
      upcoming,
    };
  }, [activities]);

  return (
    <StudentLayout title="Hoạt động của tôi" subtitle="Quản lý các hoạt động bạn đang tham gia">
      <div className="space-y-8 overflow-x-hidden">
        {/* Top bar */}
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Tìm kiếm hoạt động</p>
                <p className="text-xs text-slate-500">Theo tên hoạt động, CLB hoặc mô tả</p>
              </div>
              <div className="relative w-full lg:w-2/3">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm hoạt động hoặc CLB..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-500">Tổng hoạt động</p>
              <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-500">Sắp diễn ra</p>
              <p className="text-2xl font-semibold text-amber-600">{stats.upcoming}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-500">Đã tham gia</p>
              <p className="text-2xl font-semibold text-emerald-600">{stats.attended}</p>
            </div>
          </div>
        </div>

        {/* Activities List */}
        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
                <div className="mb-3 h-4 w-28 rounded bg-slate-200" />
                <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mb-4 h-4 w-full rounded bg-slate-200" />
                <div className="flex gap-2">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
              </div>
            ))}
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
        ) : filteredActivities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto max-w-md space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900">Không tìm thấy hoạt động</h4>
              <p className="text-sm text-slate-600">
                {searchTerm
                  ? 'Thử thay đổi từ khóa tìm kiếm'
                  : 'Bạn chưa đăng ký tham gia hoạt động nào'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {sortedActivities.map((activity) => {
              const startDateTime = formatDateTime(activity.startTime);
              const endDateTime = formatDateTime(activity.endTime);
              const normalizedStatus = activity.status || activity.activityStatus || 'active';
              const statusConfig = getStatusConfig(normalizedStatus);
              const title = activity.title || activity.activityTitle || 'Hoạt động';
              const hasDifferentDate = startDateTime.date !== endDateTime.date;
              const registerDateTime = formatDateTime(activity.registerTime || activity.createdAt || activity.updatedAt || activity.startTime);

              return (
                <div
                  key={activity.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', statusConfig.color)}>
                          <div className={cn('h-1.5 w-1.5 rounded-full', statusConfig.dotColor)}></div>
                          {statusConfig.label}
                        </span>
                        {activity.attended && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Đã điểm danh
                          </span>
                        )}
                        {activity.cancelReason && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                            Hủy: {activity.cancelReason}
                          </span>
                        )}
                        {activity.category && (
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700">
                            {activity.category}
                          </span>
                        )}
                        {activity.clubName && (
                          <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-700">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            {activity.clubName}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        {activity.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{activity.description}</p>
                        )}
                      </div>

                      <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                        <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                          <div className="mt-0.5 rounded-lg bg-white p-1 text-blue-600 shadow-sm">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Thời gian</p>
                            <p className="font-medium">
                              {startDateTime.date} • {startDateTime.time}
                            </p>
                            <p className="text-xs text-slate-500">
                              {hasDifferentDate
                                ? `${endDateTime.date} • ${endDateTime.time}`
                                : startDateTime.time !== endDateTime.time
                                ? `Kết thúc: ${endDateTime.time}`
                                : 'Trong ngày'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                          <div className="mt-0.5 rounded-lg bg-white p-1 text-purple-600 shadow-sm">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Địa điểm</p>
                            <p className="font-medium">{activity.location || 'Đang cập nhật'}</p>
                            <p className="text-xs text-slate-500">Mã CLB: {activity.clubId}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm sm:col-span-2">
                          <div className="mt-0.5 rounded-lg bg-blue-50 p-1 text-blue-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" />
                            </svg>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div>
                              <p className="text-xs text-slate-500">Thời gian đăng ký</p>
                              <p className="font-medium">
                                {registerDateTime.date} • {registerDateTime.time}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Trạng thái điểm danh</p>
                              <p className="font-medium">{activity.attended ? 'Đã tham gia' : 'Chưa tham gia'}</p>
                            </div>
                            {activity.cancelReason && (
                              <div>
                                <p className="text-xs text-slate-500">Lý do hủy</p>
                                <p className="font-medium text-orange-700">{activity.cancelReason}</p>
                              </div>
                            )}
                          </div>
                        </div>
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

export default StudentMyActivitiesPage;
