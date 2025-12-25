import { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { membershipService } from '../../api/services/membership.service';
import { paymentService } from '../../api/services/payment.service';
import type { StudentMembershipRequestResponse } from '../../api/types/membership.types';
import { cn } from '../../components/utils/cn';

function StudentMembershipRequestsPage() {
  const [membershipRequests, setMembershipRequests] = useState<StudentMembershipRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<StudentMembershipRequestResponse | null>(null);

  useEffect(() => {
    const fetchMembershipRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const requests = await membershipService.getStudentRequests();
        setMembershipRequests(requests);
      } catch{
        const message = 'Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipRequests();

    // Check for payment status in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success' || paymentStatus === 'cancelled') {
      // Refresh data after payment action
      setTimeout(() => {
        fetchMembershipRequests();
        // Remove query params from URL
        window.history.replaceState({}, '', window.location.pathname);
      }, 1000);
    }
  }, []);

  // Lấy payment status từ request (created, pending, paid, cancelled)
  const getPaymentStatus = (request: StudentMembershipRequestResponse): string => {
    const status = request.status?.toLowerCase() || '';
    
    // Nếu có paymentId → đã được leader duyệt, hiển thị payment status
    if (request.paymentId !== null && request.paymentId !== undefined) {
      if (status === 'created' || status === 'pending' || status === 'paid' || status === 'cancelled') {
        return status;
      }
      // Nếu status là "awaiting payment" nhưng có paymentId → có thể là created
      if (status === 'awaiting payment') {
        return 'created';
      }
    }
    
    // Nếu chưa có paymentId → chưa được leader duyệt
    if (status === 'pending' || status === 'pending_request') {
      return 'pending_request'; // Đang chờ duyệt
    }
    
    // Các trạng thái khác
    if (status === 'paid') {
      return 'paid';
    }
    if (status === 'reject' || status === 'rejected') {
      return 'rejected';
    }
    if (status === 'approved') {
      return 'approved'; // Đã chấp nhận (không có phí)
    }
    
    return status;
  };

  const getStatusColor = (request: StudentMembershipRequestResponse) => {
    const paymentStatus = getPaymentStatus(request);
    const statusColors: Record<string, string> = {
      pending_request: 'bg-yellow-100 text-yellow-800 border-yellow-300', // Đang chờ duyệt
      created: 'bg-blue-100 text-blue-800 border-blue-300', // Đã duyệt - Chờ thanh toán
      pending: 'bg-orange-100 text-orange-800 border-orange-300', // Đang chờ thanh toán
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-300', // Đã thanh toán
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300', // Đã hủy thanh toán
      rejected: 'bg-red-100 text-red-800 border-red-300', // Đã từ chối
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-300', // Đã chấp nhận (không có phí)
      'awaiting payment': 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return statusColors[paymentStatus] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  const getStatusLabel = (request: StudentMembershipRequestResponse) => {
    const paymentStatus = getPaymentStatus(request);
    const statusLabels: Record<string, string> = {
      pending_request: 'Đang chờ duyệt', // Leader chưa duyệt
      created: 'Đã duyệt - Chờ thanh toán', // Đã duyệt, chưa thanh toán
      pending: 'Đang chờ thanh toán', // Đã tạo payment link, đang chờ thanh toán
      paid: 'Đã thanh toán', // Đã thanh toán thành công
      cancelled: 'Đã hủy thanh toán', // Đã hủy thanh toán
      rejected: 'Đã từ chối', // Leader từ chối
      approved: 'Đã chấp nhận', // Đã chấp nhận (không có phí)
      'awaiting payment': 'Chờ thanh toán',
    };
    return statusLabels[paymentStatus] || paymentStatus;
  };

  const handlePayment = async (request: StudentMembershipRequestResponse) => {
    if (!request.amount || request.amount <= 0) {
      return;
    }

    if (!request.paymentId) {
      setPaymentError('Không tìm thấy thông tin thanh toán. Vui lòng thử lại sau.');
      return;
    }

    try {
      setProcessingPayment(request.id);
      setPaymentError(null);
      
      // Gọi API tạo payment link (chuyển từ created/cancelled sang pending)
      // API chỉ cần paymentId, không cần body
      const paymentResponse = await paymentService.createPayOSPayment(request.paymentId);

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
        // Refresh data trước khi redirect để cập nhật status
        await membershipService.getStudentRequests().then(requests => {
          setMembershipRequests(requests);
        });
        
        // Redirect to PayOS checkout page
        window.location.href = checkoutUrl;
      } else {
        throw new Error(
          typeof paymentResponse === 'object' 
            ? paymentResponse.message || 'Không thể tạo link thanh toán'
            : 'Không thể tạo link thanh toán'
        );
      }
    } catch (err: any) {
      const message = err?.message || 'Không thể tạo link thanh toán. Vui lòng thử lại sau.';
      setPaymentError(message);
      setProcessingPayment(null);
    }
  };

  const handleCancelPayment = async (request: StudentMembershipRequestResponse) => {
    if (!request.paymentId) {
      setPaymentError('Không tìm thấy thông tin thanh toán.');
      return;
    }

    try {
      setProcessingPayment(request.id);
      setPaymentError(null);
      
      // Gọi API cancel payment (chuyển từ pending sang cancelled)
      await paymentService.cancelPayment(request.paymentId);
      
      // Refresh data để cập nhật status
      const requests = await membershipService.getStudentRequests();
      setMembershipRequests(requests);
      setProcessingPayment(null);
    } catch (err: any) {
      const message = err?.message || 'Không thể hủy thanh toán. Vui lòng thử lại sau.';
      setPaymentError(message);
      setProcessingPayment(null);
    }
  };

  const canMakePayment = (request: StudentMembershipRequestResponse): boolean => {
    // Hiển thị nút "Thanh toán" khi status là created hoặc cancelled
    const paymentStatus = getPaymentStatus(request);
    return (
      (paymentStatus === 'created' || paymentStatus === 'cancelled') &&
      request.paymentId !== null &&
      request.paymentId !== undefined &&
      request.amount !== null &&
      request.amount > 0
    );
  };

  const canCancelPayment = (request: StudentMembershipRequestResponse): boolean => {
    // Hiển thị nút "Huỷ thanh toán" khi status là pending
    const paymentStatus = getPaymentStatus(request);
    return (
      paymentStatus === 'pending' &&
      request.paymentId !== null &&
      request.paymentId !== undefined
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
        {paymentError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paymentError}
          </div>
        )}
        
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
                          <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-medium', getStatusColor(request))}>
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
                            {(() => {
                              const date = new Date(request.requestDate);
                              const day = String(date.getDate()).padStart(2, '0');
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const year = date.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>Xem chi tiết</span>
                            </button>
                            {isPaymentCompleted(request) ? (
                              <span className="text-xs text-slate-400">—</span>
                            ) : canCancelPayment(request) ? (
                              <button
                                onClick={() => handleCancelPayment(request)}
                                disabled={processingPayment === request.id}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    <span>Huỷ thanh toán</span>
                                  </>
                                )}
                              </button>
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

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Chi tiết yêu cầu</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{selectedRequest.clubName}</h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</span>
                  <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-medium', getStatusColor(selectedRequest))}>
                    {getStatusLabel(selectedRequest)}
                  </span>
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Ngày gửi</p>
                  <p>
                    {(() => {
                      const date = new Date(selectedRequest.requestDate);
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </p>
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Phí tham gia</p>
                  <p>{selectedRequest.amount !== null && selectedRequest.amount > 0 ? `${selectedRequest.amount.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Lý do tham gia</p>
                  <p className="mt-1 whitespace-pre-line">
                    {selectedRequest.note ? selectedRequest.note : 'Không có ghi chú'}
                  </p>
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Chuyên ngành</p>
                  <p className="mt-1">{selectedRequest.major || '—'}</p>
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Kỹ năng</p>
                  <p className="mt-1">{selectedRequest.skills || '—'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}

export default StudentMembershipRequestsPage;

