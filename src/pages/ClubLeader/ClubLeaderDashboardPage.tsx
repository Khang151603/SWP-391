import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { membershipService } from '../../api/services/membership.service';
import { clubService } from '../../api/services/club.service';
import { activityService } from '../../api/services/activity.service';

interface DashboardStats {
  clubs: {
    total: number;
    active: number;
    inactive: number;
  };
  members: {
    total: number;
    active: number;
    locked: number;
  };
  requests: {
    pending: number;
    approved: number;
    rejected: number;
  };
  activities: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
  };
}

function ClubLeaderDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    clubs: { total: 0, active: 0, inactive: 0 },
    members: { total: 0, active: 0, locked: 0 },
    requests: { pending: 0, approved: 0, rejected: 0 },
    activities: { total: 0, upcoming: 0, ongoing: 0, completed: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [myClubs, allMembers, allRequests, allActivitiesArrays] = await Promise.all([
          clubService.getMyLeaderClubs(),
          membershipService.getLeaderMembers(),
          membershipService.getLeaderAllRequests(),
          Promise.all(
            (await clubService.getMyLeaderClubs()).map(club =>
              activityService.getByClub(club.id).catch(() => [])
            )
          ),
        ]);

        // Calculate clubs stats
        const clubsStats = {
          total: myClubs.length,
          active: myClubs.filter(c => c.status?.toLowerCase() === 'active').length,
          inactive: myClubs.filter(c => c.status?.toLowerCase() !== 'active').length,
        };

        // Calculate members stats
        const membersStats = {
          total: allMembers.length,
          active: allMembers.filter(m => m.member.status?.toLowerCase() === 'active').length,
          locked: allMembers.filter(m => {
            const status = m.member.status?.toLowerCase();
            return status === 'locked' || status === 'inactive';
          }).length,
        };

        // Calculate requests stats
        const requestsStats = {
          pending: allRequests.filter(r => r.status?.toLowerCase() === 'pending').length,
          approved: allRequests.filter(r => {
            const status = r.status?.toLowerCase();
            return status === 'approved' || status === 'paid';
          }).length,
          rejected: allRequests.filter(r => {
            const status = r.status?.toLowerCase();
            return status === 'reject' || status === 'rejected';
          }).length,
        };

        // Calculate activities stats
        const allActivities = allActivitiesArrays.flat();
        const now = new Date();
        const activitiesStats = {
          total: allActivities.length,
          upcoming: allActivities.filter(activity => {
            const startTime = new Date(activity.startTime);
            const status = (activity.status || '').toLowerCase();
            return startTime > now && status !== 'completed' && status !== 'cancelled';
          }).length,
          ongoing: allActivities.filter(activity => {
            const status = (activity.status || '').toLowerCase();
            return status === 'ongoing';
          }).length,
          completed: allActivities.filter(activity => {
            const status = (activity.status || '').toLowerCase();
            return status === 'completed' || status === 'cancelled';
          }).length,
        };

        setStats({
          clubs: clubsStats,
          members: membersStats,
          requests: requestsStats,
          activities: activitiesStats,
        });
      } catch (error) {
        // Error fetching dashboard data
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  return (
    <LeaderLayout
      title="Dashboard điều hành CLB"
      subtitle="Tổng quan nhanh về thông tin CLB, thành viên, đơn đăng ký và hoạt động"
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-sm">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%)] pointer-events-none" />
          <div className="relative space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Xin chào, Leader</p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Tổng quan hoạt động CLB
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Theo dõi và quản lý tất cả thông tin quan trọng của CLB trong một màn hình duy nhất
            </p>
          </div>
        </section>

        {/* Main Stats Grid - 4 Cards */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Thông tin CLB */}
          <Link
            to="/leader/club-info"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Thông tin CLB</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Quản lý CLB</h3>
                  </div>
                </div>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{formatNumber(stats.clubs.total)}</p>
                      <p className="text-sm text-slate-600">Tổng số CLB</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-emerald-700">{stats.clubs.active}</span>
                        <span className="text-slate-600"> đang hoạt động</span>
                      </div>
                      {stats.clubs.inactive > 0 && (
                        <div>
                          <span className="font-semibold text-rose-700">{stats.clubs.inactive}</span>
                          <span className="text-slate-600"> bị khoá</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4 text-slate-400 transition-colors group-hover:text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 2: Thành viên */}
          <Link
            to="/leader/members"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-3">
                    <svg
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Thành viên</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Quản lý thành viên</h3>
                  </div>
                </div>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{formatNumber(stats.members.total)}</p>
                      <p className="text-sm text-slate-600">Tổng số thành viên</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-emerald-700">{stats.members.active}</span>
                        <span className="text-slate-600"> đang hoạt động</span>
                      </div>
                      {stats.members.locked > 0 && (
                        <div>
                          <span className="font-semibold text-rose-700">{stats.members.locked}</span>
                          <span className="text-slate-600"> đã khoá</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4 text-slate-400 transition-colors group-hover:text-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 3: Đơn đăng ký */}
          <Link
            to="/leader/requests"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-amber-100 p-3">
                    <svg
                      className="h-6 w-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Đơn đăng ký</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Xử lý đơn</h3>
                  </div>
                </div>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{formatNumber(stats.requests.pending)}</p>
                      <p className="text-sm text-slate-600">Đơn chờ duyệt</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-emerald-700">{stats.requests.approved}</span>
                        <span className="text-slate-600"> đã duyệt</span>
                      </div>
                      {stats.requests.rejected > 0 && (
                        <div>
                          <span className="font-semibold text-rose-700">{stats.requests.rejected}</span>
                          <span className="text-slate-600"> từ chối</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4 text-slate-400 transition-colors group-hover:text-amber-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 4: Hoạt động */}
          <Link
            to="/leader/activities"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3">
                    <svg
                      className="h-6 w-6 text-purple-600"
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
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Hoạt động</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Quản lý hoạt động</h3>
                  </div>
                </div>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{formatNumber(stats.activities.total)}</p>
                      <p className="text-sm text-slate-600">Tổng số hoạt động</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {stats.activities.upcoming > 0 && (
                        <div>
                          <span className="font-semibold text-blue-700">{stats.activities.upcoming}</span>
                          <span className="text-slate-600"> sắp diễn ra</span>
                        </div>
                      )}
                      {stats.activities.ongoing > 0 && (
                        <div>
                          <span className="font-semibold text-purple-700">{stats.activities.ongoing}</span>
                          <span className="text-slate-600"> đang diễn ra</span>
                        </div>
                      )}
                      {stats.activities.completed > 0 && (
                        <div>
                          <span className="font-semibold text-slate-600">{stats.activities.completed}</span>
                          <span className="text-slate-600"> đã kết thúc</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4 text-slate-400 transition-colors group-hover:text-purple-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </section>

        {/* Quick Actions Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Thao tác nhanh</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/leader/club-info"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="rounded-lg bg-blue-100 p-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Tạo CLB mới</span>
            </Link>
            <Link
              to="/leader/activities"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-purple-300 hover:bg-purple-50"
            >
              <div className="rounded-lg bg-purple-100 p-2">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Tạo hoạt động</span>
            </Link>
            <Link
              to="/leader/requests"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-amber-300 hover:bg-amber-50"
            >
              <div className="rounded-lg bg-amber-100 p-2">
                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Duyệt đơn</span>
            </Link>
            <Link
              to="/leader/members"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="rounded-lg bg-emerald-100 p-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Quản lý thành viên</span>
            </Link>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderDashboardPage;
