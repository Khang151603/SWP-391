import LeaderLayout from '../../components/layout/LeaderLayout';
import { activityPipeline } from './leaderData';

function ClubLeaderActivitiesPage() {
  return (
    <LeaderLayout
      title="Quản lý hoạt động & sự kiện"
      subtitle="Tạo, cập nhật và truyền thông hoạt động nội bộ nhanh chóng"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Tạo hoạt động mới</h3>
              <p className="text-sm text-slate-400">Ghi rõ thời gian, địa điểm, yêu cầu thu phí (nếu có)</p>
            </div>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90">
              Gửi thông báo
            </button>
          </div>
          <form className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="text-sm text-slate-300">
              Tên hoạt động
              <input
                placeholder="Ví dụ: Media Camp 2025"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300">
              Thời gian
              <input
                placeholder="20/12/2025 • 18:00"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300">
              Địa điểm
              <input
                placeholder="Sân vận động trường"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300">
              Thu phí (tuỳ chọn)
              <input
                placeholder="Ví dụ: 200.000đ/người"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300 lg:col-span-2">
              Nội dung chính
              <textarea
                placeholder="Mô tả mục tiêu, hạng mục chuẩn bị và KPIs..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
                rows={4}
              />
            </label>
          </form>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">Lưu nháp</button>
            <button className="rounded-2xl bg-fuchsia-500/90 px-4 py-2 font-semibold text-white hover:bg-fuchsia-500">Tạo hoạt động</button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Pipeline hoạt động</h3>
              <p className="text-sm text-slate-400">Theo dõi tiến độ - ngân sách - phân công ban phụ trách</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">Lịch tháng</button>
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">
                Template phân công
              </button>
              <button className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-white/90">
                Đồng bộ Google Calendar
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {activityPipeline.map((activity) => (
              <div key={activity.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{activity.title}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{activity.status}</p>
                  </div>
                  <button className="text-xs text-fuchsia-200 hover:text-white">Chỉnh sửa</button>
                </div>
                <p className="mt-2 text-sm text-slate-300">{activity.schedule}</p>
                <p className="text-sm text-slate-400">{activity.location}</p>
                <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm">
                  <p>Ngân sách dự kiến: {activity.budget}</p>
                  <p>Thu phí: {activity.fee}</p>
                  <div className="flex gap-2 text-xs text-slate-400">
                    <span className="rounded-full border border-white/10 px-2 py-1">Checklist</span>
                    <span className="rounded-full border border-white/10 px-2 py-1">Thông báo</span>
                    <span className="rounded-full border border-white/10 px-2 py-1">Phân công</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderActivitiesPage;


