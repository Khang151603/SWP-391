import { useMemo, useState, useEffect } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { memberStatuses } from './leaderData';
import { membershipService } from '../../api/services/membership.service';
import type { LeaderPendingMembershipRequest, ClubMemberDto } from '../../api/types/membership.types';

type ActionType = 'approve' | 'reject' | 'lock' | 'unlock' | 'delete' | null;

interface SelectedApplication {
  id: number;
  name: string;
  studentId: string;
}

interface SelectedMember {
  membershipId: number;
  name: string;
}

function ClubLeaderMembersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pendingApplications, setPendingApplications] = useState<LeaderPendingMembershipRequest[]>([]);
  const [members, setMembers] = useState<ClubMemberDto[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<LeaderPendingMembershipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state for approve/reject
  const [selectedApplication, setSelectedApplication] = useState<SelectedApplication | null>(null);
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending membership requests
  const fetchPendingRequests = async () => {
    try {
      const data = await membershipService.getLeaderPendingRequests();
      setPendingApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn đăng ký');
      console.error('Error fetching pending requests:', err);
    }
  };

  // Fetch members
  const fetchMembers = async () => {
    try {
      const data = await membershipService.getLeaderMembers();
      console.log('Fetched members data:', data);
      // Ensure data is an array
      if (Array.isArray(data)) {
        setMembers(data);
        // Clear any previous errors when successfully fetching
        if (error && error.includes('thành viên')) {
          setError(null);
        }
      } else {
        console.warn('Members data is not an array:', data);
        setMembers([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách thành viên';
      setError(errorMessage);
      console.error('Error fetching members:', err);
      // Set empty array on error to prevent display issues
      setMembers([]);
    }
  };

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([fetchPendingRequests(), fetchMembers()]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Format date from ISO string to DD/MM/YYYY
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Map API data to UI format
  const mappedPendingApplications = useMemo(() => {
    return pendingApplications.map((app) => ({
      id: app.id,
      name: app.fullName || `Account #${app.accountId}`,
      studentId: String(app.accountId),
      submittedAt: formatDate(app.requestDate),
      note: app.note || app.reason || '',
      email: app.email,
      phone: app.phone,
      accountId: app.accountId,
      clubId: app.clubId,
    }));
  }, [pendingApplications]);

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status?.toLowerCase() === 'active' || m.status?.toLowerCase() === 'approved').length;
  const pendingCount = pendingApplications.length;

  // Get unique statuses from members
  const availableStatuses = useMemo(() => {
    const statusSet = new Set<string>();
    members.forEach((m) => {
      if (m.status) {
        statusSet.add(m.status);
      }
    });
    return Array.from(statusSet).sort();
  }, [members]);

  // Handle approve/reject actions
  const handleOpenModal = (application: { id: number; name: string; studentId: string }, type: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setSelectedMember(null);
    setActionType(type);
    setNote('');
  };

  // Handle lock/unlock/delete actions
  const handleOpenMemberModal = (member: ClubMemberDto, type: 'lock' | 'unlock' | 'delete') => {
    setSelectedMember({
      membershipId: member.membershipId,
      name: member.fullName || `Account #${member.accountId}`,
    });
    setSelectedApplication(null);
    setActionType(type);
    setNote('');
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setSelectedMember(null);
    setActionType(null);
    setNote('');
  };

  const handleSubmit = async () => {
    if (!actionType) return;

    try {
      setIsProcessing(true);
      setError(null);
      
      if (actionType === 'approve' && selectedApplication) {
        await membershipService.approveLeaderRequest(selectedApplication.id, { note });
      } else if (actionType === 'reject' && selectedApplication) {
        await membershipService.rejectLeaderRequest(selectedApplication.id, { note });
      } else if (actionType === 'lock' && selectedMember) {
        await membershipService.lockMember(selectedMember.membershipId, note || null);
      } else if (actionType === 'unlock' && selectedMember) {
        await membershipService.unlockMember(selectedMember.membershipId);
      } else if (actionType === 'delete' && selectedMember) {
        await membershipService.deleteMember(selectedMember.membershipId, note || null);
      }

      // Refresh the lists - especially important after approve to show new member
      // After approve, the new member should appear in the members list
      // After reject, the request should be removed from pending list
      
      // For approve action, wait a bit for backend to process, then reload
      if (actionType === 'approve') {
        // Wait 500ms for backend to process the approval and create membership
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Reload both lists
      await Promise.all([fetchPendingRequests(), fetchMembers()]);
      
      // If approve, check if members were added
      // Note: Backend may need time to create membership, or membership is created after payment
      if (actionType === 'approve') {
        console.log('After approve - members count:', members.length);
        // Retry fetching members a few times with delays
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          await fetchMembers();
          if (members.length > 0) {
            console.log('Members found after retry:', members.length);
            break;
          }
        }
      }
      
      handleCloseModal();
    } catch (err) {
      const actionNames: Record<ActionType, string> = {
        approve: 'chấp nhận',
        reject: 'từ chối',
        lock: 'khóa',
        unlock: 'mở khóa',
        delete: 'xóa',
        null: '',
      };
      setError(err instanceof Error ? err.message : `Không thể ${actionNames[actionType]} thành viên`);
      console.error(`Error ${actionType}ing:`, err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        const matchSearch =
          !search ||
          (member.fullName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          (member.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          String(member.accountId).includes(search);

        const matchStatus = !statusFilter || member.status === statusFilter;

        return matchSearch && matchStatus;
      }),
    [search, statusFilter, members]
  );

  const isLocked = (status: string | null | undefined): boolean => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    return statusLower === 'locked' || statusLower === 'inactive';
  };

  return (
    <LeaderLayout
      title="Quản lý thành viên & đơn"
      subtitle="Duyệt đơn đăng ký, cập nhật vai trò và nắm nhanh sức khỏe đội ngũ"
    >
      <div className="space-y-8">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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

          {isLoading ? (
            <div className="mt-5 flex items-center justify-center py-8">
              <p className="text-slate-500">Đang tải...</p>
            </div>
          ) : mappedPendingApplications.length === 0 ? (
            <div className="mt-5 flex items-center justify-center py-8">
              <p className="text-slate-500">Không có đơn đăng ký nào đang chờ duyệt</p>
            </div>
          ) : (
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
                  {mappedPendingApplications.map((application) => (
                    <tr key={application.id} className="border-t border-slate-200 hover:bg-slate-50">
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
                          <button
                            onClick={() => handleOpenModal(application, 'approve')}
                            className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenModal(application, 'reject')}
                            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 font-semibold text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                placeholder="Tìm theo tên hoặc email..."
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
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-4 flex items-center justify-center py-8">
              <p className="text-slate-500">Đang tải danh sách thành viên...</p>
            </div>
          ) : error && error.includes('thành viên') ? (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchMembers}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="mt-4 flex items-center justify-center py-8">
              <p className="text-slate-500">
                {members.length === 0 ? 'Chưa có thành viên nào trong CLB' : 'Không tìm thấy thành viên phù hợp với bộ lọc'}
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-600">
                  <tr>
                    <th className="w-1/4 min-w-[180px] px-4 py-3">Thành viên</th>
                    <th className="w-1/6 px-4 py-3">Email</th>
                    <th className="w-1/6 px-4 py-3">Ngày gia nhập</th>
                    <th className="w-1/6 px-4 py-3">Trạng thái</th>
                    <th className="w-1/4 px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    const locked = isLocked(member.status);
                    return (
                      <tr key={member.membershipId} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="w-1/4 min-w-[180px] px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {member.fullName || `Account #${member.accountId}`}
                            </span>
                            {member.phone && (
                              <span className="text-[0.72rem] text-slate-500">{member.phone}</span>
                            )}
                          </div>
                        </td>
                        <td className="w-1/6 px-4 py-3 whitespace-nowrap text-slate-700">{member.email || '--'}</td>
                        <td className="w-1/6 px-4 py-3 whitespace-nowrap text-slate-700">
                          {formatDate(member.joinDate)}
                        </td>
                        <td className="w-1/6 px-4 py-3 text-right">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              member.status?.toLowerCase() === 'active' || member.status?.toLowerCase() === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : locked
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : member.status?.toLowerCase() === 'pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {member.status || '--'}
                          </span>
                        </td>
                        <td className="w-1/4 px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            {locked ? (
                              <button
                                onClick={() => handleOpenMemberModal(member, 'unlock')}
                                className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                Mở khóa
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenMemberModal(member, 'lock')}
                                className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                              >
                                Khóa
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenMemberModal(member, 'delete')}
                              className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Approve/Reject/Lock/Unlock/Delete Modal */}
      {(selectedApplication || selectedMember) && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {actionType === 'approve' && 'Chấp nhận đơn đăng ký'}
                {actionType === 'reject' && 'Từ chối đơn đăng ký'}
                {actionType === 'lock' && 'Khóa thành viên'}
                {actionType === 'unlock' && 'Mở khóa thành viên'}
                {actionType === 'delete' && 'Xóa thành viên'}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {actionType === 'approve' && `Bạn có chắc chắn muốn chấp nhận đơn đăng ký của `}
                {actionType === 'reject' && `Bạn có chắc chắn muốn từ chối đơn đăng ký của `}
                {actionType === 'lock' && `Bạn có chắc chắn muốn khóa thành viên `}
                {actionType === 'unlock' && `Bạn có chắc chắn muốn mở khóa thành viên `}
                {actionType === 'delete' && `Bạn có chắc chắn muốn xóa thành viên `}
                <span className="font-semibold">
                  {selectedApplication?.name || selectedMember?.name}
                </span>
                ?
              </p>
            </div>

            {(actionType === 'reject' || actionType === 'lock' || actionType === 'delete') && (
              <div className="mb-6">
                <label htmlFor="note" className="mb-2 block text-sm font-medium text-slate-700">
                  {actionType === 'reject' && 'Lý do từ chối'}
                  {actionType === 'lock' && 'Ghi chú (tùy chọn)'}
                  {actionType === 'delete' && 'Lý do xóa (tùy chọn)'}
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    actionType === 'reject'
                      ? 'Nhập lý do từ chối...'
                      : actionType === 'lock'
                        ? 'Nhập ghi chú (nếu có)...'
                        : 'Nhập lý do xóa (nếu có)...'
                  }
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required={actionType === 'reject'}
                />
              </div>
            )}

            {actionType === 'approve' && (
              <div className="mb-6">
                <label htmlFor="note" className="mb-2 block text-sm font-medium text-slate-700">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú (nếu có)..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isProcessing}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing || (actionType === 'reject' && !note.trim())}
                className={`flex-1 rounded-lg px-4 py-2 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'approve' || actionType === 'unlock'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isProcessing
                  ? 'Đang xử lý...'
                  : actionType === 'approve'
                    ? 'Chấp nhận'
                    : actionType === 'reject'
                      ? 'Từ chối'
                      : actionType === 'lock'
                        ? 'Khóa'
                        : actionType === 'unlock'
                          ? 'Mở khóa'
                          : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </LeaderLayout>
  );
}

export default ClubLeaderMembersPage;
