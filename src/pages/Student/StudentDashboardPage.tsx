import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { membershipService } from '../../api/services/membership.service';
import { activityService } from '../../api/services/activity.service';
import { handleApiError } from '../../api/utils/errorHandler';

function StudentDashboardPage() {
  const [totalClubs, setTotalClubs] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [completedActivities, setCompletedActivities] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch my clubs
        const myClubs = await membershipService.getStudentMyClubs();
        setTotalClubs(myClubs.length);

        // Fetch my activities (activities I've registered for)
        const myActivities = await activityService.getStudentForRegistration();
        setTotalActivities(myActivities.length);
        
        // Count completed activities (assuming status indicates completion)
        const completed = myActivities.filter(
          activity => activity.status?.toLowerCase() === 'completed' || 
                     activity.status?.toLowerCase() === 'finished' ||
                     activity.status?.toLowerCase() === 'done'
        ).length;
        setCompletedActivities(completed);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completionRate =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-8">

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tổng CLB */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10"></div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-blue-100">Câu lạc bộ</p>
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold">{totalClubs}</p>
              <p className="mt-2 text-sm text-blue-100">CLB đang tham gia</p>
            </div>
          </div>

          {/* Tổng hoạt động */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10"></div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-purple-100">Hoạt động</p>
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold">{totalActivities}</p>
              <p className="mt-2 text-sm text-purple-100">Đã đăng ký</p>
            </div>
          </div>

          {/* Hoạt động hoàn thành */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl sm:col-span-2 lg:col-span-1">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10"></div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-emerald-100">Hoàn thành</p>
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold">{completedActivities}</p>
                <span className="text-lg text-emerald-100">/ {totalActivities}</span>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-emerald-100">Tiến độ</span>
                  <span className="font-bold">{completionRate}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <h3 className="mb-6 text-2xl font-bold text-slate-900">Bắt đầu ngay</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/student/explore"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-blue-200/50"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-900">Khám phá CLB</p>
                <p className="mt-1 text-sm text-slate-600">Tìm CLB phù hợp với bạn</p>
              </div>
            </Link>

            <Link
              to="/student/activities"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-purple-200/50"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-900">Hoạt động</p>
                <p className="mt-1 text-sm text-slate-600">Xem tất cả hoạt động</p>
              </div>
            </Link>

            <Link
              to="/student/my-activities"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-pink-200/50"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-900">Hoạt động của tôi</p>
                <p className="mt-1 text-sm text-slate-600">Quản lý tham gia</p>
              </div>
            </Link>

            <Link
              to="/student/membership-requests"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-amber-200/50"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-900">Yêu cầu của tôi</p>
                <p className="mt-1 text-sm text-slate-600">Theo dõi trạng thái</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentDashboardPage;



