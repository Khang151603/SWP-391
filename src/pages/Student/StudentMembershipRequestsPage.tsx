import { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { membershipService } from '../../api/services/membership.service';
import type { StudentMembershipRequestResponse } from '../../api/types/membership.types';

function StudentMembershipRequestsPage() {
  const [membershipRequests, setMembershipRequests] = useState<StudentMembershipRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembershipRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const requests = await membershipService.getStudentRequests();
        setMembershipRequests(requests);
      } catch (err) {
        console.error('Error fetching membership requests:', err);
        setError('Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipRequests();
  }, []);

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return statusColors[status.toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: 'Đang chờ',
      approved: 'Đã chấp nhận',
      rejected: 'Đã từ chối',
    };
    return statusLabels[status.toLowerCase()] || status;
  };

  return (
    <StudentLayout
      title="Yêu cầu tham gia CLB"
      subtitle="Xem và theo dõi trạng thái các yêu cầu tham gia CLB của bạn"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto max-w-md space-y-3">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-sm text-slate-600">Đang tải danh sách yêu cầu...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-10 text-center shadow-sm">
            <div className="mx-auto max-w-md space-y-3">
              <h4 className="text-lg font-semibold text-red-700">Lỗi tải dữ liệu</h4>
              <p className="text-sm text-slate-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : membershipRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto max-w-md space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900">Chưa có yêu cầu nào</h4>
              <p className="text-sm text-slate-600">
                Bạn chưa gửi yêu cầu tham gia CLB nào. Hãy khám phá và đăng ký tham gia CLB phù hợp với bạn.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Danh sách yêu cầu</p>
                <p className="mt-1 text-sm text-slate-600">
                  Tổng cộng{' '}
                  <span className="font-semibold text-slate-900">{membershipRequests.length}</span>{' '}
                  yêu cầu
                </p>
              </div>
            </div>

            {/* Bảng hiển thị dữ liệu */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                        CLB
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Lý do tham gia
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Ngày gửi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Phí tham gia
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Mã thanh toán
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {membershipRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-semibold text-slate-900">{request.clubName}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusLabel(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs text-sm text-slate-700">
                            {request.note ? (
                              <p className="line-clamp-2">{request.note}</p>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-slate-900">
                            {new Date(request.requestDate).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(request.requestDate).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-semibold text-emerald-700">
                            {request.amount !== null && request.amount > 0
                              ? `${request.amount.toLocaleString('vi-VN')}đ`
                              : 'Miễn phí'}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-slate-900">
                            {request.paymentId ? (
                              <span className="font-mono">#{request.paymentId}</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentMembershipRequestsPage;

