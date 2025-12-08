import { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';

const activities = [
  {
    id: 1,
    title: 'Workshop React Advanced',
    club: 'CLB Lập trình Sáng tạo',
    date: '15/12/2024',
    time: '14:00 - 17:00',
    location: 'Phòng E201, Tòa E',
    fee: 50000,
    maxParticipants: 40,
    registered: 28,
    category: 'Workshop',
    status: 'open',
    description: 'Học React hooks nâng cao, state management và optimization techniques',
    organizer: 'Ban Học thuật',
    deadline: '13/12/2024',
  },
  {
    id: 2,
    title: 'Hackathon AI Challenge 2024',
    club: 'CLB Trí tuệ Nhân tạo',
    date: '20/12/2024',
    time: '08:00 - 20:00',
    location: 'Hội trường A',
    fee: 100000,
    maxParticipants: 60,
    registered: 45,
    category: 'Hackathon',
    status: 'open',
    description: 'Cuộc thi lập trình AI 12 giờ với giải thưởng hấp dẫn',
    organizer: 'Ban Tổ chức',
    deadline: '18/12/2024',
  },
  {
    id: 3,
    title: 'Media Cup - Giải bóng đá',
    club: 'CLB Truyền thông',
    date: '22/12/2024',
    time: '16:00 - 18:00',
    location: 'Sân vận động trường',
    fee: 0,
    maxParticipants: 100,
    registered: 67,
    category: 'Thể thao',
    status: 'open',
    description: 'Giải bóng đá giao lưu giữa các CLB trong trường',
    organizer: 'Ban Thể thao',
    deadline: '20/12/2024',
  },
  {
    id: 4,
    title: 'Tech Talk: Cloud Computing',
    club: 'CLB Công nghệ',
    date: '10/12/2024',
    time: '14:00 - 16:00',
    location: 'Online - Zoom',
    fee: 30000,
    maxParticipants: 100,
    registered: 100,
    category: 'Seminar',
    status: 'full',
    description: 'Chuyên gia từ AWS chia sẻ về Cloud Computing và DevOps',
    organizer: 'Ban Chuyên môn',
    deadline: '08/12/2024',
  },
  {
    id: 5,
    title: 'Workshop Thiết kế UI/UX',
    club: 'CLB Thiết kế',
    date: '25/12/2024',
    time: '09:00 - 12:00',
    location: 'Phòng Lab 305',
    fee: 70000,
    maxParticipants: 30,
    registered: 22,
    category: 'Workshop',
    status: 'open',
    description: 'Thực hành thiết kế giao diện với Figma và các công cụ hiện đại',
    organizer: 'Ban Đào tạo',
    deadline: '23/12/2024',
  },
  {
    id: 6,
    title: 'Networking Night',
    club: 'CLB Kinh doanh',
    date: '28/12/2024',
    time: '18:00 - 21:00',
    location: 'Café The Morning',
    fee: 150000,
    maxParticipants: 50,
    registered: 35,
    category: 'Networking',
    status: 'open',
    description: 'Gặp gỡ và kết nối với alumni và doanh nhân thành đạt',
    organizer: 'Ban Đối ngoại',
    deadline: '26/12/2024',
  },
];

const categories = ['Tất cả', 'Workshop', 'Hackathon', 'Seminar', 'Thể thao', 'Networking'];

function StudentActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter((activity) => {
    const matchCategory = selectedCategory === 'Tất cả' || activity.category === selectedCategory;
    const matchSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       activity.club.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return { label: 'Đang mở', color: 'emerald', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/30' };
      case 'full':
        return { label: 'Đã đầy', color: 'fuchsia', bgColor: 'bg-fuchsia-500/20', textColor: 'text-fuchsia-400', borderColor: 'border-fuchsia-500/30' };
      case 'closed':
        return { label: 'Đã đóng', color: 'slate', bgColor: 'bg-slate-500/20', textColor: 'text-slate-400', borderColor: 'border-slate-500/30' };
      default:
        return { label: 'Đang mở', color: 'emerald', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/30' };
    }
  };

  const handleJoinActivity = (activityId: number) => {
    // TODO: Implement join activity logic
    console.log('Join activity:', activityId);
    alert(`Đăng ký tham gia hoạt động ID: ${activityId}`);
  };

  return (
    <StudentLayout title="Hoạt động" subtitle="Khám phá và đăng ký tham gia các hoạt động">
      <div className="space-y-6">
        {/* Search & Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm hoạt động hoặc CLB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <svg className="absolute left-3 top-3 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Lọc:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                      : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const statusConfig = getStatusConfig(activity.status);
            return (
              <div
                key={activity.id}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-violet-500/30 hover:bg-white/[0.07]"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  {/* Left: Activity Info */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full ${statusConfig.bgColor} px-3 py-1`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.textColor.replace('text-', 'bg-')} ${activity.status === 'open' ? 'animate-pulse' : ''}`}></div>
                            <span className={`text-xs font-semibold uppercase ${statusConfig.textColor}`}>
                              {statusConfig.label}
                            </span>
                          </span>
                          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
                            {activity.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{activity.club}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300">{activity.description}</p>

                    {/* Details Grid */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-500/20 p-2">
                          <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Thời gian</p>
                          <p className="text-sm font-medium text-white">{activity.date} • {activity.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-fuchsia-500/20 p-2">
                          <svg className="h-4 w-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Địa điểm</p>
                          <p className="text-sm font-medium text-white">{activity.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-violet-500/20 p-2">
                          <svg className="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Tổ chức</p>
                          <p className="text-sm font-medium text-white">{activity.organizer}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-500/20 p-2">
                          <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Hạn đăng ký</p>
                          <p className="text-sm font-medium text-white">{activity.deadline}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Registration Card */}
                  <div className="w-full lg:w-64 lg:flex-shrink-0">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                      {/* Join Button */}
                      <button
                        onClick={() => handleJoinActivity(activity.id)}
                        disabled={activity.status !== 'open'}
                        className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition-all ${
                          activity.status === 'open'
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 active:scale-95'
                            : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {activity.status === 'open' ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tham gia
                          </span>
                        ) : activity.status === 'full' ? (
                          'Đã đầy'
                        ) : (
                          'Đã đóng'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Không tìm thấy hoạt động</h4>
              <p className="text-sm text-slate-400">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentActivitiesPage;


