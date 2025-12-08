import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { managedClubs } from './studentData';

function StudentClubsPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'leader' | 'member'>('all');

  const filteredClubs = useMemo(() => {
    return managedClubs.filter((club) => {
      const matchSearch =
        !search ||
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.role.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        roleFilter === 'all'
          ? true
          : roleFilter === 'leader'
          ? club.role.toLowerCase().includes('chủ nhiệm') ||
            club.role.toLowerCase().includes('leader')
          : !(
              club.role.toLowerCase().includes('chủ nhiệm') ||
              club.role.toLowerCase().includes('leader')
            );

      return matchSearch && matchRole;
    });
  }, [search, roleFilter]);

  const hasNoClub = managedClubs.length === 0;

  return (
    <StudentLayout
      title="CLB của tôi"
    >
      <div className="space-y-8">
        {/* Top header & actions */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-300/80">
              Tổng quan
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              Câu lạc bộ của bạn
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">  
            <Link
              to="/student/explore"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/40 transition hover:shadow-violet-500/60"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Khám phá CLB mới
            </Link>
          </div>
        </div>
        {/* Controls: search + filter */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-900/40 px-3 py-2 ring-1 ring-white/10 focus-within:ring-violet-400/60">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên CLB, vai trò..."
              className="h-8 w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="hidden text-xs text-slate-400 sm:block">Lọc theo vai trò:</p>
            <div className="inline-flex rounded-xl bg-slate-900/40 p-1 text-xs ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  roleFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('leader')}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  roleFilter === 'leader'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Ban chủ nhiệm
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('member')}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  roleFilter === 'member'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Thành viên
              </button>
            </div>
          </div>
        </div>

        {/* Clubs list + empty states */}
        {hasNoClub ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center backdrop-blur-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <svg className="h-8 w-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Bạn chưa tham gia CLB nào</h4>
              <p className="mb-4 text-sm text-slate-400">
                Khám phá các CLB học thuật, nghệ thuật, thể thao và nhiều hơn nữa để bắt đầu hành trình đại học sôi động hơn.
              </p>
              <Link
                to="/student/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/40 transition hover:shadow-violet-500/60"
              >
                Khám phá ngay
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-amber-300/30 bg-amber-500/5 p-6 text-center backdrop-blur-sm">
            <div className="mx-auto max-w-md space-y-3">
              <p className="text-sm font-medium text-amber-100">
                Không tìm thấy CLB phù hợp với bộ lọc hiện tại.
              </p>
              <p className="text-xs text-amber-100/80">
                Thử xoá từ khóa tìm kiếm hoặc đổi bộ lọc vai trò để xem thêm CLB.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setRoleFilter('all');
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400/20 px-4 py-1.5 text-xs font-medium text-amber-50 ring-1 ring-amber-300/40 hover:bg-amber-400/30"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClubs.map((club) => (
              <div
                key={club.name}
                className="group rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-violet-900/40 p-5 backdrop-blur transition hover:border-violet-400/40 hover:bg-slate-900/80"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Club Info */}
                  <div className="flex flex-1 items-start gap-4">
                    <div className="mt-1 rounded-2xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 p-3 text-violet-100 shadow-inner shadow-violet-500/30">
                      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white sm:text-xl">{club.name}</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/40">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {club.role}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-violet-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <span className="font-medium text-white">{club.members}</span>
                          <span className="text-slate-400">thành viên</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/student/clubs/${club.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
                    >
                      Xem chi tiết
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentClubsPage;



