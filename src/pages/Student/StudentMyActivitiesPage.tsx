import { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';

type ActivityStatus = 'upcoming' | 'ongoing' | 'completed';

interface Activity {
  id: number;
  title: string;
  club: string;
  date: string;
  time: string;
  location: string;
  status: ActivityStatus;
  role: string;
}

const myActivities: Activity[] = [
  {
    id: 1,
    title: 'Workshop React Advanced',
    club: 'CLB Lập trình Sáng tạo',
    date: '15/12/2024',
    time: '14:00 - 17:00',
    location: 'Phòng E201, Tòa E',
    status: 'upcoming',
    role: 'Thành viên',
  },
  {
    id: 2,
    title: 'Hackathon AI Challenge 2024',
    club: 'CLB Trí tuệ Nhân tạo',
    date: '20/12/2024',
    time: '08:00 - 20:00',
    location: 'Hội trường A',
    status: 'upcoming',
    role: 'Thành viên nhóm',
  },
  {
    id: 3,
    title: 'Volunteer Day - Mùa Đông Ấm',
    club: 'CLB Tình nguyện Xanh',
    date: '10/12/2024',
    time: '07:00 - 12:00',
    location: 'Làng trẻ SOS',
    status: 'ongoing',
    role: 'Tổ phó',
  },
  {
    id: 4,
    title: 'Seminar Blockchain & Web3',
    club: 'CLB Công nghệ Blockchain',
    date: '05/12/2024',
    time: '14:00 - 16:30',
    location: 'Hội trường B',
    status: 'completed',
    role: 'Thành viên',
  },
];

const statusConfig: Record<ActivityStatus, { label: string; color: string; dotColor: string }> = {
  upcoming: {
    label: 'Sắp diễn ra',
    color: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    dotColor: 'bg-violet-400',
  },
  ongoing: {
    label: 'Đang diễn ra',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    dotColor: 'bg-slate-400',
  },
};

function StudentMyActivitiesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = myActivities.filter((activity) => {
    const matchesTab = activeTab === 'all' || activity.status === activeTab;
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.club.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: myActivities.length,
    upcoming: myActivities.filter((a) => a.status === 'upcoming').length,
    ongoing: myActivities.filter((a) => a.status === 'ongoing').length,
    completed: myActivities.filter((a) => a.status === 'completed').length,
  };

  return (
    <StudentLayout title="Hoạt động của tôi" subtitle="Quản lý các hoạt động bạn đang tham gia">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Sắp diễn ra</p>
            <p className="mt-1 text-2xl font-bold text-white">{stats.upcoming}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Đang diễn ra</p>
            <p className="mt-1 text-2xl font-bold text-white">{stats.ongoing}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Hoàn thành</p>
            <p className="mt-1 text-2xl font-bold text-white">{stats.completed}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm hoạt động hoặc CLB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                  : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                  : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              Sắp diễn ra ({stats.upcoming})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'ongoing'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                  : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              Đang diễn ra ({stats.ongoing})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === 'completed'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                  : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              Hoàn thành ({stats.completed})
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-violet-500/30 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        statusConfig[activity.status].color
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${statusConfig[activity.status].dotColor}`}></div>
                      {statusConfig[activity.status].label}
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs text-blue-300">
                      {activity.role}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-white">{activity.title}</h3>
                  <p className="mb-3 text-sm text-slate-400">{activity.club}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                    <span>{activity.date} • {activity.time}</span>
                    <span className="text-slate-500">•</span>
                    <span>{activity.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center backdrop-blur-sm">
            <h4 className="mb-2 text-lg font-semibold text-white">Không tìm thấy hoạt động</h4>
            <p className="text-sm text-slate-400">
              {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bạn chưa tham gia hoạt động nào'}
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentMyActivitiesPage;
