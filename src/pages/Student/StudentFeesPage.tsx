import StudentLayout from '../../components/layout/StudentLayout';
import { feeSummary } from './studentData';

function StudentFeesPage() {
  return (
    <StudentLayout
      title="Lịch sử giao dịch"
      subtitle="Theo dõi chi tiết các khoản thu chi, hoàn ứng và đóng hội phí của bạn trong CLB"
    >
      <div className="space-y-6">
        {/* Summary / filter bar */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Số dư hiện tại</p>
                <p className="mt-1 text-base font-semibold text-white">{feeSummary.currentBalance}</p>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Khoản cần đóng</p>
                <p className="mt-1 text-base font-semibold text-amber-200">
                  {feeSummary.pendingAmount || '0đ'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs text-slate-400">Xem theo</label>
              <select className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-500/70">
                <option>Tất cả giao dịch</option>
                <option>Chỉ khoản phải trả</option>
                <option>Chỉ khoản hoàn ứng</option>
              </select>
              <button className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-100 hover:border-fuchsia-400 hover:text-white">
                Xuất báo cáo
              </button>
            </div>
          </div>
        </section>

        {/* History list */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-white">Lịch sử giao dịch</h2>
              <p className="mt-1 text-xs text-slate-400">
                Dữ liệu gần đây nhất được đồng bộ từ hệ thống tài chính CLB
              </p>
            </div>
          </div>

          {feeSummary.history.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
              Chưa có giao dịch nào được ghi nhận. Khi bạn đóng hội phí hoặc hoàn ứng hoạt động, lịch sử sẽ hiển thị tại đây.
            </div>
          ) : (
            <ul className="mt-5 space-y-3 text-sm text-slate-200">
              {feeSummary.history.map((item) => {
                const isIncome = item.amount.startsWith('+');
                return (
                  <li
                    key={item.title + item.date}
                    className="group rounded-2xl border border-white/5 bg-gradient-to-r from-slate-900/70 via-slate-900/60 to-slate-900/40 p-4 transition hover:border-fuchsia-400/70 hover:bg-slate-900/90"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-2xl bg-slate-800/80 text-xs font-semibold text-slate-200 shadow-inner shadow-slate-900/70 flex items-center justify-center">
                          {item.date}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{item.status}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 md:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/40'
                              : 'bg-fuchsia-500/10 text-fuchsia-200 ring-1 ring-fuchsia-400/40'
                          }`}
                        >
                          {item.amount}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </StudentLayout>
  );
}

export default StudentFeesPage;



