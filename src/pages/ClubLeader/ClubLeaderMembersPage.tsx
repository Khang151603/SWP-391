import { useMemo, useState } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { memberRoles, memberRoster, memberStatuses, pendingApplications } from './leaderData';

function ClubLeaderMembersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const totalMembers = memberRoster.length;
  const activeMembers = memberRoster.filter((m) => m.status === 'Active').length;
  const pendingCount = pendingApplications.length;

  const filteredMembers = useMemo(
    () =>
      memberRoster.filter((member) => {
        const matchSearch =
          !search ||
          member.name.toLowerCase().includes(search.toLowerCase()) ||
          member.studentId.toLowerCase().includes(search.toLowerCase());

        const matchRole = !roleFilter || member.role === roleFilter;
        const matchStatus = !statusFilter || member.status === statusFilter;

        return matchSearch && matchRole && matchStatus;
      }),
    [search, roleFilter, statusFilter]
  );

  return (
    <LeaderLayout
      title="Quản lý thành viên & đơn"
      subtitle="Duyệt đơn đăng ký, cập nhật vai trò và nắm nhanh sức khỏe đội ngũ"
    >
      <div className="space-y-8">
        {/* Top overview cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300 shadow-sm shadow-fuchsia-500/10 transition hover:border-fuchsia-400/60 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="uppercase tracking-[0.25em]">Đơn đăng ký</p>
              <span className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-fuchsia-200">
                Cần xử lý
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{pendingCount}</p>
            <p className="mt-1 text-[0.72rem] text-slate-400">
              Ưu tiên duyệt trong vòng <span className="font-medium text-slate-200">48 giờ</span> để giữ trải nghiệm tốt
              cho ứng viên.
            </p>
            <button className="mt-3 w-full rounded-xl bg-fuchsia-500/90 px-3 py-2 text-[0.72rem] font-semibold text-white transition group-hover:bg-fuchsia-400">
              Mở danh sách đơn chờ
            </button>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300 shadow-sm shadow-emerald-500/10 transition hover:border-emerald-400/60 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="uppercase tracking-[0.25em]">Thành viên đang hoạt động</p>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-200">
                Core team
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{activeMembers}</p>
            <p className="mt-1 text-[0.72rem] text-slate-400">
              Bao gồm thành viên có trạng thái <span className="font-medium text-emerald-200">Active</span> trong hệ
              thống.
            </p>
            <button
              className="mt-3 w-full rounded-xl border border-emerald-300/50 bg-emerald-500/10 px-3 py-2 text-[0.72rem] font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
              onClick={() => setStatusFilter('Active')}
            >
              Lọc chỉ xem thành viên Active
            </button>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300 shadow-sm shadow-sky-500/10 transition hover:border-sky-400/60 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="uppercase tracking-[0.25em]">Tổng thành viên</p>
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-sky-200">
                Quy mô CLB
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{totalMembers}</p>
            <p className="mt-1 text-[0.72rem] text-slate-400">
              Gồm cả thành viên đang active, tạm ngưng và chờ xác nhận.
            </p>
            <button className="mt-3 w-full rounded-xl border border-sky-300/50 bg-sky-500/10 px-3 py-2 text-[0.72rem] font-semibold text-sky-100 transition hover:bg-sky-500/20">
              Xuất danh sách thành viên
            </button>
          </div>
        </section>

        {/* Pending applications grid */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-orange-100/80">Ứng viên mới</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Đơn đăng ký đang chờ duyệt</h3>
              <p className="text-sm text-slate-400">
                Duyệt nhanh để ứng viên nhận phản hồi rõ ràng trước khi tham gia hoạt động đầu tiên.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {pendingApplications.map((application) => (
              <div
                key={application.studentId}
                className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{application.name}</p>
                      <p className="text-[0.75rem] text-slate-400">{application.studentId}</p>
                    </div>
                    <span className="rounded-full bg-slate-900/70 px-2 py-1 text-[0.7rem] text-slate-300">
                      Nộp {application.submittedAt}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.8rem] text-slate-200 line-clamp-3">{application.note}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[0.72rem]">
                    <span className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/5 px-3 py-1 text-fuchsia-200">
                      {application.interest}
                    </span>
                    <span className="rounded-full bg-slate-900/70 px-3 py-1 text-slate-300">Đợt tuyển GEN 2025</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[0.72rem]">
                  <div className="flex gap-2">
                    <button className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-100 hover:bg-emerald-500/20">
                      Approve
                    </button>
                    <button className="rounded-full border border-rose-400/60 bg-rose-500/10 px-3 py-1 font-semibold text-rose-100 hover:bg-rose-500/20">
                      Reject
                    </button>
                  </div>
                  <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-100 hover:bg-white/10">
                    Gửi tin nhắn nhanh
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Members table */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-orange-100/80">Đội ngũ hiện tại</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Danh sách thành viên CLB</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã SV..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none md:w-52"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-fuchsia-300 focus:outline-none"
              >
                <option value="">Lọc theo vai trò</option>
                {memberRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-fuchsia-300 focus:outline-none"
              >
                <option value="">Lọc theo trạng thái</option>
                {memberStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/80">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Thành viên</th>
                  <th className="px-4 py-3">Mã SV</th>
                  <th className="px-4 py-3">Ngày gia nhập</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Ban phụ trách</th>
                  <th className="px-4 py-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.studentId} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{member.name}</span>
                        <span className="text-[0.72rem] text-slate-400">Gen {member.joinedAt.slice(-2)} • {member.department}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{member.studentId}</td>
                    <td className="px-4 py-3">{member.joinedAt}</td>
                    <td className="px-4 py-3">{member.role}</td>
                    <td className="px-4 py-3">{member.department}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          member.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : member.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-200'
                              : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderMembersPage;


