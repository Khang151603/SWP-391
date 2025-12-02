import LeaderLayout from '../../components/layout/LeaderLayout';
import { memberRoles, memberRoster, memberStatuses, pendingApplications } from './leaderData';

function ClubLeaderMembersPage() {
  return (
    <LeaderLayout
      title="Quản lý thành viên & đơn"
      subtitle="Duyệt đơn đăng ký, cập nhật vai trò và đánh dấu tình trạng tham gia"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Đơn đăng ký mới</h3>
              <p className="text-sm text-slate-400">Ưu tiên duyệt trước 48 giờ kể từ khi gửi đơn</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">
                Export tóm tắt
              </button>
              <button className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-white/90">
                Gửi email template
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {pendingApplications.map((application) => (
              <div key={application.studentId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-white">{application.name}</p>
                    <p className="text-slate-400">{application.studentId}</p>
                  </div>
                  <span className="text-xs text-slate-400">{application.submittedAt}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{application.note}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-fuchsia-200">{application.interest}</span>
                  <button className="rounded-full border border-emerald-500/40 px-3 py-1 text-emerald-300 hover:bg-emerald-500/10">
                    Approve
                  </button>
                  <button className="rounded-full border border-rose-500/40 px-3 py-1 text-rose-300 hover:bg-rose-500/10">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Danh sách thành viên</h3>
              <p className="text-sm text-slate-400">Tìm kiếm & lọc theo vai trò, tình trạng hoặc ngày tham gia</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <select className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-fuchsia-300 focus:outline-none">
                <option value="">Lọc theo vai trò</option>
                {memberRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-fuchsia-300 focus:outline-none">
                <option value="">Lọc theo trạng thái</option>
                {memberStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-white hover:bg-white/10">Thêm thành viên</button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Họ tên</th>
                  <th className="px-4 py-3">Mã SV</th>
                  <th className="px-4 py-3">Ngày gia nhập</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Ban phụ trách</th>
                  <th className="px-4 py-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {memberRoster.map((member) => (
                  <tr key={member.studentId} className="border-t border-white/5">
                    <td className="px-4 py-3 text-white">{member.name}</td>
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


