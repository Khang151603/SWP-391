import { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { membershipService } from '../../api/services/membership.service';
import { paymentService } from '../../api/services/payment.service';
import type { StudentMembershipRequestResponse } from '../../api/types/membership.types';

function StudentMembershipRequestsPage() {
  const [membershipRequests, setMembershipRequests] = useState<StudentMembershipRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);

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

    // Check for payment status in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      // Refresh data after successful payment
      setTimeout(() => {
        fetchMembershipRequests();
        // Remove query params from URL
        window.history.replaceState({}, '', window.location.pathname);
      }, 1000);
    }
  }, []);

  const getStatusColor = (request: StudentMembershipRequestResponse) => {
    const status = getNormalizedStatus(request);
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      approved_pending_payment: 'bg-orange-100 text-orange-800 border-orange-300',
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      'awaiting payment': 'bg-orange-100 text-orange-800 border-orange-300',
      reject: 'bg-red-100 text-red-800 border-red-300',
    };
    return statusColors[status.toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  const getStatusLabel = (request: StudentMembershipRequestResponse) => {
    const status = getNormalizedStatus(request);
    const statusLabels: Record<string, string> = {
      pending: 'Đang chờ',
      approved: 'Đã chấp nhận',
      rejected: 'Đã từ chối',
      approved_pending_payment: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      'awaiting payment': 'Chờ thanh toán',
      reject: 'Đã từ chối',
    };
    return statusLabels[status.toLowerCase()] || status;
  };

  // Normalize status based on backend logic
  const getNormalizedStatus = (request: StudentMembershipRequestResponse): string => {
    const status = request.status.toLowerCase();
    
    // Nếu status = "pending" nhưng có paymentId → đã approve, đang chờ thanh toán
    if (status === 'pending' && request.paymentId !== null && request.paymentId !== undefined) {
      return 'approved_pending_payment';
    }
    
    // Nếu status = "paid" → đã thanh toán
    if (status === 'paid') {
      return 'paid';
    }
    
    // Nếu status = "reject" hoặc "rejected" → đã từ chối
    if (status === 'reject' || status === 'rejected') {
      return 'rejected';
    }
    
    // Nếu status = "awaiting payment" → chờ thanh toán
    if (status === 'awaiting payment') {
      return 'approved_pending_payment';
    }
    
    // Các trạng thái khác giữ nguyên
    return request.status;
  };

  // Xác định trạng thái thanh toán
  const getPaymentStatus = (request: StudentMembershipRequestResponse): 'paid' | 'approve_pending_payment' | 'unpaid' => {
    const status = request.status.toLowerCase();
    
    // paid: đã thanh toán - status là "paid" hoặc (status là "approved" và có paymentId)
    if (status === 'paid' || (status === 'approved' && request.paymentId !== null && request.paymentId !== undefined)) {
      return 'paid';
    }
    
    // approve_pending_payment: đã duyệt, chờ thanh toán - status là approved_pending_payment
    if (status === 'approved_pending_payment') {
      return 'approve_pending_payment';
    }
    
    // unpaid: chưa thanh toán - pending hoặc các trạng thái khác chưa có paymentId
    return 'unpaid';
  };

  const handlePayment = async (request: StudentMembershipRequestResponse) => {
    if (!request.amount || request.amount <= 0) {
      return;
    }

    try {
      setProcessingPayment(request.id);
      const paymentResponse = await paymentService.createMembershipPayment({
        membershipRequestId: request.id,
        paymentId: request.paymentId,
        amount: request.amount,
        clubName: request.clubName,
      });

      // Handle both string URL and object response
      let checkoutUrl: string | null = null;
      
      if (typeof paymentResponse === 'string') {
        // Response is a direct URL string
        checkoutUrl = paymentResponse;
      } else if (paymentResponse.error === 0 && paymentResponse.data?.checkoutUrl) {
        // Response is an object with checkoutUrl
        checkoutUrl = paymentResponse.data.checkoutUrl;
      }
      
      if (checkoutUrl) {
        // Redirect to PayOS checkout page
        window.location.href = checkoutUrl;
      } else {
        throw new Error(
          typeof paymentResponse === 'object' 
            ? paymentResponse.message || 'Không thể tạo link thanh toán'
            : 'Không thể tạo link thanh toán'
        );
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      alert(err instanceof Error ? err.message : 'Không thể tạo link thanh toán. Vui lòng thử lại sau.');
      setProcessingPayment(null);
    }
  };

  const canMakePayment = (request: StudentMembershipRequestResponse): boolean => {
    // Chỉ hiển thị nút thanh toán khi đã approve và đang chờ thanh toán
    const normalizedStatus = getNormalizedStatus(request).toLowerCase();
    return (
      normalizedStatus === 'approved_pending_payment' &&
      request.amount !== null &&
      request.amount > 0
    );
  };

  const isPaymentCompleted = (request: StudentMembershipRequestResponse): boolean => {
    // Đã thanh toán nếu payment status là paid
    return getPaymentStatus(request) === 'paid';
  };

  return (
    <StudentLayout
      title="Yêu cầu tham gia CLB"
      subtitle="Xem và theo dõi trạng thái các yêu cầu tham gia CLB của bạn"
    >
      <div className="space-y-8">
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
                        Thao tác
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
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(request)}`}>
                            {getStatusLabel(request)}
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
                          {isPaymentCompleted(request) ? (
                            <span className="text-xs text-slate-400">—</span>
                          ) : canMakePayment(request) ? (
                            <button
                              onClick={() => handlePayment(request)}
                              disabled={processingPayment === request.id}
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingPayment === request.id ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  <span>Đang xử lý...</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                  </svg>
                                  <span>Thanh toán</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
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

