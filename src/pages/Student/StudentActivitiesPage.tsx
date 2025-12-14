import { useState, useEffect, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { activityService } from '../../api/services/activity.service';
import { clubService } from '../../api/services/club.service';
import type { StudentActivity } from '../../api/types/activity.types';

function StudentActivitiesPage() {
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await activityService.getStudentViewAll();
        
        // Fetch club names for activities that don't have clubName
        const activitiesWithClubNames = await Promise.all(
          data.map(async (activity) => {
            // If clubName already exists, return as is
            if (activity.clubName) {
              return activity;
            }
            
            // Otherwise, fetch club name from clubId
            try {
              const clubDetails = await clubService.getClubDetailsById(activity.clubId);
              return {
                ...activity,
                clubName: clubDetails.name,
              };
            } catch (err) {
              // Return activity with fallback clubName
              return {
                ...activity,
                clubName: `CLB #${activity.clubId}`,
              };
            }
          })
        );
        
        setActivities(activitiesWithClubNames);
      } catch (err) {
        setError('Không thể tải danh sách hoạt động. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Extract unique categories from activities
  const categories = useMemo(() => {
    const cats = new Set<string>(['Tất cả']);
    activities.forEach((activity) => {
      if (activity.category) {
        cats.add(activity.category);
      }
    });
    return Array.from(cats);
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchCategory = selectedCategory === 'Tất cả' || activity.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.clubName && activity.clubName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activities, selectedCategory, searchQuery]);

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('open') || statusLower === 'pending') {
      return {
        label: 'Đang mở',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    }
    if (statusLower.includes('full') || statusLower.includes('completed')) {
      return {
        label: 'Đã đầy',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
      };
    }
    if (statusLower.includes('cancel')) {
      return {
        label: 'Đã hủy',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        dotColor: 'bg-red-500',
      };
    }
    return {
      label: 'Đã đóng',
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-600',
      borderColor: 'border-slate-300',
      dotColor: 'bg-slate-500',
    };
  };

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

  const canRegister = (activity: StudentActivity) => {
    const statusLower = activity.status.toLowerCase();
    return (
      (statusLower.includes('active') || statusLower.includes('open') || statusLower === 'pending') &&
      !activity.isRegistered &&
      (!activity.maxParticipants || !activity.registeredCount || activity.registeredCount < activity.maxParticipants)
    );
  };

  const handleJoinActivity = async (activityId: number) => {
    try {
      await activityService.registerStudent(activityId);
      // Refresh activities to update registration status
      const data = await activityService.getStudentViewAll();
      
      // Fetch club names for activities that don't have clubName
      const activitiesWithClubNames = await Promise.all(
        data.map(async (activity) => {
          if (activity.clubName) {
            return activity;
          }
          try {
            const clubDetails = await clubService.getClubDetailsById(activity.clubId);
            return {
              ...activity,
              clubName: clubDetails.name,
            };
          } catch (err) {
            return {
              ...activity,
              clubName: `CLB #${activity.clubId}`,
            };
          }
        })
      );
      
      setActivities(activitiesWithClubNames);
    } catch (err) {
      setRegistrationError('Không thể đăng ký tham gia hoạt động. Vui lòng thử lại sau.');
    }
  };

  return (
    <StudentLayout title="Hoạt động" subtitle="Khám phá và đăng ký tham gia các hoạt động">
      <div className="space-y-8">
        {registrationError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {registrationError}
          </div>
        )}
        
        {/* Search & Filter */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm hoạt động, CLB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Lọc:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
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
                {searchQuery || selectedCategory !== 'Tất cả'
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Hiện tại chưa có hoạt động nào'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((activity) => {
              const statusConfig = getStatusConfig(activity.status);
              const startDateTime = formatDateTime(activity.startTime);
              const endDateTime = formatDateTime(activity.endTime);
              const canJoin = canRegister(activity);
              const isFull =
                activity.maxParticipants &&
                activity.registeredCount &&
                activity.registeredCount >= activity.maxParticipants;

              return (
                <div
                  key={activity.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg"
                >
                  {/* Header */}
                  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                    {/* Status badge */}
                    <div className="absolute right-3 top-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor}`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor} ${canJoin ? 'animate-pulse' : ''}`}></div>
                        {statusConfig.label}
                      </span>
                    </div>
                    
                    {/* Club Name */}
                    {activity.clubName && (
                      <div className="mb-2 flex items-center gap-2">
                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-blue-700">{activity.clubName}</span>
                      </div>
                    )}
                    
                    {/* Category and Title */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {activity.category && (
                        <span className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          {activity.category}
                        </span>
                      )}
                    </div>
                    <h3 className="line-clamp-2 text-xl font-bold text-slate-900">{activity.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {activity.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-slate-600">{activity.description}</p>
                    )}

                    {/* Activity Details */}
                    <div className="mb-4 space-y-2.5 border-t border-slate-100 pt-4">
                      <div className="flex items-start gap-2 text-sm">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="flex-1">
                          <span className="font-medium text-slate-900">{startDateTime.date}</span>
                          <span className="text-slate-500"> • </span>
                          <span className="text-slate-600">{startDateTime.time}</span>
                          {startDateTime.date !== endDateTime.date && (
                            <>
                              <span className="text-slate-500"> - </span>
                              <span className="text-slate-600">{endDateTime.date} {endDateTime.time}</span>
                            </>
                          )}
                          {startDateTime.date === endDateTime.date && startDateTime.time !== endDateTime.time && (
                            <>
                              <span className="text-slate-500"> - </span>
                              <span className="text-slate-600">{endDateTime.time}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-slate-600">{activity.location}</span>
                      </div>

                      {activity.maxParticipants && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <span>
                            <span className="font-medium text-slate-900">
                              {activity.registeredCount || 0}/{activity.maxParticipants}
                            </span>
                            <span className="text-slate-500"> người đã đăng ký</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleJoinActivity(activity.id)}
                      disabled={!canJoin}
                      className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all ${
                        canJoin
                          ? 'bg-blue-600 shadow-md hover:bg-blue-700 active:scale-95'
                          : activity.isRegistered
                            ? 'bg-emerald-100 text-emerald-700 cursor-default'
                            : isFull
                              ? 'bg-amber-100 text-amber-700 cursor-not-allowed'
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {activity.isRegistered
                        ? 'Đã đăng ký'
                        : isFull
                          ? 'Đã đầy'
                          : canJoin
                            ? 'Đăng ký tham gia'
                            : 'Không thể đăng ký'}
                    </button>
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

export default StudentActivitiesPage;
