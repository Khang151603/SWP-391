import LeaderLayout from '../../components/layout/LeaderLayout';
import { activityPipeline, memberRoster, pendingApplications } from './leaderData';

function ClubLeaderDashboardPage() {
  const pendingCount = pendingApplications.length;
  const upcomingActivities = activityPipeline.length;
  const totalMembers = memberRoster.length;

  return (
    <LeaderLayout
      title="Dashboard điều hành CLB"
      subtitle="Theo dõi nhanh thành viên, hoạt động và tài chính để ra quyết định trong ngày"
    >
      <div className="space-y-8">
        {/* Hero / Greeting */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Xin chào, Leader</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
                  Toàn cảnh hoạt động CLB trong hôm nay.
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Today focus cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p className="uppercase tracking-[0.25em]">Đơn đăng ký</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingCount}</p>
          </div>

          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p className="uppercase tracking-[0.25em]">Hoạt động sắp diễn ra</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{upcomingActivities}</p>
          </div>

          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p className="uppercase tracking-[0.25em]">Tổng thành viên</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalMembers}</p>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderDashboardPage;


