import { useState, useEffect, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { activityService } from '../../api/services/activity.service';
import { clubService } from '../../api/services/club.service';
import type { StudentActivity } from '../../api/types/activity.types';

type ActivityStatus = 'upcoming' | 'ongoing' | 'completed';

interface MyActivity extends StudentActivity {
  displayStatus: ActivityStatus;
  role?: string;
}

const statusConfig: Record<ActivityStatus, { label: string; color: string; dotColor: string }> = {
  upcoming: {
    label: 'Sắp diễn ra',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-600',
  },
  ongoing: {
    label: 'Đang diễn ra',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-600',
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-slate-100 text-slate-600 border-slate-300',
    dotColor: 'bg-slate-500',
  },
};

function StudentMyActivitiesPage() {
  const [activities, setActivities] = useState<MyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMyActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await activityService.getStudentForRegistration();
        
        // Fetch club names and determine activity status
        const activitiesWithDetails = await Promise.all(
          data.map(async (activity) => {
            // Fetch club name if not provided
            let clubName = activity.clubName;
            if (!clubName) {
              try {
                const clubDetails = await clubService.getClubDetailsById(activity.clubId);
                clubName = clubDetails.name;
              } catch (err) {
                console.error(`Error fetching club ${activity.clubId}:`, err);
                clubName = `CLB #${activity.clubId}`;
              }
            }

            // Determine activity status based on current time
            const now = new Date();
            const startTime = new Date(activity.startTime);
            const endTime = new Date(activity.endTime);
            
            let displayStatus: ActivityStatus = 'upcoming';
            if (now >= startTime && now <= endTime) {
              displayStatus = 'ongoing';
            } else if (now > endTime) {
              displayStatus = 'completed';
            }

            return {
              ...activity,
              clubName,
              displayStatus,
            };
          })
        );
        
        setActivities(activitiesWithDetails);
      } catch (err) {
        console.error('Error fetching my activities:', err);
        setError('Không thể tải danh sách hoạt động. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesTab = activeTab === 'all' || activity.displayStatus === activeTab;
      const matchesSearch =
        !searchTerm ||
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.clubName && activity.clubName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activities, activeTab, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: activities.length,
      upcoming: activities.filter((a) => a.displayStatus === 'upcoming').length,
      ongoing: activities.filter((a) => a.displayStatus === 'ongoing').length,
      completed: activities.filter((a) => a.displayStatus === 'completed').length,
    };
  }, [activities]);

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

  return (
    <StudentLayout title="Hoạt động của tôi" subtitle="Quản lý các hoạt động bạn đang tham gia">
      <div className="space-y-8 overflow-x-hidden">
        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Sắp diễn ra</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.upcoming}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Đang diễn ra</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.ongoing}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Hoàn thành</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.completed}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              Sắp diễn ra ({stats.upcoming})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'ongoing'
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              Đang diễn ra ({stats.ongoing})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'completed'
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              Hoàn thành ({stats.completed})
            </button>
          </div>
        </div>

        {/* Activities List */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto max-w-md space-y-3">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-sm text-slate-600">Đang tải danh sách hoạt động...</p>
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
                {searchTerm || activeTab !== 'all'
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Bạn chưa đăng ký tham gia hoạt động nào'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => {
              const startDateTime = formatDateTime(activity.startTime);
              const endDateTime = formatDateTime(activity.endTime);
              const config = statusConfig[activity.displayStatus];

              return (
                <div
                  key={activity.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`}></div>
                          {config.label}
                        </span>
                        {activity.category && (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs text-blue-700 border border-blue-200">
                            {activity.category}
                          </span>
                        )}
                        {activity.clubName && (
                          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 border border-slate-200">
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
                      <h3 className="mb-1 text-lg font-semibold text-slate-900">{activity.title}</h3>
                      {activity.description && (
                        <p className="mb-3 line-clamp-2 text-sm text-slate-600">{activity.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {startDateTime.date} • {startDateTime.time}
                            {startDateTime.date !== endDateTime.date && ` - ${endDateTime.date} ${endDateTime.time}`}
                            {startDateTime.date === endDateTime.date && startDateTime.time !== endDateTime.time && ` - ${endDateTime.time}`}
                          </span>
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.location}
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

export default StudentMyActivitiesPage;
