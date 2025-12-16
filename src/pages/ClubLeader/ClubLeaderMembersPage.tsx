import { useCallback, useMemo, useState, useEffect } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { membershipService } from '../../api/services/membership.service';
import { clubService } from '../../api/services/club.service';
import type { ClubMemberDto } from '../../api/types/membership.types';
import type { LeaderClubListItem } from '../../api/types/club.types';

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

  // Format date from ISO string to DD/MM/YYYY
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
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
    if (normalized === 'locked' || normalized === 'inactive') {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-300';
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
      
      handleCloseModal();
    } catch {
      const actionNames: Record<Exclude<ActionType, null>, string> = {
        lock: 'khóa',
        unlock: 'mở khóa',
        delete: 'xóa',
      };
      const actionName = actionType ? actionNames[actionType] : 'thực hiện hành động';
      setError(`Không thể ${actionName} thành viên. Vui lòng thử lại sau.`);
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Tổng quan thành viên</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                {selectedClub?.name || 'Chọn CLB để xem thành viên'}
              </h3>
              <p className="text-sm text-slate-600">
                Theo dõi nhanh tình trạng tham gia và hành động quản lý thành viên.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
                <span className="text-lg">↻</span>
                Làm mới
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:w-64"
                />
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
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
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  statusFilter === item.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:text-blue-700'
                }`}
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
              <span className="text-3xl">🧭</span>
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
                              {member.member.phone && <span>📞 {member.member.phone}</span>}
                              <span className="rounded-full bg-slate-100 px-2 py-[2px] text-[0.72rem]">
                                ID: {member.member.accountId}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="w-1/6 px-4 py-4 whitespace-nowrap text-slate-700">{member.member.email || '--'}</td>
                        <td className="w-1/6 px-4 py-4 whitespace-nowrap text-slate-700">
                          {formatDate(member.joinDate)}
                        </td>
                        <td className="w-1/6 px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusLabelClass(member.member.status)}`}
                          >
                            {member.member.status || '--'}
                          </span>
                        </td>
                        <td className="w-1/4 px-4 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            {locked ? (
                              <button
                                onClick={() => handleOpenMemberModal(member, 'unlock')}
                                className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                🔓 Mở khóa
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenMemberModal(member, 'lock')}
                                className="inline-flex items-center gap-1 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                              >
                                🔒 Khóa
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenMemberModal(member, 'delete')}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                            >
                              🗑️ Xóa
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
                className={`flex-1 rounded-lg px-4 py-2 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'unlock'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                }`}
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
