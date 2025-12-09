import { useMemo, useState } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { memberRoster, memberStatuses, pendingApplications } from './leaderData';

function ClubLeaderMembersPage() {
  const [search, setSearch] = useState('');
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

        const matchStatus = !statusFilter || member.status === statusFilter;

        return matchSearch && matchStatus;
      }),
    [search, statusFilter]
  );

  return (
    <LeaderLayout
      title="Quản lý thành viên & đơn"
      subtitle="Duyệt đơn đăng ký, cập nhật vai trò và nắm nhanh sức khỏe đội ngũ"
    >
      <div className="space-y-8">
        {/* Top overview cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Đơn đăng ký</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingCount}</p>
          </div>

          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Thành viên đang hoạt động</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{activeMembers}</p>
          </div>

          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tổng thành viên</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalMembers}</p>
          </div>
        </section>

        {/* Pending applications table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Ứng viên mới</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Đơn đăng ký đang chờ duyệt</h3>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-600">
                <tr>
                  <th className="px-4 py-3">Ứng viên</th>
                  <th className="px-4 py-3">Mã SV</th>
                  <th className="px-4 py-3">Ngày nộp</th>
                  <th className="px-4 py-3">Ghi chú</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map((application) => (
                  <tr key={application.studentId} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{application.name}</span>
                        <span className="text-[0.72rem] text-slate-500">Nộp {application.submittedAt}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{application.studentId}</td>
                    <td className="px-4 py-3 text-slate-700">{application.submittedAt}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-[0.85rem] text-slate-600 line-clamp-2">{application.note}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-[0.85rem]">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors">
                          Approve
                        </button>
                        <button className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 font-semibold text-red-700 hover:bg-red-100 transition-colors">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Members table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Đội ngũ hiện tại</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Danh sách thành viên CLB</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã SV..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:w-52"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-600">
                <tr>
                  <th className="w-1/3 min-w-[180px] px-4 py-3">Thành viên</th>
                  <th className="w-1/5 px-4 py-3">Mã SV</th>
                  <th className="w-1/5 px-4 py-3">Ngày gia nhập</th>
                  <th className="w-1/5 px-4 py-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.studentId} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="w-1/3 min-w-[180px] px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{member.name}</span>
                        <span className="text-[0.72rem] text-slate-500">Gen {member.joinedAt.slice(-2)} • {member.department}</span>
                      </div>
                    </td>
                    <td className="w-1/5 px-4 py-3 whitespace-nowrap text-slate-700">{member.studentId}</td>
                    <td className="w-1/5 px-4 py-3 whitespace-nowrap text-slate-700">{member.joinedAt}</td>
                    <td className="w-1/5 px-4 py-3 text-right">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          member.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : member.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
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


