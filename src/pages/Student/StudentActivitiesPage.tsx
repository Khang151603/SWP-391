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
        return { label: 'Đang mở', color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' };
      case 'full':
        return { label: 'Đã đầy', color: 'amber', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' };
      case 'closed':
        return { label: 'Đã đóng', color: 'slate', bgColor: 'bg-slate-100', textColor: 'text-slate-600', borderColor: 'border-slate-300' };
      default:
        return { label: 'Đang mở', color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' };
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
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <svg className="absolute left-3 top-3 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Lọc:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
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
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Activity Info */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor} px-2.5 py-0.5`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.textColor.replace('text-', 'bg-')} ${activity.status === 'open' ? 'animate-pulse' : ''}`}></div>
                        <span className={`text-xs font-medium ${statusConfig.textColor}`}>
                          {statusConfig.label}
                        </span>
                      </span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs text-blue-700 border border-blue-200">
                        {activity.category}
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-900">{activity.title}</h3>
                    <p className="mb-2 text-sm text-slate-600">{activity.club}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <span>{activity.date} • {activity.time}</span>
                      <span className="text-slate-400">•</span>
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
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
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
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h4 className="mb-2 text-lg font-semibold text-slate-900">Không tìm thấy hoạt động</h4>
            <p className="text-sm text-slate-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentActivitiesPage;


