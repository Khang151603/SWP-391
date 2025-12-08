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
  progress: number;
  role: string;
  tasks: number;
  completedTasks: number;
  checklist: string[];
  registeredDate: string;
  certificateUrl?: string;
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
    progress: 60,
    role: 'Thành viên',
    tasks: 3,
    completedTasks: 2,
    checklist: ['Chuẩn bị laptop', 'Hoàn thành bài tập trước', 'Đăng ký tài khoản GitHub'],
    registeredDate: '01/12/2024',
  },
  {
    id: 2,
    title: 'Hackathon AI Challenge 2024',
    club: 'CLB Trí tuệ Nhân tạo',
    date: '20/12/2024',
    time: '08:00 - 20:00',
    location: 'Hội trường A',
    status: 'upcoming',
    progress: 30,
    role: 'Thành viên nhóm',
    tasks: 5,
    completedTasks: 1,
    checklist: ['Đăng ký nhóm', 'Nộp ý tưởng dự án', 'Chuẩn bị pitch deck'],
    registeredDate: '28/11/2024',
  },
  {
    id: 3,
    title: 'Volunteer Day - Mùa Đông Ấm',
    club: 'CLB Tình nguyện Xanh',
    date: '10/12/2024',
    time: '07:00 - 12:00',
    location: 'Làng trẻ SOS',
    status: 'ongoing',
    progress: 85,
    role: 'Tổ phó',
    tasks: 4,
    completedTasks: 3,
    checklist: ['Họp tổ chuẩn bị', 'Mua quà cho trẻ em', 'Phân công nhiệm vụ tổ viên'],
    registeredDate: '20/11/2024',
  },
  {
    id: 4,
    title: 'Seminar Blockchain & Web3',
    club: 'CLB Công nghệ Blockchain',
    date: '05/12/2024',
    time: '14:00 - 16:30',
    location: 'Hội trường B',
    status: 'completed',
    progress: 100,
    role: 'Thành viên',
    tasks: 2,
    completedTasks: 2,
    checklist: ['Đăng ký tham dự', 'Hoàn thành khảo sát'],
    registeredDate: '15/11/2024',
    certificateUrl: '#',
  },
  {
    id: 5,
    title: 'Giao lưu CLB Toán học',
    club: 'CLB Toán học Ứng dụng',
    date: '25/11/2024',
    time: '09:00 - 11:00',
    location: 'Phòng C301',
    status: 'completed',
    progress: 100,
    role: 'Thành viên',
    tasks: 1,
    completedTasks: 1,
    checklist: ['Tham dự sự kiện'],
    registeredDate: '10/11/2024',
  },
  {
    id: 6,
    title: 'Cuộc thi Thiết kế UI/UX',
    club: 'CLB Thiết kế Đồ họa',
    date: '18/12/2024',
    time: '13:00 - 18:00',
    location: 'Lab Design, Tòa F',
    status: 'upcoming',
    progress: 45,
    role: 'Trưởng nhóm',
    tasks: 6,
    completedTasks: 3,
    checklist: ['Đăng ký nhóm', 'Nộp concept design', 'Hoàn thiện prototype', 'Chuẩn bị presentation'],
    registeredDate: '03/12/2024',
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Tổng hoạt động</p>
                <p className="mt-1 text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-blue-500/20 p-3">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Sắp diễn ra</p>
                <p className="mt-1 text-3xl font-bold text-white">{stats.upcoming}</p>
              </div>
              <div className="rounded-xl bg-violet-500/20 p-3">
                <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Đang diễn ra</p>
                <p className="mt-1 text-3xl font-bold text-white">{stats.ongoing}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/20 p-3">
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Hoàn thành</p>
                <p className="mt-1 text-3xl font-bold text-white">{stats.completed}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/20 p-3">
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
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
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-violet-500/30 hover:bg-white/[0.07]"
            >
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Left: Main Info */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                            statusConfig[activity.status].color
                          }`}
                        >
                          <div className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusConfig[activity.status].dotColor}`}></div>
                          {statusConfig[activity.status].label}
                        </span>
                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                          {activity.role}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{activity.club}</p>
                    </div>
                  </div>

                  {/* Info Grid */}
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Không tìm thấy hoạt động</h4>
              <p className="text-sm text-slate-400">
                {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bạn chưa tham gia hoạt động nào'}
              </p>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentMyActivitiesPage;
