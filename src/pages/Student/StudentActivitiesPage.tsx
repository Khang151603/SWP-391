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
    category: 'Workshop',
    status: 'open',
  },
  {
    id: 2,
    title: 'Hackathon AI Challenge 2024',
    club: 'CLB Trí tuệ Nhân tạo',
    date: '20/12/2024',
    time: '08:00 - 20:00',
    location: 'Hội trường A',
    category: 'Hackathon',
    status: 'open',
  },
  {
    id: 3,
    title: 'Media Cup - Giải bóng đá',
    club: 'CLB Truyền thông',
    date: '22/12/2024',
    time: '16:00 - 18:00',
    location: 'Sân vận động trường',
    category: 'Thể thao',
    status: 'open',
  },
  {
    id: 4,
    title: 'Tech Talk: Cloud Computing',
    club: 'CLB Công nghệ',
    date: '10/12/2024',
    time: '14:00 - 16:00',
    location: 'Online - Zoom',
    category: 'Seminar',
    status: 'full',
  },
];

const categories = ['Tất cả', 'Workshop', 'Hackathon', 'Seminar', 'Thể thao'];

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
        <div className="space-y-3">
          {filteredActivities.map((activity) => {
            const statusConfig = getStatusConfig(activity.status);
            return (
              <div
                key={activity.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-violet-500/30 hover:bg-white/[0.07]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Activity Info */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full ${statusConfig.bgColor} px-2.5 py-0.5`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.textColor.replace('text-', 'bg-')} ${activity.status === 'open' ? 'animate-pulse' : ''}`}></div>
                        <span className={`text-xs font-medium ${statusConfig.textColor}`}>
                          {statusConfig.label}
                        </span>
                      </span>
                      <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs text-violet-400">
                        {activity.category}
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-white">{activity.title}</h3>
                    <p className="mb-2 text-sm text-slate-400">{activity.club}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                      <span>{activity.date} • {activity.time}</span>
                      <span className="text-slate-500">•</span>
                      <span>{activity.location}</span>
                    </div>
                  </div>

                  {/* Right: Join Button */}
                  <div className="sm:w-auto sm:flex-shrink-0">
                    <button
                      onClick={() => handleJoinActivity(activity.id)}
                      disabled={activity.status !== 'open'}
                      className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
                        activity.status === 'open'
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-md shadow-violet-500/20 active:scale-95'
                          : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {activity.status === 'open' ? 'Tham gia' : activity.status === 'full' ? 'Đã đầy' : 'Đã đóng'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center backdrop-blur-sm">
            <h4 className="mb-2 text-lg font-semibold text-white">Không tìm thấy hoạt động</h4>
            <p className="text-sm text-slate-400">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentActivitiesPage;


