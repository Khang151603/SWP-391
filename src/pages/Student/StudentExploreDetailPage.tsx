import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { Dialog } from '../../components/ui/Dialog';
import { clubService } from '../../api/services/club.service';
import { membershipService } from '../../api/services/membership.service';
import type { ClubListItem } from '../../api/types/club.types';
import { handleApiError } from '../../api/utils/errorHandler';
import { showSuccessToast } from '../../utils/toast';
import { cn } from '../../components/utils/cn';

function StudentExploreDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState<ClubListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<ClubListItem | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showMemberAlert, setShowMemberAlert] = useState(false);
  const [showPendingPaymentAlert, setShowPendingPaymentAlert] = useState(false);
  const [showPendingRequestAlert, setShowPendingRequestAlert] = useState(false);
  const [membershipRequests, setMembershipRequests] = useState<Array<{
    id: number;
    clubId: number;
    clubName: string;
    status: string;
    paymentId: number | null;
  }>>([]);

  // Fetch membership requests to check pending requests
  useEffect(() => {
    const fetchMembershipRequests = async () => {
      try {
        const requests = await membershipService.getStudentRequests();
        const requestsWithClubId = requests.map((req) => {
          return {
            id: req.id,
            clubId: 0, // Will be set when club is loaded
            clubName: req.clubName,
            status: req.status,
            paymentId: req.paymentId,
          };
        });
        setMembershipRequests(requestsWithClubId);
      } catch (error) {
        // Failed to fetch membership requests
      }
    };
    fetchMembershipRequests();
  }, []);

  // Fetch club details and check membership status
  useEffect(() => {
    const fetchClubDetails = async () => {
      if (!clubId) {
        setError('Không tìm thấy ID câu lạc bộ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch club details
        const clubData = await clubService.getClubDetailsById(clubId);
        setClub(clubData);
        
        // Update membership requests with clubId
        setMembershipRequests(prev => prev.map(req => {
          if (req.clubName === clubData.name) {
            return { ...req, clubId: parseInt(clubId) };
          }
          return req;
        }));
        
        // Check if student is already a member
        try {
          const myClubs = await membershipService.getStudentMyClubs();
          const isAlreadyMember = myClubs.some(item => item.club.id === parseInt(clubId));
          setIsMember(isAlreadyMember);
        } catch (err) {
          // Failed to check membership
        }
      } catch (err) {
        setError('Không thể tải thông tin câu lạc bộ. Vui lòng thử lại sau.');
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubId]);

  const hasPendingRequest = (request: {
    status: string;
    paymentId: number | null;
  }): boolean => {
    const status = request.status?.toLowerCase() || '';
    return status === 'pending' && (request.paymentId === null || request.paymentId === undefined);
  };

  const hasApprovedRequest = (request: {
    status: string;
    paymentId: number | null;
  }): boolean => {
    const status = request.status?.toLowerCase() || '';
    return (request.paymentId !== null && request.paymentId !== undefined) ||
           status === 'awaiting payment' ||
           status === 'created' ||
           (status === 'pending' && request.paymentId !== null && request.paymentId !== undefined);
  };

  const isRejectedRequest = (request: {
    status: string;
  }): boolean => {
    const status = request.status?.toLowerCase() || '';
    return status === 'rejected' || status === 'reject';
  };

  const canRegister = (clubId: number, clubName: string): boolean => {
    // Nếu đã là member hiện tại → không cho phép (đã check ở handleRegister)
    // Nếu không còn là member → có thể đăng ký lại
    
    const existingRequest = membershipRequests.find(
      req => req.clubId === clubId || req.clubName === clubName
    );
    
    // Không có request → cho phép đăng ký
    if (!existingRequest) {
      return true;
    }
    
    // Request bị reject → cho phép đăng ký lại
    if (isRejectedRequest(existingRequest)) {
      return true;
    }
    
    // Nếu không còn là member (đã rời CLB) → cho phép đăng ký lại
    // (bất kể request status là gì, vì đã rời CLB rồi)
    if (!isMember) {
      // Chỉ chặn nếu có pending request hoặc approved request chưa thanh toán
      if (hasPendingRequest(existingRequest) || hasApprovedRequest(existingRequest)) {
        return false;
      }
      // Các trường hợp khác (paid, cancelled, etc.) → cho phép đăng ký lại
      return true;
    }
    
    // Còn là member → không cho phép
    return false;
  };

  const handleRegister = () => {
    if (club) {
      const currentClubId = typeof club.id === 'string' ? parseInt(club.id) : club.id;
      
      // Check if already a member
      if (isMember) {
        setShowMemberAlert(true);
        return;
      }

      // Check if can register (chỉ cho phép khi không có request hoặc đã bị reject)
      if (!canRegister(currentClubId, club.name)) {
        const existingRequest = membershipRequests.find(
          req => req.clubId === currentClubId || req.clubName === club.name
        );
        
        if (existingRequest) {
          if (hasPendingRequest(existingRequest)) {
            setShowPendingRequestAlert(true);
          } else if (hasApprovedRequest(existingRequest)) {
            setShowPendingPaymentAlert(true);
          }
        }
        return;
      }

      setSelectedClub(club);
    }
  };

  const confirmRegistration = async () => {
    if (!club) return;

    try {
      setIsRegistering(true);
      await clubService.joinRequest(club.id, 'Yêu cầu tham gia câu lạc bộ');
      setIsRegistering(false);
      setSelectedClub(null);
      showSuccessToast('Gửi yêu cầu tham gia CLB thành công!');
      navigate('/student/explore');
    } catch (err) {
      setIsRegistering(false);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Check if error is about pending request (đã gửi đơn, chờ duyệt)
      if (errorMessage.includes("đã gửi yêu cầu và đang chờ duyệt") || 
          errorMessage.includes("đang chờ duyệt")) {
        setSelectedClub(null);
        setShowPendingRequestAlert(true);
      } 
      // Check if error is about pending payment (đã được duyệt, chưa thanh toán)
      else if (errorMessage.includes("đơn thanh toán chưa hoàn thành") || 
          errorMessage.includes("thanh toán trước khi gửi yêu cầu mới")) {
        setSelectedClub(null);
        setShowPendingPaymentAlert(true);
      } else {
        handleApiError(err);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <StudentLayout title="Đang tải..." subtitle="Đang tải thông tin câu lạc bộ">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </StudentLayout>
    );
  }

  // Show error state
  if (error || !club) {
    return (
      <StudentLayout title="Lỗi" subtitle="Không thể tải thông tin câu lạc bộ">
        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error || 'Không tìm thấy câu lạc bộ'}</p>
          <Link
            to="/student/explore"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Quay lại danh sách
          </Link>
        </div>
      </StudentLayout>
    );
  }

  const isRecruiting = club.status === 'Active';

  return (
    <StudentLayout
      title={club.name}
      subtitle="Thông tin chi tiết câu lạc bộ"
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/student/explore" className="transition hover:text-white">
            Khám phá CLB
          </Link>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{club.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium',
                  club.status === 'Active' 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    : 'border-slate-500/30 bg-slate-500/10 text-slate-200'
                )}>
                  {club.status === 'Active' ? 'Đang hoạt động' : 'Tạm dừng'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white lg:text-4xl">{club.name}</h1>
              <p className="mt-3 text-slate-300">{club.description}</p>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-3 lg:w-64">
              {isMember ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-800 px-6 py-3 text-base font-semibold text-slate-400"
                >
                  Đã là thành viên
                </button>
              ) : isRecruiting ? (() => {
                const currentClubId = typeof club.id === 'string' ? parseInt(club.id) : club.id;
                const cannotRegister = !canRegister(currentClubId, club.name) || isMember;
                
                if (cannotRegister) {
                  const existingRequest = membershipRequests.find(
                    req => req.clubId === currentClubId || req.clubName === club.name
                  );
                  let buttonText = "Đã gửi đơn";
                  if (existingRequest && hasApprovedRequest(existingRequest)) {
                    buttonText = "Đã được duyệt";
                  }
                  
                  return (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-xl bg-slate-800 px-6 py-3 text-base font-semibold text-slate-400"
                    >
                      {buttonText}
                    </button>
                  );
                }
                
                return (
                  <button
                    onClick={handleRegister}
                    className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-base font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/30"
                  >
                    Đăng ký tham gia
                  </button>
                );
              })() : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-800 px-6 py-3 text-base font-semibold text-slate-400"
                >
                  Đã đóng đơn
                </button>
              )}
              <Link
                to="/student/explore"
                className="w-full rounded-xl border border-white/15 px-6 py-3 text-center text-base font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Quay lại
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Thành viên</p>
            <p className="mt-2 text-2xl font-bold text-white">{club.memberCount || 0}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Chi phí</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {club.membershipFee === 0 ? 'Miễn phí' : `${(club.membershipFee / 1000).toFixed(0)}k`}
            </p>
          </div>
          {club.establishedDate && (
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm">
              <p className="text-sm text-slate-400">Thành lập</p>
              <p className="mt-2 text-sm font-bold text-white">
                {new Date(club.establishedDate).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* About Section */}
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">Giới thiệu</h2>
            <p className="leading-relaxed text-slate-300">{club.description}</p>
          </div>
        </div>
      </div>

      {/* Registration Confirmation Dialog */}
      <Dialog open={selectedClub !== null} onOpenChange={(open) => !open && setSelectedClub(null)}>
        {selectedClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedClub(null)} />
            <div className="relative z-10 w-full max-w-md">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
                <h3 className="mb-4 text-xl font-bold text-white">Xác nhận đăng ký</h3>
                <p className="mb-6 text-slate-300">
                  Bạn có muốn đăng ký tham gia <span className="font-semibold text-violet-200">{selectedClub.name}</span> không?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedClub(null)}
                    className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={confirmRegistration}
                    disabled={isRegistering}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRegistering ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Đang xử lý...
                      </span>
                    ) : (
                      'Xác nhận'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Already Member Alert Dialog */}
      <Dialog open={showMemberAlert} onOpenChange={(open) => !open && setShowMemberAlert(false)}>
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowMemberAlert(false)} />
          <div className="relative z-10 w-full max-w-md">
            <div className="rounded-2xl border border-amber-500/20 bg-slate-950 p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                  <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Đã là thành viên</h3>
              </div>
              <p className="mb-6 text-slate-300">
                Bạn đã là thành viên của <span className="font-semibold text-violet-200">{club?.name}</span> rồi. Không thể đăng ký lại vào câu lạc bộ này.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowMemberAlert(false)}
                  className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Đóng
                </button>
                <Link
                  to="/student/clubs"
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/30"
                >
                  Xem CLB của tôi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Pending Request Alert Dialog - Đã gửi đơn, chờ duyệt */}
      {showPendingRequestAlert && (
        <Dialog
          open={showPendingRequestAlert}
          onOpenChange={(open) => !open && setShowPendingRequestAlert(false)}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPendingRequestAlert(false)}
            />
            <div className="relative z-10 w-full max-w-md">
              <div className="rounded-2xl border border-yellow-300 bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <svg
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Đã gửi đơn
                  </h3>
                </div>
                <p className="mb-6 text-slate-600">
                  Bạn đã gửi yêu cầu tham gia{" "}
                  <span className="font-semibold text-blue-700">
                    {club?.name}
                  </span>{" "}
                  và đang chờ duyệt. Vui lòng chờ leader duyệt đơn trước khi gửi yêu cầu mới.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPendingRequestAlert(false)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                  <Link
                    to="/student/membership-requests"
                    className="flex-1 rounded-xl bg-yellow-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-yellow-700"
                  >
                    Xem yêu cầu của tôi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Pending Payment Alert Dialog */}
      {showPendingPaymentAlert && (
        <Dialog
          open={showPendingPaymentAlert}
          onOpenChange={(open) => !open && setShowPendingPaymentAlert(false)}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPendingPaymentAlert(false)}
            />
            <div className="relative z-10 w-full max-w-md">
              <div className="rounded-2xl border border-orange-300 bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <svg
                      className="h-6 w-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Chưa thanh toán
                  </h3>
                </div>
                <p className="mb-6 text-slate-600">
                  Bạn đã có yêu cầu tham gia{" "}
                  <span className="font-semibold text-blue-700">
                    {club?.name}
                  </span>{" "}
                  nhưng chưa thanh toán. Vui lòng thanh toán yêu cầu hiện tại trước khi gửi yêu cầu mới.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPendingPaymentAlert(false)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                  <Link
                    to="/student/membership-requests"
                    className="flex-1 rounded-xl bg-orange-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-orange-700"
                  >
                    Đi đến thanh toán
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </StudentLayout>
  );
}

export default StudentExploreDetailPage;
