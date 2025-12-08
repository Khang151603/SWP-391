import StudentLayout from '../../components/layout/StudentLayout';

function StudentDashboardPage() {
  // TODO: thay 3 giá trị mock bên dưới bằng dữ liệu thật từ API / context
  const totalClubs = 3;            // Tổng số CLB của tôi
  const totalActivities = 12;      // Tổng số hoạt động của tôi
  const completedActivities = 8;   // Số hoạt động đã hoàn thành

  const completionRate =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  return (
    <StudentLayout
      title="Tổng quan"
      subtitle="Thống kê nhanh về câu lạc bộ và hoạt động của bạn"
    >
      <div className="space-y-6">
        {/* Header banner */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600/25 via-fuchsia-600/20 to-emerald-500/20 p-6 md:p-7 backdrop-blur-sm border border-white/10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-200/80">
                Student dashboard
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Thống kê tham gia hoạt động của bạn
              </h2>
              <p className="text-sm text-slate-200/90 max-w-xl">
                Nắm nhanh số lượng câu lạc bộ đang tham gia, tổng số hoạt động đã đăng ký
                và mức độ hoàn thành để quản lý thời gian hiệu quả hơn.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3 border border-white/10">
            </div>
          </div>
        </div>

        {/* Main stats cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Tổng CLB */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-violet-400/60 hover:bg-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Câu lạc bộ của tôi
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{totalClubs}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Số lượng CLB bạn đang tham gia và cần theo dõi lịch hoạt động.
                </p>
              </div>
              <div className="rounded-xl bg-violet-500/20 p-3 text-violet-300 group-hover:bg-violet-500/30">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tổng hoạt động */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-fuchsia-400/60 hover:bg-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Hoạt động của tôi
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {totalActivities}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Tổng số hoạt động mà bạn đã đăng ký hoặc được phân công
                  trong các câu lạc bộ.
                </p>
              </div>
              <div className="rounded-xl bg-fuchsia-500/20 p-3 text-fuchsia-300 group-hover:bg-fuchsia-500/30">
                <svg
                  className="h-6 w-6"
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
            </div>
          </div>

          {/* Hoạt động hoàn thành */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-emerald-400/60 hover:bg-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Hoạt động đã hoàn thành
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {completedActivities}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Số hoạt động bạn đã tham gia đầy đủ và được ghi nhận hoàn thành.
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-300 group-hover:bg-emerald-500/30">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* mini progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Tiến độ hoàn thành</span>
                <span className="font-semibold text-emerald-300">
                  {completionRate}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentDashboardPage;



