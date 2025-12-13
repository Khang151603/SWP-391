import { useMemo, useState, useEffect } from 'react';
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
  
  // Modal state
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch clubs
  const fetchClubs = async () => {
    try {
      const data = await clubService.getMyLeaderClubs();
      setClubs(data);
      // Auto-select first club if available
      if (data.length > 0 && !selectedClubId) {
        setSelectedClubId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách CLB');
      console.error('Error fetching clubs:', err);
    }
  };

  // Fetch members
  const fetchMembers = async (clubId: number | null) => {
    if (!clubId) {
      setMembers([]);
      return;
    }
    try {
      const data = await membershipService.getLeaderClubMembers(clubId);
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

  // Load clubs on mount
  useEffect(() => {
    fetchClubs();
  }, []);

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
  }, [selectedClubId]);

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

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status?.toLowerCase() === 'active' || m.status?.toLowerCase() === 'approved').length;

  // Handle lock/unlock/delete actions
  const handleOpenMemberModal = (member: ClubMemberDto, type: 'lock' | 'unlock' | 'delete') => {
    setSelectedMember({
      membershipId: member.membershipId,
      name: member.fullName || `Account #${member.accountId}`,
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
    } catch (err) {
      const actionNames: Record<Exclude<ActionType, null>, string> = {
        lock: 'khóa',
        unlock: 'mở khóa',
        delete: 'xóa',
      };
      const actionName = actionType ? actionNames[actionType] : 'thực hiện hành động';
      setError(err instanceof Error ? err.message : `Không thể ${actionName} thành viên`);
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

        return matchSearch;
      }),
    [search, members]
  );

  const isLocked = (status: string | null | undefined): boolean => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    return statusLower === 'locked' || statusLower === 'inactive';
  };

  return (
    <LeaderLayout
      title="Quản lý thành viên"
      subtitle="Quản lý thành viên các câu lạc bộ"
    >
      <div className="space-y-8">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Top overview cards */}
        <section className="grid gap-4 md:grid-cols-2">
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
                value={selectedClubId || ''}
                onChange={(e) => setSelectedClubId(e.target.value ? Number(e.target.value) : null)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Chọn CLB</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
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
                onClick={() => fetchMembers(selectedClubId)}
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
