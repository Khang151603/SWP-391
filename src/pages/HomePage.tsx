import { Link } from 'react-router-dom';

const icons = {
  members: (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-violet-300" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M16 10a4 4 0 1 0-8 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20.5c0-3.5 3.5-5.5 8-5.5s8 2 8 5.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="7" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="7" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  activities: (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-fuchsia-300" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12h18M3 6h12M3 18h12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 20v-8l3 2.5L18 17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  finance: (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="6" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10h3M7 14h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 10v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  approval: (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v18M5 9l7-6 7 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15h14l-2 6H7l-2-6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const stats = [
  { label: 'Thành viên đang hoạt động', value: '1.240', trend: '+8% QoQ' },
  { label: 'Hoạt động / học kỳ', value: '32', trend: '100% đúng hạn' },
  { label: 'Tổng quỹ đã thu', value: '215 triệu', trend: '+25% so với cùng kỳ' },
  { label: 'Đơn phê duyệt xử lý', value: '98%', trend: '< 24h/phê duyệt' },
];

const features = [
  {
    title: 'Quản lý thành viên',
    description: 'Hồ sơ số hóa, phân nhóm, nhắc nhở chuyên cần và hạn nộp phí minh bạch.',
    stats: '1.240 hồ sơ đang đồng bộ',
    tags: ['Check-in sự kiện', 'Gia hạn thẻ', 'Báo cáo điểm rèn luyện'],
    icon: icons.members,
  },
  {
    title: 'Hoạt động & lịch trình',
    description: 'Lập kế hoạch, giao nhiệm vụ và theo dõi KPI cho từng hoạt động chỉ trên một bảng.',
    stats: '32 hoạt động/ học kỳ',
    tags: ['Timeline tự động', 'Checklist tổ chức', 'Báo cáo sau sự kiện'],
    icon: icons.activities,
  },
  {
    title: 'Thu phí & quỹ CLB',
    description: 'Quản lý các gói hội phí, trạng thái thanh toán và báo cáo thu chi realtime.',
    stats: '215.000.000đ quỹ minh bạch',
    tags: ['Ủy quyền chi', 'Đối soát ngân hàng', 'Nhắc phí tự động'],
    icon: icons.finance,
  },
  {
    title: 'Phê duyệt đa cấp',
    description: 'Chuẩn hóa quy trình duyệt đơn gia nhập, đề xuất sự kiện.',
    stats: '98% đơn xử lý < 24h',
    tags: ['Mẫu đơn tùy biến', 'Lưu chữ ký số', 'Nhật ký quyết định'],
    icon: icons.approval,
  },
];

const activityHighlights = [
  {
    title: 'Tuần lễ Tân sinh viên',
    metrics: '320+ đơn tham gia',
    progress: 'Đang mở đăng ký',
    owner: 'Ban Truyền thông',
  },
  {
    title: 'Workshop Lãnh đạo trẻ',
    metrics: '120/150 suất',
    progress: '80% checklist hoàn tất',
    owner: 'Ban Nội dung',
  },
  {
    title: 'Giải chạy gây quỹ 2025',
    metrics: '62 triệu đã tài trợ',
    progress: 'Ký kết nhà tài trợ',
    owner: 'Ban Đối ngoại',
  },
];

const approvalFlow = [
  { step: '01', title: 'Tiếp nhận', detail: 'Biểu mẫu online chuẩn hoá theo từng loại đơn.' },
  { step: '02', title: 'Đánh giá', detail: 'Giao người phụ trách, thêm comment và checklist.' },
  { step: '03', title: 'Phê duyệt', detail: 'Ký số, phản hồi tự động qua email & app.' },
  { step: '04', title: 'Lưu vết', detail: 'Nhật ký quyết định và báo cáo phân tích tức thời.' },
];

const feePlans = [
  {
    title: 'Hội phí cơ bản',
    price: '150.000đ/học kỳ',
    benefits: ['Miễn phí hoạt động nội bộ', 'Bảo hiểm cơ bản', 'Ưu đãi tài liệu'],
  },
  {
    title: 'Gói Ban điều hành',
    price: '250.000đ/học kỳ',
    benefits: ['Ngân sách đào tạo riêng', 'Báo cáo hiệu suất cá nhân', 'Tạm ứng nhanh trong 2h'],
  },
];

const requestInsights = [
  {
    title: 'Đơn gia nhập CLB',
    count: '87 đơn mới',
    status: '72% đã duyệt',
    detail: 'Tự động kiểm tra thông tin sinh viên và hạn chế trùng lặp.',
  },
  {
    title: 'Mượn thiết bị & cơ sở vật chất',
    count: '24 yêu cầu',
    status: '100% có biên bản',
    detail: 'Theo dõi bàn giao bằng mã QR, giảm thất thoát còn 0%.',
  },
  {
    title: 'Đề xuất hoạt động ngoại khóa',
    count: '12 đề xuất',
    status: '8 hoạt động đã lịch',
    detail: 'Quy trình phê duyệt đa cấp, nhắc deadline cho từng người ký.',
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-slate-900 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-12">
          <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/30">
                <span className="text-xl font-bold text-white">SCMS</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest text-fuchsia-200">Student Club Management System</p>
                <p className="text-base font-medium text-white">Nền tảng quản trị câu lạc bộ toàn diện</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-slate-300 md:text-base">
              <a href="#features" className="transition hover:text-white">Tính năng</a>
              <a href="#activities" className="transition hover:text-white">Hoạt động</a>
              <a href="#finance" className="transition hover:text-white">Thu phí</a>
              <a href="#approvals" className="transition hover:text-white">Phê duyệt</a>
            </nav>
            <div className="flex gap-3">
              <Link to="/login" className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Đăng nhập
              </Link>
              <Link to="/register" className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-105">
                Đăng ký CLB
              </Link>
            </div>
          </header>

          <section className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-fuchsia-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                CLB trong trường đại học - phiên bản 2025
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
                Quản lý thành viên, hoạt động và quỹ CLB trên một nền tảng duy nhất
              </h1>
              <p className="text-lg text-slate-300">
                Student Club Management System (SCMS) giúp ban điều hành tự động hóa quy trình, nâng cao trải nghiệm thành viên và minh bạch hóa mọi quyết định chỉ với vài cú nhấp chuột.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-xl shadow-white/20 transition hover:translate-y-0.5">
                  Khởi tạo CLB trong 5 phút
                </Link>
                <a href="#features" className="rounded-2xl border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                  Tải brochure
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm uppercase tracking-wider text-slate-400">{item.label}</p>
                    <p className="text-3xl font-semibold text-white">{item.value}</p>
                    <p className="text-sm text-emerald-300">{item.trend}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet-500/50 to-fuchsia-500/30 blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-widest text-slate-400">Tình trạng CLB</p>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">Realtime</span>
                </div>
                <div className="space-y-4">
                  {activityHighlights.map((activity) => (
                    <div key={activity.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-semibold text-white">{activity.title}</p>
                        <span className="text-xs text-slate-400">{activity.owner}</span>
                      </div>
                      <p className="text-sm text-slate-300">{activity.metrics}</p>
                      <p className="text-sm text-fuchsia-200">{activity.progress}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-600/30 to-violet-600/30 p-4 text-sm text-slate-100">
                  <p className="font-semibold">Nhắc bạn:</p>
                  <p>Hạn chốt báo cáo tháng 12 còn 02 ngày • 3 đơn phê duyệt cần ký.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl space-y-20 px-6 py-16">
        <section id="features" className="space-y-10">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-200">TÍNH NĂNG CHỦ LỰC</p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Xử lý mọi nghiệp vụ CLB tại một nơi</h2>
            <p className="mx-auto max-w-3xl text-base text-slate-300">
              SCMS được thiết kế riêng cho môi trường đại học Việt Nam, hỗ trợ nhiều ban chuyên môn và cấp phê duyệt khác nhau mà vẫn dễ dùng cho sinh viên mới.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <article key={feature.title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-fuchsia-400/60">
                <div className="absolute inset-0 opacity-0 blur-3xl transition group-hover:opacity-40" style={{ background: 'radial-gradient(circle at top, rgba(216,180,254,0.4), transparent 60%)' }} />
                <div className="relative flex items-center gap-4">
                  <span className="rounded-2xl border border-white/10 bg-white/5 p-3">{feature.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.stats}</p>
                  </div>
                </div>
                <p className="relative mt-4 text-base text-slate-300">{feature.description}</p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="activities" className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Hoạt động trọng tâm</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Lịch trình thông minh, cộng tác realtime</h2>
            <p className="mt-4 text-base text-slate-300">
              Tạo hoạt động, phân nhiệm vụ và theo dõi tiến độ theo thời gian thực. Toàn bộ checklist, tài liệu, ngân sách đều được liên kết trong một bảng điều khiển.
            </p>
            <div className="mt-8 space-y-5">
              {activityHighlights.map((activity) => (
                <div key={activity.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">{activity.title}</p>
                    <span className="text-xs text-slate-400">{activity.owner}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                    <span>{activity.metrics}</span>
                    <span className="text-fuchsia-200">{activity.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Workflow</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Timeline từng ban</h3>
            <ul className="mt-6 space-y-6">
              {['Ban Nội dung', 'Ban Sự kiện', 'Ban Đối ngoại', 'Ban Hậu cần'].map((team) => (
                <li key={team} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-500" />
                  {team}: 100% nhiệm vụ đồng bộ với Google Calendar, Notion và Microsoft Teams.
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="finance" className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Thu phí & quỹ</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Tự động hóa thu phí, minh bạch chi tiêu</h2>
            <p className="mt-4 text-base text-slate-300">
              Kết nối cổng thanh toán, tạo gói hội phí linh hoạt và nhận cảnh báo khi có khoản thu chi bất thường. Bảng điều khiển tài chính realtime và xuất báo cáo PDF trong một cú nhấp.
            </p>
            <div className="mt-6 space-y-4">
              {feePlans.map((plan) => (
                <div key={plan.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">{plan.title}</p>
                    <p className="text-sm text-emerald-200">{plan.price}</p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-200">Dashboard tài chính</p>
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase text-slate-400">Tổng quỹ hiện tại</p>
                <p className="mt-2 text-3xl font-semibold text-white">215.000.000đ</p>
                <p className="text-sm text-emerald-300">+25% so với cùng kỳ 2024</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase text-slate-400">Chi tiêu tháng 11</p>
                <p className="mt-2 text-3xl font-semibold text-white">38.500.000đ</p>
                <p className="text-sm text-orange-300">35% ngân sách cho hoạt động thiện nguyện</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase text-slate-400">Nhắc phí còn lại</p>
                <p className="mt-2 text-3xl font-semibold text-white">26 thành viên</p>
                <p className="text-sm text-slate-300">Tự động gửi email + Zalo OA vào 8h hằng ngày</p>
              </div>
            </div>
          </div>
        </section>

        <section id="approvals" className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Quy trình phê duyệt</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Không còn email lòng vòng</h2>
            <div className="mt-8 space-y-6">
              {approvalFlow.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="text-3xl font-semibold text-fuchsia-300">{step.step}</div>
                  <div>
                    <p className="text-lg font-semibold text-white">{step.title}</p>
                    <p className="text-sm text-slate-300">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/5 to-transparent p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-200">Đơn & insight</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {requestInsights.map((request) => (
                <div key={request.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-sm text-slate-400">{request.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{request.count}</p>
                  <p className="text-sm text-emerald-300">{request.status}</p>
                  <p className="mt-3 text-sm text-slate-300">{request.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/40 via-fuchsia-500/30 to-rose-500/30 px-8 py-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">Sẵn sàng vận hành thế hệ CLB tiếp theo</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Triển khai SCMS cho CLB của bạn chỉ trong 5 phút</h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-white/80">
            Được hơn 40 CLB trong trường đại học áp dụng. Tích hợp Google Workspace, Microsoft 365, Zalo OA và hệ thống quản lý sinh viên của trường.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button className="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5">
              Đặt lịch tư vấn
            </button>
            <button className="rounded-2xl border border-white/60 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10">
              Xem demo tương tác
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/70 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} SCMS • Giải pháp quản lý câu lạc bộ dành cho sinh viên Việt Nam.
      </footer>
    </div>
  );
}

export default HomePage;


