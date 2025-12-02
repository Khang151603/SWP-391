import StudentLayout from '../../components/layout/StudentLayout';

const highlights = [
  { 
    title: 'Hoạt động đang mở', 
    value: '05', 
    trend: '2 nhiệm vụ đến hạn hôm nay',
    icon: 'activity',
    color: 'violet'
  },
  { 
    title: 'Đơn đăng ký chờ duyệt', 
    value: '08', 
    trend: 'Ưu tiên CLB Truyền thông',
    icon: 'document',
    color: 'fuchsia'
  },
  { 
    title: 'Điểm chuyên cần', 
    value: '96%', 
    trend: '+4% so với học kỳ trước',
    icon: 'chart',
    color: 'emerald'
  },
];

const timeline = [
  { 
    time: 'Hôm nay', 
    title: 'Media Cup rehearsal', 
    detail: 'Có mặt trước 17:30 tại sân vận động',
    status: 'urgent'
  },
  { 
    time: '08/12', 
    title: 'Workshop Storytelling', 
    detail: 'Check-in hỗ trợ ban Nội dung',
    status: 'upcoming'
  },
  { 
    time: '12/12', 
    title: 'Orientation 2025', 
    detail: 'Phụ trách truyền thông hiện trường',
    status: 'upcoming'
  },
];

const notifications = [
  {
    title: 'Báo cáo truyền thông',
    content: 'Nộp báo cáo truyền thông tuần 08 trước 17:00 ngày 09/12.',
    priority: 'high',
    time: '2 giờ trước'
  },
  {
    title: 'Phỏng vấn ban Nội dung',
    content: 'Đăng ký phỏng vấn ban Nội dung mở rộng trước 15/12.',
    priority: 'medium',
    time: '5 giờ trước'
  },
  {
    title: 'Lịch tập Media Cup',
    content: 'Lịch tập dợt Media Cup sẽ gửi vào 11/12.',
    priority: 'low',
    time: '1 ngày trước'
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'activity':
      return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'document':
      return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    default:
      return null;
  }
};

function StudentDashboardPage() {
  return (
    <StudentLayout
      title="Tổng quan"
      subtitle="Dashboard theo dõi hoạt động và nhiệm vụ của bạn"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">Xin chào, Khang! 👋</h2>
              <p className="mt-2 text-slate-300">
                Bạn có <span className="font-semibold text-white">3 nhiệm vụ ưu tiên</span> trong tuần này
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-400">Hôm nay</p>
                <p className="text-lg font-semibold text-white">Thứ 2, 02/12</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <svg className="h-8 w-8 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div 
              key={item.title} 
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-400">{item.title}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      item.color === 'emerald' ? 'bg-emerald-400' : 
                      item.color === 'violet' ? 'bg-violet-400' : 
                      'bg-fuchsia-400'
                    }`}></div>
                    <p className="text-xs text-slate-500">{item.trend}</p>
                  </div>
                </div>
                <div className={`rounded-xl p-3 ${
                  item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 
                  item.color === 'violet' ? 'bg-violet-500/20 text-violet-400' : 
                  'bg-fuchsia-500/20 text-fuchsia-400'
                }`}>
                  {getIcon(item.icon)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timeline - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline Section */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-violet-500/20 p-2">
                    <svg className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Timeline tuần này</h3>
                </div>
                <button className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-violet-400 transition hover:bg-violet-500/10">
                  Xem lịch
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        item.status === 'urgent' 
                          ? 'bg-fuchsia-500/20 ring-2 ring-fuchsia-400/30' 
                          : 'bg-violet-500/20'
                      }`}>
                        <div className={`h-2 w-2 rounded-full ${
                          item.status === 'urgent' ? 'bg-fuchsia-400' : 'bg-violet-400'
                        }`}></div>
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="h-full w-px bg-white/10 my-2"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">{item.time}</span>
                        {item.status === 'urgent' && (
                          <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-xs font-medium text-fuchsia-400">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Hành động nhanh</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/[0.07]">
                  <div className="rounded-lg bg-emerald-500/20 p-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Nộp báo cáo</p>
                    <p className="text-xs text-slate-400">Gửi báo cáo hoạt động</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/[0.07]">
                  <div className="rounded-lg bg-violet-500/20 p-2">
                    <svg className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Khám phá CLB</p>
                    <p className="text-xs text-slate-400">Tìm CLB phù hợp</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/[0.07]">
                  <div className="rounded-lg bg-fuchsia-500/20 p-2">
                    <svg className="h-5 w-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Điểm danh</p>
                    <p className="text-xs text-slate-400">Check-in hoạt động</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/[0.07]">
                  <div className="rounded-lg bg-emerald-500/20 p-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Xem thống kê</p>
                    <p className="text-xs text-slate-400">Theo dõi tiến độ</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications - 1 column */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Thông báo</h3>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/20 text-xs font-semibold text-fuchsia-400">
                  {notifications.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <div 
                    key={index} 
                    className={`rounded-xl border p-4 transition hover:bg-white/[0.03] ${
                      notif.priority === 'high' 
                        ? 'border-fuchsia-500/30 bg-fuchsia-500/5' 
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="font-medium text-white text-sm">{notif.title}</p>
                      {notif.priority === 'high' && (
                        <div className="flex h-2 w-2 items-center justify-center">
                          <span className="absolute h-2 w-2 animate-ping rounded-full bg-fuchsia-400 opacity-75"></span>
                          <span className="relative h-2 w-2 rounded-full bg-fuchsia-400"></span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{notif.content}</p>
                    <p className="mt-2 text-xs text-slate-500">{notif.time}</p>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
                Xem tất cả thông báo
              </button>
            </div>

            {/* Progress Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-emerald-500/20 p-2">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Tiến độ học kỳ</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-300">Hoạt động hoàn thành</span>
                    <span className="font-semibold text-white">8/12</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '67%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-300">Điểm rèn luyện</span>
                    <span className="font-semibold text-white">96/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentDashboardPage;



