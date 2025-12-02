import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';

const mockClubDetail = {
  description:
    'CLB Lập trình Sáng tạo là nơi sinh viên đam mê công nghệ có thể học hỏi, thực hành và phát triển các dự án phần mềm thực tế. Chúng tôi tổ chức các buổi workshop, hackathon và kết nối với các chuyên gia trong ngành.',
  requirements: ['Tham gia tối thiểu 2 hoạt động/tháng', 'Điểm rèn luyện ≥ 75', 'Sẵn sàng training cuối tuần'],
  highlights: ['Mentor doanh nghiệp', 'Workshop chuyên sâu', 'Sinh hoạt song ngữ'],
  stats: [
    { label: 'Thành viên', value: '86', sub: '+12 trong tháng', icon: 'users' },
    { label: 'Hoạt động', value: '14', sub: '100% đúng hạn', icon: 'calendar' },
    { label: 'Chờ duyệt', value: '05', sub: 'Ưu tiên phỏng vấn', icon: 'document' },
  ],
  activities: [
    { title: 'Workshop React Advanced', date: '15/12/2024', type: 'Workshop' },
    { title: 'Hackathon AI Challenge', date: '20/12/2024', type: 'Hackathon' },
    { title: 'Tech Talk: Cloud Computing', date: '22/12/2024', type: 'Seminar' },
  ],
};

const getIcon = (type: string) => {
  switch (type) {
    case 'users':
      return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'document':
      return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return null;
  }
};

function ClubDetailPage() {
  const { clubId } = useParams();
  const formattedName = clubId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') ?? 'CLB';

  return (
    <StudentLayout title={formattedName} subtitle="Thông tin chi tiết câu lạc bộ">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/student/clubs" className="hover:text-white transition">
            CLB của tôi
          </Link>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{formattedName}</span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                <span className="text-xs font-medium text-emerald-300">Đang hoạt động</span>
              </div>
              <h1 className="text-3xl font-bold text-white">{formattedName}</h1>
              <p className="mt-3 max-w-3xl text-slate-300">{mockClubDetail.description}</p>
            </div>
            <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-6">
              <svg className="h-20 w-20 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {mockClubDetail.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-500/20 p-3 text-violet-400">
                    {getIcon(stat.icon)}
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 */}
          <div className="space-y-6 lg:col-span-2">
            {/* Requirements */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-fuchsia-500/20 p-2">
                  <svg className="h-5 w-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Yêu cầu tham gia</h2>
              </div>
              <div className="space-y-3">
                {mockClubDetail.requirements.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20">
                      <div className="h-2 w-2 rounded-full bg-violet-400"></div>
                    </div>
                    <p className="flex-1 text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-500/20 p-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Hoạt động sắp tới</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  {mockClubDetail.activities.length} sự kiện
                </span>
              </div>
              <div className="space-y-3">
                {mockClubDetail.activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-violet-500/20 px-3 py-2">
                        <p className="text-xs font-semibold text-violet-300">{activity.type}</p>
                      </div>
                      <div>
                        <p className="font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-slate-400">{activity.date}</p>
                      </div>
                    </div>
                    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Highlights */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-white">Điểm nổi bật</h2>
              <div className="space-y-2">
                {mockClubDetail.highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                    <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default ClubDetailPage;



