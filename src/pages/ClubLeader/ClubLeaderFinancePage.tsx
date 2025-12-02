import LeaderLayout from '../../components/layout/LeaderLayout';
import { feeTracking, financeOverview } from './leaderData';

function ClubLeaderFinancePage() {
  return (
    <LeaderLayout
      title="Quản lý tài chính & thu phí"
      subtitle="Thiết lập mức phí, theo dõi tình trạng đóng và ghi nhận thủ công"
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-3">
          {financeOverview.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
              <p className="text-sm text-emerald-300">{item.trend}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Thiết lập mức phí</h3>
              <p className="text-sm text-slate-400">Áp dụng cho hoạt động cụ thể hoặc phí thành viên định kỳ</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">
                Tạo mẫu thu phí
              </button>
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">
                Gửi nhắc nhở
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <label className="text-sm text-slate-300">
              Tên khoản phí
              <input
                placeholder="Ví dụ: Hội phí định kỳ 2025"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300">
              Mức phí
              <input
                placeholder="300.000đ"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300">
              Hạn đóng
              <input
                placeholder="25/12/2025"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300 lg:col-span-3">
              Ghi chú / Yêu cầu chứng từ
              <textarea
                placeholder="Ví dụ: upload biên lai chuyển khoản, chọn ngân hàng quỹ CLB..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
                rows={3}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-3 text-sm">
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">Lưu nháp</button>
            <button className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-white/90">
              Công bố tới thành viên
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Theo dõi đóng phí</h3>
              <p className="text-sm text-slate-400">Cập nhật trạng thái thủ công hoặc đồng bộ file kế toán</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">Import Excel</button>
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">
                Gửi nhắc nợ
              </button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Thành viên</th>
                  <th className="px-4 py-3">Hoạt động / Quỹ</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Hạn đóng</th>
                  <th className="px-4 py-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {feeTracking.map((fee) => (
                  <tr key={`${fee.member}-${fee.activity}`} className="border-t border-white/5">
                    <td className="px-4 py-3 text-white">{fee.member}</td>
                    <td className="px-4 py-3">{fee.activity}</td>
                    <td className="px-4 py-3">{fee.amount}</td>
                    <td className="px-4 py-3">{fee.dueDate}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          fee.status === 'Đã đóng'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : fee.status === 'Đang xử lý'
                              ? 'bg-amber-500/10 text-amber-200'
                              : 'bg-rose-500/10 text-rose-200'
                        }`}
                      >
                        {fee.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderFinancePage;


