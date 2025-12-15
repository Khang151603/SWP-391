import { useMemo, useState, useEffect } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { membershipService } from '../../api/services/membership.service';
import { clubService } from '../../api/services/club.service';
import type { LeaderPendingMembershipRequest } from '../../api/types/membership.types';
import type { LeaderClubListItem } from '../../api/types/club.types';

type RequestActionType = 'approve' | 'reject' | null;

interface SelectedRequest {
  id: number;
  name: string;
  clubName: string;
}

function ClubLeaderRequestsPage() {
  const [search, setSearch] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [clubs, setClubs] = useState<LeaderClubListItem[]>([]);
  const [allRequests, setAllRequests] = useState<LeaderPendingMembershipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state for requests
  const [selectedRequest, setSelectedRequest] = useState<SelectedRequest | null>(null);
  const [requestActionType, setRequestActionType] = useState<RequestActionType>(null);
  const [requestNote, setRequestNote] = useState('');
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  
  // Modal state for viewing student details
  const [viewingStudent, setViewingStudent] = useState<LeaderPendingMembershipRequest | null>(null);

  // Fetch clubs
  const fetchClubs = async () => {
    try {
      const data = await clubService.getMyLeaderClubs();
      setClubs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách CLB');
    }
  };

  // Fetch all requests (pending, approved, and rejected)
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const allData = await membershipService.getLeaderAllRequests();
      setAllRequests(allData);
    } catch (err) {
      setError('Không thể tải danh sách đơn đăng ký. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load clubs and requests on mount
  useEffect(() => {
    fetchClubs();
    fetchRequests();
  }, []);

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

  const pendingRequests = allRequests.filter(r => r.status?.toLowerCase() === 'pending');
  const approvedRequests = allRequests.filter(r => 
    r.status?.toLowerCase() === 'awaiting payment' || 
    r.status?.toLowerCase() === 'approved'
  );
  const rejectedRequests = allRequests.filter(r => r.status?.toLowerCase() === 'reject');

  // Handle approve/reject requests
  const handleOpenRequestModal = (request: LeaderPendingMembershipRequest, type: 'approve' | 'reject') => {
    const club = clubs.find(c => c.id === request.clubId);
    setSelectedRequest({
      id: request.id,
      name: request.fullName,
      clubName: club?.name || `CLB #${request.clubId}`,
    });
    setRequestActionType(type);
    setRequestNote('');
  };

  const handleCloseRequestModal = () => {
    setSelectedRequest(null);
    setRequestActionType(null);
    setRequestNote('');
  };

  const handleViewStudentDetail = (request: LeaderPendingMembershipRequest) => {
    setViewingStudent(request);
  };

  const handleCloseStudentDetail = () => {
    setViewingStudent(null);
  };

  const handleSubmitRequest = async () => {
    if (!requestActionType || !selectedRequest) return;

    try {
      setIsProcessingRequest(true);
      setError(null);
      
      if (requestActionType === 'approve') {
        await membershipService.approveLeaderRequest(selectedRequest.id, { note: requestNote || '' });
      } else if (requestActionType === 'reject') {
        await membershipService.rejectLeaderRequest(selectedRequest.id, { note: requestNote || 'Từ chối' });
      }
      
      // Refresh requests list
      await fetchRequests();
      
      handleCloseRequestModal();
    } catch (err) {
      setError(`Không thể ${requestActionType === 'approve' ? 'duyệt' : 'từ chối'} đơn đăng ký. Vui lòng thử lại sau.`);
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const filteredPendingRequests = useMemo(
    () =>
      pendingRequests.filter((request) => {
        // Filter by club if selected
        if (selectedClubId && request.clubId !== selectedClubId) {
          return false;
        }
        
        // Filter by search
        const matchSearch =
          !search ||
          request.fullName.toLowerCase().includes(search.toLowerCase()) ||
          request.email.toLowerCase().includes(search.toLowerCase()) ||
          request.phone.includes(search);

        return matchSearch;
      }),
    [search, pendingRequests, selectedClubId]
  );

  const processedRequests = [...approvedRequests, ...rejectedRequests];

  const filteredProcessedRequests = useMemo(
    () =>
      processedRequests.filter((request) => {
        // Filter by club if selected
        if (selectedClubId && request.clubId !== selectedClubId) {
          return false;
        }
        
        // Filter by search
        const matchSearch =
          !search ||
          request.fullName.toLowerCase().includes(search.toLowerCase()) ||
          request.email.toLowerCase().includes(search.toLowerCase()) ||
          request.phone.includes(search);

        return matchSearch;
      }),
    [search, processedRequests, selectedClubId]
  );

  return (
    <LeaderLayout
      title="Quản lý đơn đăng ký"
      subtitle="Xem và xử lý các đơn đăng ký thành viên CLB"
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
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Đơn chờ duyệt</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingRequests.length}</p>
          </div>

          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Đơn đã duyệt</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{approvedRequests.length}</p>
          </div>

          <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-red-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Đơn đã từ chối</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{rejectedRequests.length}</p>
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-wrap items-center gap-2 text-sm">
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
            <option value="">Tất cả CLB</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </section>

        {/* Pending Requests table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Đơn chờ duyệt</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Danh sách đơn đăng ký</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-slate-500">Đang tải danh sách đơn...</p>
            </div>
          ) : filteredPendingRequests.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-slate-500">
                {pendingRequests.length === 0 ? 'Chưa có đơn chờ duyệt nào' : 'Không tìm thấy đơn phù hợp với bộ lọc'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-600">
                  <tr>
                    <th className="w-1/6 px-4 py-3">Người đăng ký</th>
                    <th className="w-1/6 px-4 py-3">Email / SĐT</th>
                    <th className="w-1/6 px-4 py-3">CLB</th>
                    <th className="w-1/4 px-4 py-3">Lý do</th>
                    <th className="w-1/8 px-4 py-3">Ngày gửi</th>
                    <th className="w-1/6 px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendingRequests.map((request) => {
                    const club = clubs.find(c => c.id === request.clubId);
                    return (
                      <tr key={request.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{request.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col text-xs">
                            <span className="text-slate-700">{request.email}</span>
                            <span className="text-slate-500">{request.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{club?.name || `CLB #${request.clubId}`}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{request.reason || '--'}</td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                          {formatDate(request.requestDate)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleViewStudentDetail(request)}
                            className="rounded-lg border border-blue-300 bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Xem chi tiết"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Processed Requests table (Approved + Rejected) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Đơn đã xử lý</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Danh sách đơn đã xử lý</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-slate-500">Đang tải...</p>
            </div>
          ) : filteredProcessedRequests.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-slate-500">
                {processedRequests.length === 0 ? 'Chưa có đơn đã xử lý nào' : 'Không tìm thấy đơn phù hợp với bộ lọc'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-600">
                  <tr>
                    <th className="w-1/5 px-4 py-3">Người đăng ký</th>
                    <th className="w-1/6 px-4 py-3">Email / SĐT</th>
                    <th className="w-1/6 px-4 py-3">CLB</th>
                    <th className="w-1/6 px-4 py-3">Ngày gửi</th>
                    <th className="w-1/6 px-4 py-3">Trạng thái</th>
                    <th className="w-1/6 px-4 py-3">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProcessedRequests.map((request) => {
                    const club = clubs.find(c => c.id === request.clubId);
                    const isRejected = request.status?.toLowerCase() === 'reject';
                    return (
                      <tr key={request.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{request.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col text-xs">
                            <span className="text-slate-700">{request.email}</span>
                            <span className="text-slate-500">{request.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{club?.name || `CLB #${request.clubId}`}</td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                          {formatDate(request.requestDate)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isRejected 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{request.note || '--'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Approve/Reject Request Modal */}
      {selectedRequest && requestActionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseRequestModal} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {requestActionType === 'approve' ? 'Duyệt đơn đăng ký' : 'Từ chối đơn đăng ký'}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {requestActionType === 'approve' ? 'Duyệt' : 'Từ chối'} đơn đăng ký của{' '}
                <span className="font-semibold">{selectedRequest.name}</span>
                {' '}vào <span className="font-semibold">{selectedRequest.clubName}</span>?
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="requestNote" className="mb-2 block text-sm font-medium text-slate-700">
                Ghi chú {requestActionType === 'reject' ? '(bắt buộc)' : '(tùy chọn)'}
              </label>
              <textarea
                id="requestNote"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                placeholder={requestActionType === 'approve' ? 'Nhập ghi chú (nếu có)...' : 'Nhập lý do từ chối...'}
                rows={4}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseRequestModal}
                disabled={isProcessingRequest}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={isProcessingRequest}
                className={`flex-1 rounded-lg px-4 py-2 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  requestActionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessingRequest
                  ? 'Đang xử lý...'
                  : requestActionType === 'approve'
                    ? 'Duyệt'
                    : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseStudentDetail} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Thông tin sinh viên</h3>
              <button
                onClick={handleCloseStudentDetail}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Họ và tên</p>
                  <p className="text-sm font-semibold text-slate-900">{viewingStudent.fullName}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Email</p>
                  <p className="text-sm text-slate-900">{viewingStudent.email}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Số điện thoại</p>
                  <p className="text-sm text-slate-900">{viewingStudent.phone}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Ngày gửi đơn</p>
                  <p className="text-sm text-slate-900">{formatDate(viewingStudent.requestDate)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Ngành học</p>
                  <p className="text-sm text-slate-900">{viewingStudent.major || 'Chưa cập nhật'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Kỹ năng</p>
                  <p className="text-sm text-slate-900">{viewingStudent.skills || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">CLB đăng ký</p>
                <p className="text-sm font-semibold text-slate-900">
                  {clubs.find(c => c.id === viewingStudent.clubId)?.name || `CLB #${viewingStudent.clubId}`}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">Lý do tham gia</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{viewingStudent.reason || 'Không có lý do'}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseStudentDetail}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              {viewingStudent.status?.toLowerCase() === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleCloseStudentDetail();
                      handleOpenRequestModal(viewingStudent, 'approve');
                    }}
                    className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => {
                      handleCloseStudentDetail();
                      handleOpenRequestModal(viewingStudent, 'reject');
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition-colors"
                  >
                    Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </LeaderLayout>
  );
}

export default ClubLeaderRequestsPage;
