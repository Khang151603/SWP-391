import StudentLayout from '../../components/layout/StudentLayout';
import { feeSummary } from './studentData';

const reminders = [
  { title: 'Hội phí CLB Truyền thông', due: '25/12', amount: '450.000đ', status: 'Chưa thanh toán' },
  { title: 'Ủng hộ chiến dịch Green Campus', due: '04/01', amount: '150.000đ', status: 'Tuỳ chọn' },
];

function StudentFeesPage() {
  return (
    <StudentLayout title="Tài chính & phí" subtitle="Minh bạch dòng tiền CLB, nhắc nhở đóng phí và lịch sử giao dịch">
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Hạn thanh toán tiếp theo</p>
            <p className="text-2xl font-semibold text-white">{feeSummary.nextDeadline}</p>
            <p className="text-sm text-slate-300">
              Còn <span className="font-semibold text-white">14 ngày</span> để hoàn tất học phí CLB.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Số tiền cần đóng</p>
            <p className="text-2xl font-semibold text-white">{feeSummary.pendingAmount}</p>
            <button className="mt-3 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white">
              Thanh toán ngay
            </button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Lịch sử giao dịch</h2>
              <button className="text-sm text-fuchsia-200 hover:text-white">Xuất báo cáo</button>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {feeSummary.history.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">
                        {item.date} · {item.status}
                      </p>
                    </div>
                    <span className={item.amount.startsWith('+') ? 'text-emerald-300' : 'text-fuchsia-300'}>{item.amount}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Nhắc nhở</h2>
            <div className="mt-4 space-y-4">
              {reminders.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-300">{item.title}</p>
                  <p className="text-xs text-slate-500">Hạn: {item.due}</p>
                  <p className="text-lg font-semibold text-white">{item.amount}</p>
                  <p className="text-xs text-amber-200">{item.status}</p>
                  <button className="mt-3 w-full rounded-xl border border-white/15 px-3 py-2 text-sm text-white hover:bg-white/10">
                    Đánh dấu đã thanh toán
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}

export default StudentFeesPage;



