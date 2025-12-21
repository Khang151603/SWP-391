import { useState, useEffect, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { activityService } from '../../api/services/activity.service';
import { membershipService } from '../../api/services/membership.service';
import type { StudentActivity } from '../../api/types/activity.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { showSuccessToast } from '../../utils/toast';

function StudentActivitiesPage() {
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setRegistrationError] = useState<string | null>(null);
  const [, setRegistrationSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<StudentActivity | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Strategy: Fetch from multiple sources to ensure we get all activities
        // 1. Get activities from view-all endpoint (student view)
        // 2. Get activities from each club using student endpoint
        // 3. Also try to get activities using leader endpoint (GET_BY_CLUB) as fallback
        // 4. Merge and deduplicate by activity ID
        
        const [viewAllActivities, myClubs] = await Promise.all([
          activityService.getStudentViewAll().catch(() => []),
          membershipService.getStudentMyClubs().catch(() => []),
        ]);
        
        // Fetch activities from each club using student endpoint
        const clubActivitiesPromises = myClubs.map(async (clubMembership) => {
          try {
            const clubActivities = await activityService.getStudentViewByClub(clubMembership.club.id);
            // Add club name to each activity if not present
            return clubActivities.map((activity: StudentActivity) => ({
              ...activity,
              clubName: activity.clubName || clubMembership.club.name,
            }));
          } catch {
            return [];
          }
        });
        
        // Also try to fetch using leader endpoint (GET_BY_CLUB) as additional source
        // This might return more activities if student endpoints are filtered
        const leaderActivitiesPromises = myClubs.map(async (clubMembership) => {
          try {
            const leaderActivities = await activityService.getByClub(clubMembership.club.id);
            // Add club name and convert to StudentActivity format
            return leaderActivities.map((activity): StudentActivity => ({
              id: activity.id,
              clubId: activity.clubId,
              clubName: clubMembership.club.name,
              title: activity.title,
              description: activity.description,
              startTime: activity.startTime,
              endTime: activity.endTime,
              location: activity.location,
              status: activity.status,
              imageActsUrl: activity.imageActsUrl,
              // Ensure isRegistered is set (might not be in leader endpoint)
              isRegistered: false,
              category: undefined,
              registeredCount: undefined,
              maxParticipants: undefined,
            }));
          } catch {
            // This is expected to fail for students, so we silently catch
            return [];
          }
        });
        
        const [clubActivitiesArrays, leaderActivitiesArrays] = await Promise.all([
          Promise.all(clubActivitiesPromises),
          Promise.all(leaderActivitiesPromises),
        ]);
        
        const clubActivities = clubActivitiesArrays.flat();
        const leaderActivities = leaderActivitiesArrays.flat();
        
        // Merge all sources and deduplicate by activity ID
        // Use a more robust approach: collect all activities first, then deduplicate
        const allActivitiesList: StudentActivity[] = [];
        
        // Helper function to safely add activity
        const addActivitySafely = (activity: StudentActivity | Partial<StudentActivity>) => {
          if (activity && activity.id && activity.startTime) {
            allActivitiesList.push(activity as StudentActivity);
          }
        };
        
        // Add all activities from view-all endpoint
        viewAllActivities.forEach(addActivitySafely);
        
        // Add all activities from club-by-club student endpoint fetch
        clubActivities.forEach(addActivitySafely);
        
        // Add all activities from leader endpoint (if accessible)
        leaderActivities.forEach(addActivitySafely);
        
        // Deduplicate by activity ID, keeping the most complete version
        const activitiesMap = new Map<number, StudentActivity>();
        allActivitiesList.forEach((activity) => {
          const existing = activitiesMap.get(activity.id);
          if (existing) {
            // Merge: prefer the one with more complete data
            // Priority: isRegistered > clubName > other fields
            activitiesMap.set(activity.id, {
              ...existing,
              ...activity,
              // Preserve isRegistered status (important for UI)
              isRegistered: activity.isRegistered !== undefined ? activity.isRegistered : existing.isRegistered,
              // Prefer non-empty clubName
              clubName: activity.clubName || existing.clubName,
              // Preserve other important fields
              registeredCount: activity.registeredCount !== undefined ? activity.registeredCount : existing.registeredCount,
              maxParticipants: activity.maxParticipants !== undefined ? activity.maxParticipants : existing.maxParticipants,
            });
          } else {
            activitiesMap.set(activity.id, activity);
          }
        });
        
        // Convert map to array - this ensures we have all unique activities
        const allActivities = Array.from(activitiesMap.values());
        
        // Sort by start time (newest first) with error handling
        allActivities.sort((a, b) => {
          try {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            // Handle invalid dates
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1; // Invalid dates go to end
            if (isNaN(dateB)) return -1;
            return dateB - dateA; // Newest first
          } catch {
            return 0; // Keep order if comparison fails
          }
        });
        
        setActivities(allActivities);
      } catch {
        const message = 'Không thể tải danh sách hoạt động. Vui lòng thử lại sau.';
        setError(message);
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
    // Check Not_yet_open FIRST before checking 'open' keyword
    if (statusLower.includes('not_yet_open') || statusLower.includes('notyetopen')) {
      return {
        label: 'Chưa mở',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
      };
    }
    if (statusLower === 'pending') {
      return {
        label: 'Chưa mở',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
      };
    }
    // Đóng đăng ký (Active_Closed, Closed, ...)
    if (statusLower.includes('active_closed') || statusLower.includes('closed')) {
      return {
        label: 'Đã đóng đăng ký',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-700',
        borderColor: 'border-slate-300',
        dotColor: 'bg-slate-500',
      };
    }
    if (statusLower.includes('active') || statusLower.includes('opened')) {
      return {
        label: 'Đã mở đăng ký',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    }
    if (statusLower.includes('ongoing')) {
      return {
        label: 'Đang diễn ra',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        dotColor: 'bg-purple-500',
      };
    }
    if (statusLower.includes('completed')) {
      return {
        label: 'Đã kết thúc',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
        borderColor: 'border-slate-300',
        dotColor: 'bg-slate-500',
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
    
    // Chỉ cho đăng ký khi status = "Active" (đã mở đăng ký)
    // Không cho đăng ký khi:
    // - Not_yet_open / pending (chưa mở)
    // - Active_Closed / closed (đã đóng đăng ký)
    // - Ongoing (đang diễn ra)
    // - Completed / Cancelled (đã kết thúc / đã hủy)
    
    const isNotYetOpen = statusLower.includes('not_yet_open') || 
                         statusLower.includes('notyetopen') || 
                         statusLower === 'pending';
    const isClosed = statusLower.includes('active_closed') || 
                     statusLower === 'closed';
    const isOngoing = statusLower.includes('ongoing');
    const isCompleted = statusLower.includes('completed') || 
                        statusLower.includes('cancel');
    
    // Chỉ cho đăng ký khi status = "Active" (chính xác là "active" hoặc "opened")
    // và không phải các trạng thái trên
    const isActive = statusLower === 'active' || statusLower === 'opened';

    return (
      isActive &&
      !isNotYetOpen &&
      !isClosed &&
      !isOngoing &&
      !isCompleted &&
      !activity.isRegistered &&
      (!activity.maxParticipants || !activity.registeredCount || activity.registeredCount < activity.maxParticipants)
    );
  };

  const handleJoinActivity = async (activityId: number) => {
    // Tìm activity trong danh sách hiện tại
    const activity = activities.find(a => a.id === activityId);
    
    // Kiểm tra nếu đã đăng ký rồi
    if (activity?.isRegistered) {
      const message = 'Bạn đã đăng ký rồi';
      setRegistrationError(message);
      setRegistrationSuccess(null);
      return;
    }
    
    try {
      setRegistrationError(null);
      
      await activityService.registerStudent(activityId);
      
      // Hiển thị message thành công
      const successMessage = 'Đăng ký tham gia thành công';
      showSuccessToast(successMessage);
      
      // Refresh activities to update registration status using the same strategy as initial fetch
      const [viewAllActivities, myClubs] = await Promise.all([
        activityService.getStudentViewAll().catch(() => []),
        membershipService.getStudentMyClubs().catch(() => []),
      ]);
      
      const clubActivitiesPromises = myClubs.map(async (clubMembership) => {
        try {
          const clubActivities = await activityService.getStudentViewByClub(clubMembership.club.id);
          return clubActivities.map((activity: StudentActivity) => ({
            ...activity,
            clubName: activity.clubName || clubMembership.club.name,
          }));
        } catch {
          return [];
        }
      });
      
      const leaderActivitiesPromises = myClubs.map(async (clubMembership) => {
        try {
          const leaderActivities = await activityService.getByClub(clubMembership.club.id);
          return leaderActivities.map((activity): StudentActivity => ({
            id: activity.id,
            clubId: activity.clubId,
            clubName: clubMembership.club.name,
            title: activity.title,
            description: activity.description,
            startTime: activity.startTime,
            endTime: activity.endTime,
            location: activity.location,
            status: activity.status,
            imageActsUrl: activity.imageActsUrl,
            isRegistered: false,
            category: undefined,
            registeredCount: undefined,
            maxParticipants: undefined,
          }));
        } catch {
          return [];
        }
      });
      
      const [clubActivitiesArrays, leaderActivitiesArrays] = await Promise.all([
        Promise.all(clubActivitiesPromises),
        Promise.all(leaderActivitiesPromises),
      ]);
      
      const clubActivities = clubActivitiesArrays.flat();
      const leaderActivities = leaderActivitiesArrays.flat();
      
      // Merge all sources with same robust logic as initial fetch
      const allActivitiesList: StudentActivity[] = [];
      
      // Helper function to safely add activity
      const addActivitySafely = (activity: StudentActivity | Partial<StudentActivity>) => {
        if (activity && activity.id && activity.startTime) {
          allActivitiesList.push(activity as StudentActivity);
        }
      };
      
      viewAllActivities.forEach(addActivitySafely);
      clubActivities.forEach(addActivitySafely);
      leaderActivities.forEach(addActivitySafely);
      
      // Deduplicate with same merge logic
      const activitiesMap = new Map<number, StudentActivity>();
      allActivitiesList.forEach((activity) => {
        const existing = activitiesMap.get(activity.id);
        if (existing) {
          activitiesMap.set(activity.id, {
            ...existing,
            ...activity,
            isRegistered: activity.isRegistered !== undefined ? activity.isRegistered : existing.isRegistered,
            clubName: activity.clubName || existing.clubName,
            registeredCount: activity.registeredCount !== undefined ? activity.registeredCount : existing.registeredCount,
            maxParticipants: activity.maxParticipants !== undefined ? activity.maxParticipants : existing.maxParticipants,
          });
        } else {
          activitiesMap.set(activity.id, activity);
        }
      });
      
      const allActivities = Array.from(activitiesMap.values());
      // Sort with error handling
      allActivities.sort((a, b) => {
        try {
          const dateA = new Date(a.startTime).getTime();
          const dateB = new Date(b.startTime).getTime();
          if (isNaN(dateA) && isNaN(dateB)) return 0;
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          return dateB - dateA;
        } catch {
          return 0;
        }
      });
      
      setActivities(allActivities);
      
      // Giữ lại registrationSuccess trong UI; toast sẽ tự đóng
    } catch (err: unknown) {
      // Xử lý lỗi từ API
      const errorMessage = (err instanceof Error ? err.message : String(err)) || '';
      const message = errorMessage || 'Không thể đăng ký tham gia hoạt động. Vui lòng thử lại sau.';
      setRegistrationError(message);
    }
  };

  return (
    <StudentLayout title="Hoạt động" subtitle="Khám phá và đăng ký tham gia các hoạt động">
      <div className="space-y-8">
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
              const isFull = !!(
                activity.maxParticipants &&
                activity.registeredCount &&
                activity.registeredCount >= activity.maxParticipants
              );

              return (
                <div
                  key={activity.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg"
                >
                  {/* Activity Image */}
                  {activity.imageActsUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={activity.imageActsUrl} 
                        alt={activity.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Status badge on image */}
                      <div className="absolute right-3 top-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-sm ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor}`}
                        >
                          <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor} ${canJoin ? 'animate-pulse' : ''}`}></div>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      {/* Club Name on image */}
                      {activity.clubName && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-lg">
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
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Header (shown when no image) */}
                  {!activity.imageActsUrl && (
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
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Category and Title */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {activity.category && (
                        <span className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          {activity.category}
                        </span>
                      )}
                    </div>
                    <h3 className="line-clamp-2 text-xl font-bold text-slate-900 mb-4">{activity.title}</h3>

                    {activity.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-slate-600">{activity.description}</p>
                    )}

                    {/* Activity Details */}
                    <div className="mb-4 flex-1 space-y-2.5 border-t border-slate-100 pt-4">
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

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => setSelectedActivity(activity)}
                        className="w-full rounded-xl border border-blue-600 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50 active:scale-95"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleJoinActivity(activity.id)}
                        disabled={!canJoin && !activity.isRegistered && isFull}
                        className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                          activity.isRegistered
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer'
                            : canJoin
                              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Detail Dialog */}
      <Dialog open={selectedActivity !== null} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        {selectedActivity && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {selectedActivity.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Image */}
              {selectedActivity.imageActsUrl && (
                <div className="relative h-64 w-full overflow-hidden rounded-xl">
                  <img 
                    src={selectedActivity.imageActsUrl} 
                    alt={selectedActivity.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Status and Club */}
              <div className="flex flex-wrap items-center gap-3">
                {(() => {
                  const statusConfig = getStatusConfig(selectedActivity.status);
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor}`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`}></div>
                      {statusConfig.label}
                    </span>
                  );
                })()}
                {selectedActivity.category && (
                  <span className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    {selectedActivity.category}
                  </span>
                )}
                {selectedActivity.clubName && (
                  <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-blue-700">{selectedActivity.clubName}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedActivity.description && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-slate-900">Mô tả</h4>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                    {selectedActivity.description}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Thời gian</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <div className="font-medium">{formatDateTime(selectedActivity.startTime).date}</div>
                    <div className="text-slate-500">
                      {formatDateTime(selectedActivity.startTime).time} - {formatDateTime(selectedActivity.endTime).time}
                    </div>
                    {formatDateTime(selectedActivity.startTime).date !== formatDateTime(selectedActivity.endTime).date && (
                      <div className="text-slate-500 mt-1">
                        Đến: {formatDateTime(selectedActivity.endTime).date}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Địa điểm</span>
                  </div>
                  <div className="text-sm text-slate-600">{selectedActivity.location}</div>
                </div>

                {selectedActivity.maxParticipants && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>Số lượng</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">
                        {selectedActivity.registeredCount || 0}/{selectedActivity.maxParticipants}
                      </span>
                      <span className="text-slate-500"> người đã đăng ký</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Đóng
                </button>
                {(() => {
                  const canJoin = canRegister(selectedActivity);
                  const isFull = !!(
                    selectedActivity.maxParticipants &&
                    selectedActivity.registeredCount &&
                    selectedActivity.registeredCount >= selectedActivity.maxParticipants
                  );
                  
                  return (
                    <button
                      onClick={() => {
                        handleJoinActivity(selectedActivity.id);
                        setSelectedActivity(null);
                      }}
                      disabled={!canJoin && !selectedActivity.isRegistered && isFull}
                      className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        selectedActivity.isRegistered
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer'
                          : canJoin
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                            : isFull
                              ? 'bg-amber-100 text-amber-700 cursor-not-allowed'
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {selectedActivity.isRegistered
                        ? 'Đã đăng ký'
                        : isFull
                          ? 'Đã đầy'
                          : canJoin
                            ? 'Đăng ký tham gia'
                            : 'Không thể đăng ký'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </StudentLayout>
  );
}

export default StudentActivitiesPage;
