import LeaderLayout from '../../components/layout/LeaderLayout';
import { activityPipeline, clubMetrics, financeOverview, pendingApplications } from './leaderData';

function ClubLeaderDashboardPage() {
  return (
    <LeaderLayout title="Dashboard điều hành" subtitle="Theo dõi nhịp độ CLB trong một cái nhìn tổng quan">
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-600/30 via-slate-950 to-slate-950 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">CLB Truyền thông</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Xin chào Leader Khang! 🚀</h2>
              <p className="text-sm text-slate-200">
                Hôm nay có 3 đơn đăng ký đang chờ duyệt và Media Cup cần khóa danh sách tham gia trước 17:00.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-right text-sm text-white/80">
              <p>Chỉ số sức khỏe CLB</p>
              <p className="text-3xl font-semibold text-white">8.6/10</p>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">ổn định</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {clubMetrics.map((metric) => (
            <div key={metric.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.title}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
              <p className="text-sm text-emerald-300">{metric.change}</p>
              <p className="text-xs text-slate-400">{metric.highlight}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Đơn đăng ký chờ xử lý</h3>
              <button className="text-sm text-fuchsia-200 hover:text-white">Xem tất cả</button>
            </div>
            <div className="mt-4 space-y-4">
              {pendingApplications.map((application) => (
                <div key={application.studentId} className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-white">{application.name}</p>
                      <p className="text-slate-400">{application.studentId}</p>
                    </div>
                    <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-200">
                      {application.interest}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{application.note}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Nộp ngày {application.submittedAt}</span>
                    <div className="flex gap-2 text-sm">
                      <button className="rounded-xl border border-white/10 px-3 py-1 text-emerald-300 hover:bg-emerald-500/10">
                        Approve
                      </button>
                      <button className="rounded-xl border border-white/10 px-3 py-1 text-rose-300 hover:bg-rose-500/10">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/80 p-5">
            <h3 className="text-lg font-semibold text-white">Tài chính nổi bật</h3>
            <div className="mt-4 space-y-3">
              {financeOverview.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="text-sm text-emerald-300">{item.trend}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/5 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Hoạt động trong pipeline</h3>
              <p className="text-sm text-slate-400">Theo dõi tiến độ, ngân sách và tình trạng thu phí</p>
            </div>
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10">
              Xuất timeline
            </button>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {activityPipeline.map((activity) => (
              <div key={activity.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{activity.title}</p>
                  <span className="text-xs text-slate-400">{activity.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{activity.schedule}</p>
                <p className="text-sm text-slate-400">{activity.location}</p>
                <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm">
                  <p>Ngân sách: {activity.budget}</p>
                  <p>Thu phí: {activity.fee}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderDashboardPage;


