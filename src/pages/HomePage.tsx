import { Link } from 'react-router-dom';


const clubs = [
  {
    id: 1,
    name: 'CLB Lập trình Sáng tạo',
    description: 'Nơi kết nối các lập trình viên đam mê công nghệ, tổ chức workshop, hackathon và các dự án thực tế.',
    members: 245,
    activities: 12,
    category: 'Công nghệ',
    status: 'Đang tuyển thành viên',
    icon: '💻',
    monthlyFee: 50000,
  },
  {
    id: 2,
    name: 'CLB Trí tuệ Nhân tạo',
    description: 'Khám phá và ứng dụng AI/ML trong các dự án thực tế, tham gia cuộc thi quốc tế và nghiên cứu khoa học.',
    members: 180,
    activities: 8,
    category: 'Công nghệ',
    status: 'Đang tuyển thành viên',
    icon: '🤖',
    monthlyFee: 60000,
  },
  {
    id: 3,
    name: 'CLB Truyền thông',
    description: 'Phát triển kỹ năng truyền thông, sản xuất nội dung, quản lý mạng xã hội và tổ chức sự kiện.',
    members: 320,
    activities: 15,
    category: 'Truyền thông',
    status: 'Đang tuyển thành viên',
    icon: '📱',
    monthlyFee: 40000,
  },
  {
    id: 4,
    name: 'CLB Thiết kế',
    description: 'Nơi giao lưu và học hỏi về thiết kế đồ họa, UI/UX, branding và các xu hướng thiết kế hiện đại.',
    members: 156,
    activities: 10,
    category: 'Nghệ thuật',
    status: 'Đang tuyển thành viên',
    icon: '🎨',
    monthlyFee: 45000,
  },
  {
    id: 5,
    name: 'CLB Kinh doanh',
    description: 'Phát triển tư duy kinh doanh, khởi nghiệp, networking với doanh nhân và tham gia các cuộc thi startup.',
    members: 210,
    activities: 9,
    category: 'Kinh doanh',
    status: 'Đang tuyển thành viên',
    icon: '💼',
    monthlyFee: 55000,
  },
  {
    id: 6,
    name: 'CLB Công nghệ',
    description: 'Cập nhật công nghệ mới nhất, tham gia các dự án open source và xây dựng cộng đồng developer.',
    members: 298,
    activities: 14,
    category: 'Công nghệ',
    status: 'Đang tuyển thành viên',
    icon: '⚡',
    monthlyFee: 0,
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-slate-900 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-12">
          <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 backdrop-blur-xl shadow-2xl shadow-violet-900/20">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-gradient-to-tr from-purple-500/15 to-pink-500/15 blur-2xl" />
            </div>
            
            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              {/* Logo and Brand Section */}
              <div className="flex items-center gap-5">
                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-4 ring-2 ring-white/20 backdrop-blur-sm">
                    <span className="text-2xl font-bold bg-gradient-to-r from-white via-violet-100 to-fuchsia-100 bg-clip-text text-transparent">
                      SCMS
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fuchsia-300/90">
                    Student Club Management System
                  </p>
                  <p className="text-lg font-semibold text-white">
                    Nền tảng quản trị câu lạc bộ
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-lg hover:shadow-violet-500/20"
                >
                  <span className="relative z-10">Đăng nhập</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-fuchsia-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
                <Link 
                  to="/register" 
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-500/40"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Đăng ký tài khoản</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </div>
            </div>
          </header>

          <section className="mt-12">
            <div className="space-y-6 text-center">
              <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
                Quản lý câu lạc bộ trong trường đại học
              </h1>
            </div>
          </section>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl space-y-16 px-6 py-12">
        <section id="clubs" className="space-y-10">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-200">CÂU LẠC BỘ</p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Tham gia câu lạc bộ phù hợp với bạn</h2>
            <p className="mx-auto max-w-3xl text-base text-slate-300">
              Khám phá các câu lạc bộ đang hoạt động trong trường, tìm hiểu về hoạt động và đăng ký tham gia ngay hôm nay.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-violet-400/60"
              >
                <div className="absolute inset-0 opacity-0 blur-3xl transition group-hover:opacity-30" style={{ background: 'radial-gradient(circle at top, rgba(139,92,246,0.4), transparent 60%)' }} />
                <div className="relative">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{club.name}</h3>
                    <span className="inline-block rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                      {club.category}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-slate-300 line-clamp-2">{club.description}</p>
                  <div className="mb-4 flex items-center gap-4 text-sm text-slate-400">
                    <span>{club.members} thành viên</span>
                    <span>•</span>
                    <span>{club.activities} hoạt động</span>
                  </div>
                  <div className="mb-4 rounded-lg bg-amber-500/10 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Phí tham gia</span>
                      <span className="text-sm font-semibold text-amber-300">
                        {club.monthlyFee === 0 ? (
                          <span className="text-emerald-400">Miễn phí</span>
                        ) : (
                          <span>{club.monthlyFee.toLocaleString('vi-VN')} ₫/tháng</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2">
                    <p className="text-xs font-medium text-emerald-300">{club.status}</p>
                  </div>
                  <Link
                    to="/register"
                    className="block w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/50"
                  >
                    Tham gia ngay
                  </Link>
                </div>
              </div>
            ))}
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


