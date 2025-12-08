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
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-fuchsia-600/40 via-slate-950 to-orange-500/30 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-orange-100/80">Xin chào, Leader</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-white md:text-4xl">
                  Toàn cảnh hoạt động CLB trong hôm nay.
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Today focus cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm shadow-fuchsia-500/10 transition hover:border-fuchsia-400/50 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="uppercase tracking-[0.25em]">Đơn đăng ký</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{pendingCount}</p>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm shadow-emerald-500/10 transition hover:border-emerald-400/60 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="uppercase tracking-[0.25em]">Hoạt động sắp diễn ra</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{upcomingActivities}</p>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm shadow-sky-500/10 transition hover:border-sky-400/60 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="uppercase tracking-[0.25em]">Tổng thành viên</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{totalMembers}</p>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderDashboardPage;


