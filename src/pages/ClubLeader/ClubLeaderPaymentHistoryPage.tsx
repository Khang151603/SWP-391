import { useState, useEffect, useCallback } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { paymentService } from '../../api/services/payment.service';
import { clubService } from '../../api/services/club.service';
import type { ClubLeaderPaymentHistory } from '../../api/types/payment.types';
import type { LeaderClubListItem } from '../../api/types/club.types';
import { showErrorToast } from '../../utils/toast';
import { cn } from '../../components/utils/cn';

function ClubLeaderPaymentHistoryPage() {
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [clubs, setClubs] = useState<LeaderClubListItem[]>([]);
  const [payments, setPayments] = useState<ClubLeaderPaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
      showErrorToast(
        err instanceof Error 
          ? err.message 
          : 'Không thể tải danh sách CLB'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Fetch payment history
  const fetchPaymentHistory = useCallback(async (clubId: number | null) => {
    if (!clubId) {
      setPayments([]);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await paymentService.getClubPaymentHistory(clubId);
      setPayments(data);
    } catch (error) {
      showErrorToast(
        error instanceof Error 
          ? error.message 
          : 'Không thể tải lịch sử thanh toán. Vui lòng thử lại.'
      );
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load clubs on mount
  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  // Load payment history when club is selected
  useEffect(() => {
    fetchPaymentHistory(selectedClubId);
  }, [selectedClubId, fetchPaymentHistory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa có';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getStatusLabel = (status: string): string => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Đang chờ';
      case 'created':
        return 'Đã tạo';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'paid') {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
          Đã thanh toán
        </span>
      );
    } else if (statusLower === 'pending') {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
          Đang chờ
        </span>
      );
    } else if (statusLower === 'created') {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          Đã tạo
        </span>
      );
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
          {statusLower === 'failed' ? 'Thất bại' : 'Đã hủy'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
        {getStatusLabel(status)}
      </span>
    );
  };

  const filteredPayments = payments.filter((payment) => {
    if (filterStatus === 'all') return true;
    return payment.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const selectedClub = clubs.find((club) => club.id === selectedClubId);

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status.toLowerCase() === 'paid').length,
    pending: payments.filter((p) => p.status.toLowerCase() === 'pending').length,
    totalAmount: payments
      .filter((p) => p.status.toLowerCase() === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <LeaderLayout 
      title="Lịch sử thanh toán" 
      subtitle="Xem lịch sử thanh toán của thành viên trong từng CLB"
    >
      <div className="mx-auto max-w-7xl">
        {/* Club Selector */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Chọn CLB</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {selectedClub?.name || 'Chưa chọn CLB'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedClubId || ''}
                onChange={(e) => setSelectedClubId(e.target.value ? Number(e.target.value) : null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Chọn CLB</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => fetchPaymentHistory(selectedClubId)}
                disabled={!selectedClubId || isLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {!selectedClubId ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Vui lòng chọn CLB</h3>
            <p className="mt-2 text-sm text-slate-600">
              Chọn một CLB từ danh sách ở trên để xem lịch sử thanh toán.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tổng giao dịch</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Đã thanh toán</p>
                    <p className="mt-2 text-2xl font-bold text-green-600">{stats.paid}</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Đang chờ</p>
                    <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="rounded-full bg-yellow-100 p-3">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tổng đã thanh toán</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{formatCurrency(stats.totalAmount)}</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 border-b border-slate-200">
              <button
                onClick={() => setFilterStatus('all')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  filterStatus === 'all'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Tất cả ({payments.length})
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  filterStatus === 'paid'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Đã thanh toán ({stats.paid})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  filterStatus === 'pending'
                    ? 'border-b-2 border-yellow-600 text-yellow-600'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Đang chờ ({stats.pending})
              </button>
            </div>

            {/* Payment List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-sm text-slate-600">Đang tải lịch sử thanh toán...</p>
                </div>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Chưa có giao dịch nào</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {filterStatus === 'all' 
                    ? 'CLB này chưa có giao dịch thanh toán nào.' 
                    : `Không có giao dịch với trạng thái "${getStatusLabel(filterStatus)}".`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left Section */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">{payment.clubName}</h3>
                            {payment.description && (
                              <p className="mt-1 text-sm text-slate-600">{payment.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">{formatCurrency(payment.amount)}</p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {payment.fullName && (
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-slate-600">Người thanh toán:</span>
                              <span className="font-medium text-slate-900">{payment.fullName}</span>
                            </div>
                          )}
                          {payment.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-slate-600">Email:</span>
                              <span className="font-medium text-slate-900">{payment.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-slate-600">Ngày thanh toán:</span>
                            <span className="font-medium text-slate-900">{formatDate(payment.paidDate)}</span>
                          </div>
                          {payment.method && (
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              <span className="text-slate-600">Phương thức:</span>
                              <span className="font-medium text-slate-900">{payment.method}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderPaymentHistoryPage;

