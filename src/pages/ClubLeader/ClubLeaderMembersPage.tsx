import { useCallback, useMemo, useState, useEffect } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { membershipService } from '../../api/services/membership.service';
import { clubService } from '../../api/services/club.service';
import type { ClubMemberDto } from '../../api/types/membership.types';
import type { LeaderClubListItem } from '../../api/types/club.types';
import { showSuccessToast } from '../../utils/toast';
import { cn } from '../../components/utils/cn';

type ActionType = 'lock' | 'unlock' | 'delete' | null;

interface SelectedMember {
  membershipId: number;
  name: string;
}

function ClubLeaderMembersPage() {
  const [search, setSearch] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [clubs, setClubs] = useState<LeaderClubListItem[]>([]);
  const [members, setMembers] = useState<ClubMemberDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked' | 'pending'>('all');
  
  // Modal state for members
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingMember, setViewingMember] = useState<ClubMemberDto | null>(null);

  // Fetch clubs
  const fetchClubs = useCallback(async () => {
    try {
      const data = await clubService.getMyLeaderClubs();
      setClubs(data);
      // Auto-select first club if available
      if (data.length > 0 && !selectedClubId) {
        setSelectedClubId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách CLB');
    }
  }, [selectedClubId]);

  // Fetch members
  const fetchMembers = useCallback(async (clubId: number | null) => {
    if (!clubId) {
      setMembers([]);
      return;
    }
    try {
      const data = await membershipService.getLeaderClubMembers(clubId);
      // Ensure data is an array
      if (Array.isArray(data)) {
        setMembers(data);
        // Clear any previous errors when successfully fetching
        setError((prev) => (prev && prev.includes('thành viên') ? null : prev));
      } else {
        setMembers([]);
      }
    } catch {
      setError('Không thể tải danh sách thành viên. Vui lòng thử lại sau.');
      // Set empty array on error to prevent display issues
      setMembers([]);
    }
  }, []);

  // Load clubs on mount
  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  // Load members when club is selected
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchMembers(selectedClubId);
      } finally {
        setIsLoading(false);
      }
    };
    if (selectedClubId) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [selectedClubId, fetchMembers]);

  // Format date from ISO string to DD/MM/YYYY (local timezone)
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

  const isLocked = (status: string): boolean => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    return statusLower === 'locked' || statusLower === 'inactive';
  };

  const statusLabelClass = (status?: string) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'active' || normalized === 'approved') {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (normalized === 'pending') {
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
    if (normalized === 'pending_payment') {
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    }
    if (normalized === 'locked' || normalized === 'inactive' || normalized === 'removed') {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-300';
  };

  const statusLabelText = (status?: string) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'active' || normalized === 'approved') return 'Đang hoạt động';
    if (normalized === 'pending') return 'Đang chờ duyệt';
    if (normalized === 'pending_payment') return 'Chưa thanh toán';
    if (normalized === 'locked' || normalized === 'inactive') return 'Đã khóa';
    if (normalized === 'removed') return 'Đã xóa';
    return 'Không rõ';
  };

  const selectedClub = useMemo(
    () => clubs.find((club) => club.id === selectedClubId),
    [clubs, selectedClubId]
  );

  // Handle lock/unlock/delete actions
  const handleOpenMemberModal = (member: ClubMemberDto, type: 'lock' | 'unlock' | 'delete') => {
    setSelectedMember({
      membershipId: member.membershipId,
      name: member.member.fullName || `Account #${member.member.accountId}`,
    });
    setActionType(type);
    setNote('');
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    setActionType(null);
    setNote('');
  };

  const handleSubmit = async () => {
    if (!actionType) return;

    try {
      setIsProcessing(true);
      setError(null);
      
      if (actionType === 'lock' && selectedMember) {
        await membershipService.lockMember(selectedMember.membershipId, note || null);
      } else if (actionType === 'unlock' && selectedMember) {
        await membershipService.unlockMember(selectedMember.membershipId);
      } else if (actionType === 'delete' && selectedMember) {
        await membershipService.deleteMember(selectedMember.membershipId, note || null);
      }
      
      // Refresh members list
      await fetchMembers(selectedClubId);
      
      const actionNames: Record<Exclude<ActionType, null>, string> = {
        lock: 'khóa',
        unlock: 'mở khóa',
        delete: 'xóa',
      };
      const actionName = actionType ? actionNames[actionType] : 'thực hiện hành động';
      showSuccessToast(`Đã ${actionName} thành viên thành công.`);
      
      handleCloseModal();
    } catch {
      const actionNames: Record<Exclude<ActionType, null>, string> = {
        lock: 'khóa',
        unlock: 'mở khóa',
        delete: 'xóa',
      };
      const actionName = actionType ? actionNames[actionType] : 'thực hiện hành động';
      const errorMessage = `Không thể ${actionName} thành viên. Vui lòng thử lại sau.`;
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        const matchSearch =
          !search ||
          (member.member.fullName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          (member.member.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          String(member.member.accountId).includes(search);

        const normalizedStatus = member.member.status?.toLowerCase();
        const matchStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' &&
            (normalizedStatus === 'active' || normalizedStatus === 'approved')) ||
          (statusFilter === 'pending' && normalizedStatus === 'pending') ||
          (statusFilter === 'locked' && isLocked(member.member.status));

        return matchSearch && matchStatus;
      }),
    [search, members, statusFilter]
  );

  return (
    <LeaderLayout
      title="Quản lý thành viên"
      subtitle="Quản lý thành viên các câu lạc bộ"
    >
      <div className="space-y-6">
        {/* Banner / context */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-[0.7rem] uppercase tracking-[0.35em] text-blue-600">Tổng quan thành viên</p>
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {selectedClub?.name || 'Chọn CLB để xem thành viên'}
                </h3>
                <p className="text-sm text-slate-600">
                  Quản lý trạng thái tham gia, khóa/mở và xóa thành viên trong CLB.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedClubId || ''}
                onChange={(e) => setSelectedClubId(e.target.value ? Number(e.target.value) : null)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Chọn CLB</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => fetchMembers(selectedClubId)}
                disabled={!selectedClubId || isLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Làm mới danh sách
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {/* Filters + search */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Thành viên</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Danh sách và thao tác nhanh</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên, email hoặc ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'active', label: 'Đang hoạt động' },
              { key: 'pending', label: 'Đang chờ' },
              { key: 'locked', label: 'Đã khóa' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key as typeof statusFilter)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition',
                  statusFilter === item.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:text-blue-700'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Members table */}
          {isLoading ? (
            <div className="grid gap-3">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-14 animate-pulse rounded-lg bg-slate-100/80"
                />
              ))}
            </div>
          ) : error && error.includes('thành viên') ? (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchMembers(selectedClubId)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-slate-600">
              <p className="text-base font-semibold text-slate-800">
                {members.length === 0 ? 'Chưa có thành viên nào trong CLB' : 'Không tìm thấy thành viên phù hợp với bộ lọc'}
              </p>
              <p className="text-sm text-slate-500">Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác.</p>
            </div>
          ) : (
            <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-600">
                  <tr>
                    <th className="w-1/4 min-w-[200px] px-4 py-3">Thành viên</th>
                    <th className="w-1/6 px-4 py-3">Email</th>
                    <th className="w-1/6 px-4 py-3">Ngày gia nhập</th>
                    <th className="w-1/6 px-4 py-3">Trạng thái</th>
                    <th className="w-1/4 px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => {
                    const locked = isLocked(member.member.status);
                    return (
                      <tr key={member.membershipId} className="bg-white hover:bg-slate-50/60">
                        <td className="w-1/4 min-w-[200px] px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-900">
                              {member.member.fullName || `Account #${member.member.accountId}`}
                            </span>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                              {member.member.phone && <span>{member.member.phone}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="w-1/6 px-4 py-4 whitespace-nowrap text-slate-700">{member.member.email || '--'}</td>
                        <td className="w-1/6 px-4 py-4 whitespace-nowrap text-slate-700">
                          {formatDate(member.joinDate)}
                        </td>
                        <td className="w-1/6 px-4 py-4">
                          <span
                            className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold', statusLabelClass(member.member.status))}
                          >
                            {statusLabelText(member.member.status)}
                          </span>
                        </td>
                        <td className="w-1/4 px-4 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              onClick={() => setViewingMember(member)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Xem chi tiết"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              Xem
                            </button>
                            {locked ? (
                              <button
                                onClick={() => handleOpenMemberModal(member, 'unlock')}
                                className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                Mở khóa
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenMemberModal(member, 'lock')}
                                className="inline-flex items-center gap-1 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                              >
                                Khóa
                              </button>
                            )}
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

      {/* View Member Details Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewingMember(null)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Chi tiết thành viên</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Thông tin đầy đủ về thành viên trong CLB
                </p>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="Đóng"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Member Info Section */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Thông tin cá nhân
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Họ và tên</label>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {viewingMember.member.fullName || `Account #${viewingMember.member.accountId}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Account ID</label>
                    <p className="mt-1 text-sm text-slate-700">{viewingMember.member.accountId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Email</label>
                    <p className="mt-1 text-sm text-slate-700">
                      {viewingMember.member.email || '--'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Số điện thoại</label>
                    <p className="mt-1 text-sm text-slate-700">
                      {viewingMember.member.phone || '--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Membership Info Section */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Thông tin thành viên
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Membership ID</label>
                    <p className="mt-1 text-sm text-slate-700">{viewingMember.membershipId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Club ID</label>
                    <p className="mt-1 text-sm text-slate-700">{viewingMember.clubId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Ngày gia nhập</label>
                    <p className="mt-1 text-sm text-slate-700">
                      {formatDate(viewingMember.joinDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Trạng thái</label>
                    <div className="mt-1">
                      <span
                        className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold', statusLabelClass(viewingMember.member.status))}
                      >
                        {statusLabelText(viewingMember.member.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setViewingMember(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock/Unlock/Delete Modal */}
      {selectedMember && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {actionType === 'lock' && 'Khóa thành viên'}
                {actionType === 'unlock' && 'Mở khóa thành viên'}
                {actionType === 'delete' && 'Xóa thành viên'}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {actionType === 'lock' && `Bạn có chắc chắn muốn khóa thành viên `}
                {actionType === 'unlock' && `Bạn có chắc chắn muốn mở khóa thành viên `}
                {actionType === 'delete' && `Bạn có chắc chắn muốn xóa thành viên `}
                <span className="font-semibold">
                  {selectedMember?.name}
                </span>
                ?
              </p>
            </div>

            {(actionType === 'lock' || actionType === 'delete') && (
              <div className="mb-6">
                <label htmlFor="note" className="mb-2 block text-sm font-medium text-slate-700">
                  {actionType === 'lock' && 'Ghi chú (tùy chọn)'}
                  {actionType === 'delete' && 'Lý do xóa (tùy chọn)'}
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    actionType === 'lock'
                      ? 'Nhập ghi chú (nếu có)...'
                      : 'Nhập lý do xóa (nếu có)...'
                  }
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
                disabled={isProcessing}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  actionType === 'unlock'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                )}
              >
                {isProcessing
                  ? 'Đang xử lý...'
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
