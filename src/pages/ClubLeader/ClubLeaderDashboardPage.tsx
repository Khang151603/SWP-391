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
              <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-fuchsia-100 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Bảng điều khiển • Không gian Leader
              </div>
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
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-black/30 px-3 py-1 text-slate-100 ring-1 ring-white/15">
                  Ưu tiên: Xử lý đơn & công nợ trong ngày
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1 text-slate-100 ring-1 ring-fuchsia-400/30">
                  Gợi ý: Kiểm tra lịch hoạt động tuần này
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Today focus cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm shadow-fuchsia-500/10 transition hover:border-fuchsia-400/50 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="uppercase tracking-[0.25em]">Đơn đăng ký</p>
              <span className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[0.7rem] font-medium text-fuchsia-200">
                Cần xử lý
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{pendingCount}</p>
            <p className="mt-1 text-xs text-slate-400">
              Ưu tiên duyệt trước giờ{' '}
              <span className="font-medium text-slate-200">17:00</span> để kịp chốt danh sách Media Cup.
            </p>
            <button className="mt-3 w-full rounded-xl bg-fuchsia-500/90 px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-fuchsia-400">
              Mở danh sách đơn chờ
            </button>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm shadow-emerald-500/10 transition hover:border-emerald-400/60 hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="uppercase tracking-[0.25em]">Hoạt động sắp diễn ra</p>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-medium text-emerald-200">
                Lịch tuần này
              </span>
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
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[0.7rem] font-medium text-sky-200">
                Quy mô CLB
              </span>
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
        {/* Applications & activity pipeline */}
        <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/85 p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white">Đơn đăng ký chờ xử lý</h3>
                <p className="text-[0.7rem] text-slate-400">
                  Duyệt nhanh để giữ trải nghiệm tốt cho ứng viên mới.
                </p>
              </div>
              <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-100 hover:bg-white/10">
                Xem tất cả
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {pendingApplications.map((application) => (
                <div
                  key={application.studentId}
                  className="rounded-2xl border border-white/8 bg-slate-950/90 p-4 text-xs text-slate-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{application.name}</p>
                      <p className="text-[0.7rem] text-slate-400">{application.studentId}</p>
                    </div>
                    <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-[0.7rem] font-semibold text-fuchsia-200">
                      {application.interest}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.75rem] text-slate-200">{application.note}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.7rem] text-slate-400">
                    <span>Nộp ngày {application.submittedAt}</span>
                    <div className="flex gap-2 text-xs">
                      <button className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-emerald-100 hover:bg-emerald-500/20">
                        Approve
                      </button>
                      <button className="rounded-xl border border-rose-400/50 bg-rose-500/10 px-3 py-1 text-rose-100 hover:bg-rose-500/20">
                        Reject
                      </button>
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-slate-100 hover:bg-white/10">
                        Gửi tin nhắn
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 text-xs text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Pipeline hoạt động</h3>
              <span className="text-[0.7rem] text-slate-400">3 hoạt động trong 30 ngày tới</span>
            </div>
            <div className="mt-4 space-y-3">
              {activityPipeline.map((activity) => (
                <div
                  key={activity.title}
                  className="rounded-xl border border-white/8 bg-white/5 px-3 py-3 text-[0.75rem]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{activity.title}</p>
                      <p className="mt-0.5 text-[0.7rem] text-slate-300">
                        {activity.schedule} • {activity.location}
                      </p>
                      <p className="mt-1 text-[0.7rem] text-slate-400">
                        Ngân sách: <span className="font-medium text-slate-100">{activity.budget}</span> • Phí:{' '}
                        <span className="font-medium text-slate-100">{activity.fee}</span>
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[0.7rem] font-semibold text-emerald-200">
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Finance & fee tracking */}
        <section className="grid gap-4 lg:grid-cols-[1.1fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 text-xs text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Tài chính nổi bật</h3>
              <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] text-slate-100 hover:bg-white/10">
                Mở màn hình tài chính
              </button>
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
                <p className="text-[0.7rem] text-slate-400">
                  Nắm nhanh ai đã đóng, ai cần nhắc thêm một lần nữa.
                </p>
              </div>
              <button className="rounded-full border border-emerald-300/50 bg-emerald-500/10 px-3 py-1 text-[0.7rem] font-medium text-emerald-100 hover:bg-emerald-500/20">
                Xuất file Excel
              </button>
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


