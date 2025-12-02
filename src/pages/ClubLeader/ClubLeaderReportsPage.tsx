import LeaderLayout from '../../components/layout/LeaderLayout';
import { exportTemplates, reportHighlights } from './leaderData';

function ClubLeaderReportsPage() {
  return (
    <LeaderLayout
      title="Báo cáo & xuất dữ liệu"
      subtitle="Truy xuất thông tin thành viên, hoạt động và tài chính trong vài thao tác"
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/20 via-slate-950 to-slate-950 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-200">Snapshot tháng 11</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Báo cáo tổng hợp đã sẵn sàng</h2>
              <p className="text-sm text-slate-200">
                Tăng trưởng thành viên vượt 18% và tỷ lệ tham gia hoạt động đạt mức cao nhất trong 2 năm.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">
                Gửi email Ban điều hành
              </button>
              <button className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-white/90">
                Xuất PDF
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {reportHighlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
              <p className="text-sm text-slate-300">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Xuất dữ liệu chi tiết</h3>
              <p className="text-sm text-slate-400">Chọn định dạng CSV, XLSX hoặc đồng bộ Google Sheet</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">CSV</button>
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">XLSX</button>
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">
                Đồng bộ Google Sheet
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {exportTemplates.map((template) => (
              <div key={template.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="text-white">{template.name}</p>
                <p className="mt-2 text-slate-400">{template.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-full border border-amber-400/30 px-3 py-1 text-xs text-amber-200">Xem preview</button>
                  <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white">Xuất ngay</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Log hoạt động & audit</h3>
              <p className="text-sm text-slate-400">
                Theo dõi thay đổi quan trọng: chỉnh sửa thông tin CLB, cập nhật tài chính, phân công vai trò
              </p>
            </div>
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10">
              Xuất log 30 ngày
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p>
                <span className="text-white">09:20 • 01/12</span> - Leader Khang cập nhật mức phí Media Cup 2025.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p>
                <span className="text-white">19:45 • 30/11</span> - Phó Leader Chi duyệt 4 đơn đăng ký ban Nội dung.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p>
                <span className="text-white">15:10 • 29/11</span> - Leader Khang xuất báo cáo tài chính gửi cố vấn.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderReportsPage;


