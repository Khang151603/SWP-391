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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Student dashboard
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Thống kê tham gia hoạt động của bạn
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Nắm nhanh số lượng câu lạc bộ đang tham gia, tổng số hoạt động đã đăng ký
                và mức độ hoàn thành để quản lý thời gian hiệu quả hơn.
              </p>
            </div>
          </div>
        </div>

        {/* Main stats cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Tổng CLB */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Câu lạc bộ của tôi
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{totalClubs}</p>
                <p className="mt-2 text-xs text-slate-600">
                  Số lượng CLB bạn đang tham gia và cần theo dõi lịch hoạt động.
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-200">
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
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Hoạt động của tôi
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalActivities}
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Tổng số hoạt động mà bạn đã đăng ký hoặc được phân công
                  trong các câu lạc bộ.
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-200">
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
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Hoạt động đã hoàn thành
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {completedActivities}
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Số hoạt động bạn đã tham gia đầy đủ và được ghi nhận hoàn thành.
                </p>
              </div>
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 group-hover:bg-emerald-200">
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
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Tiến độ hoàn thành</span>
                <span className="font-semibold text-emerald-700">
                  {completionRate}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-emerald-600 transition-all"
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



