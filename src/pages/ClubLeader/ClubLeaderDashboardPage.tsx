import LeaderLayout from '../../components/layout/LeaderLayout';
import { activityPipeline,  feeTracking, financeOverview, memberRoster, pendingApplications } from './leaderData';

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
              <p className="max-w-2xl text-sm text-slate-100/90">
                Bạn đang có{' '}
                <span className="font-semibold text-emerald-200">{pendingCount} đơn đăng ký</span> chờ duyệt,{' '}
                <span className="font-semibold text-amber-200">{upcomingActivities} hoạt động</span> sắp diễn ra cùng{' '}
                <span className="font-semibold text-sky-200">{totalMembers} thành viên</span> trong CLB.
              </p>
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
            <p className="mt-1 text-xs text-slate-400">
              Ưu tiên duyệt trước giờ{' '}
              <span className="font-medium text-slate-200">17:00</span> để kịp chốt danh sách Media Cup.
            </p>
            <button className="mt-3 w-full rounded-xl border border-fuchsia-300/50 bg-fuchsia-500/10 px-3 py-2 text-xs font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/20">
              Mở danh sách đơn chờ
            </button>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm shadow-emerald-500/10 transition hover:border-emerald-400/60 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="uppercase tracking-[0.25em]">Hoạt động sắp diễn ra</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{upcomingActivities}</p>
            <p className="mt-1 text-xs text-slate-400">
              Đảm bảo đủ nhân sự, ngân sách và truyền thông cho từng hoạt động.
            </p>
            <button className="mt-3 w-full rounded-xl border border-emerald-300/50 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/20">
              Xem pipeline hoạt động
            </button>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm shadow-sky-500/10 transition hover:border-sky-400/60 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="uppercase tracking-[0.25em]">Tổng thành viên</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{totalMembers}</p>
            <p className="mt-1 text-xs text-slate-400">
              Theo dõi nhanh quy mô CLB để cân đối nhân sự cho hoạt động và ngân sách.
            </p>
            <button className="mt-3 w-full rounded-xl border border-sky-300/50 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-500/20">
              Xem danh sách thành viên
            </button>
          </div>
        </section>
        {/* Finance & fee tracking */}
        <section className="grid gap-4 lg:grid-cols-[1.1fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 text-xs text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Tài chính nổi bật</h3>
            </div>
            <div className="mt-4 space-y-3">
              {financeOverview.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-3 py-3"
                >
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                  <p className="text-[0.75rem] font-medium text-emerald-300">{item.trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 text-xs text-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Theo dõi phí thành viên</h3>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {feeTracking.map((item) => (
                <div
                  key={`${item.member}-${item.activity}`}
                  className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-3 py-3 text-[0.75rem]"
                >
                  <div>
                    <p className="font-medium text-white">{item.member}</p>
                    <p className="text-[0.7rem] text-slate-300">{item.activity}</p>
                    <p className="mt-1 text-[0.7rem] text-slate-400">
                      Hạn: <span className="font-medium text-slate-100">{item.dueDate}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-300">{item.amount}</p>
                    <span
                      className={`mt-1 inline-flex items-center justify-end rounded-full px-3 py-1 text-[0.7rem] font-semibold ${
                        item.status === 'Đã đóng'
                          ? 'bg-emerald-500/10 text-emerald-200'
                          : item.status === 'Chưa đóng'
                          ? 'bg-rose-500/10 text-rose-200'
                          : 'bg-amber-500/10 text-amber-100'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderDashboardPage;


