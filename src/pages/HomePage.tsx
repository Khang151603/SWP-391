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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative isolate overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-12">
          <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              {/* Logo and Brand Section */}
              <div className="flex items-center gap-5">
                <div className="rounded-2xl bg-blue-600 p-4 ring-2 ring-blue-100">
                  <span className="text-2xl font-bold text-white">
                    SCMS
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Student Club Management System
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    Nền tảng quản trị câu lạc bộ
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <span>Đăng ký tài khoản</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </header>

          <section className="mt-12">
            <div className="space-y-6 text-center">
              <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
                Quản lý câu lạc bộ trong trường đại học
              </h1>
            </div>
          </section>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl space-y-16 px-6 py-12">
        <section id="clubs" className="space-y-10">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">CÂU LẠC BỘ</p>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Tham gia câu lạc bộ phù hợp với bạn</h2>
            <p className="mx-auto max-w-3xl text-base text-slate-600">
              Khám phá các câu lạc bộ đang hoạt động trong trường, tìm hiểu về hoạt động và đăng ký tham gia ngay hôm nay.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="relative">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{club.name}</h3>
                    <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {club.category}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-slate-600 line-clamp-2">{club.description}</p>
                  <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
                    <span>{club.members} thành viên</span>
                    <span>•</span>
                    <span>{club.activities} hoạt động</span>
                  </div>
                  <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Phí tham gia</span>
                      <span className="text-sm font-semibold text-amber-700">
                        {club.monthlyFee === 0 ? (
                          <span className="text-emerald-700">Miễn phí</span>
                        ) : (
                          <span>{club.monthlyFee.toLocaleString('vi-VN')} ₫/tháng</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-200">
                    <p className="text-xs font-medium text-emerald-700">{club.status}</p>
                  </div>
                  <Link
                    to="/register"
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
                  >
                    Tham gia ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} SCMS • Giải pháp quản lý câu lạc bộ dành cho sinh viên Việt Nam.
      </footer>
    </div>
  );
}

export default HomePage;


