import LeaderLayout from '../../components/layout/LeaderLayout';
import { activityPipeline } from './leaderData';

function ClubLeaderActivitiesPage() {
  return (
    <LeaderLayout
      title="Quản lý hoạt động & sự kiện"
      subtitle="Lên kế hoạch, theo dõi tiến độ và truyền thông hoạt động nội bộ trong một màn hình."
    >
      <div className="space-y-6">
        {/* Tạo hoạt động mới */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-100/80">Lên kế hoạch</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Tạo hoạt động mới</h3>
              <p className="mt-1 text-sm text-slate-400">
                Điền nhanh các thông tin bắt buộc trước, chi tiết nội dung có thể cập nhật sau.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10">
                Lưu nháp bản hiện tại
              </button>
            </div>
          </div>

          <form className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-200">
              Tên hoạt động
              <input
                placeholder="Ví dụ: Media Camp 2025"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
              />
            </label>

            <label className="text-sm text-slate-200">
              Thời gian dự kiến
              <input
                placeholder="20/12/2025 • 18:00"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
              />
            </label>

            <label className="text-sm text-slate-200">
              Địa điểm
              <input
                placeholder="Ví dụ: Hội trường lớn, sân vận động trường..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
              />
            </label>

            <label className="text-sm text-slate-200">
              Thu phí (tuỳ chọn)
              <input
                placeholder="Ví dụ: 200.000đ/người hoặc 'Miễn phí'"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
              />
            </label>

            <label className="text-sm text-slate-200 md:col-span-2">
              Nội dung chính
              <textarea
                placeholder="Mô tả mục tiêu, nhóm đối tượng tham gia, các hạng mục chuẩn bị và KPIs dự kiến..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                rows={4}
              />
            </label>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <button className="rounded-2xl bg-fuchsia-500/90 px-4 py-2 font-semibold text-white hover:bg-fuchsia-500">
              Tạo hoạt động
            </button>
          </div>
        </section>

        {/* Pipeline hoạt động */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 lg:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Danh sách hoạt động</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10">
                Xem theo lịch tháng
              </button>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10">
                Template phân công
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {activityPipeline.map((activity) => (
              <article
                key={activity.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 transition hover:border-fuchsia-400/60 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{activity.title}</p>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">{activity.status}</p>
                  </div>
                  <button className="rounded-full border border-white/15 bg-slate-900/60 px-3 py-1 text-[0.7rem] text-slate-100 hover:bg-slate-900">
                    Chỉnh sửa
                  </button>
                </div>

                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <p>
                    <span className="text-slate-400">Thời gian: </span>
                    {activity.schedule}
                  </p>
                  <p>
                    <span className="text-slate-400">Địa điểm: </span>
                    {activity.location}
                  </p>
                </div>

                <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-xs">
                  <p>
                    <span className="text-slate-400">Ngân sách dự kiến: </span>
                    <span className="font-medium text-slate-100">{activity.budget}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Thu phí: </span>
                    <span className="font-medium text-slate-100">{activity.fee}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[0.7rem] text-slate-300">
                    <span className="rounded-full border border-white/12 bg-slate-900/70 px-2.5 py-1">
                      Checklist hạng mục
                    </span>
                    <span className="rounded-full border border-white/12 bg-slate-900/70 px-2.5 py-1">Thông báo</span>
                    <span className="rounded-full border border-white/12 bg-slate-900/70 px-2.5 py-1">Phân công</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderActivitiesPage;


