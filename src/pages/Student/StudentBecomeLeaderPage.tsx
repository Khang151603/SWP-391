import { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { Button } from '../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../components/ui/Dialog';
import { clubService } from '../../api/services/club.service';
import { handleApiError, ApiError } from '../../api/utils/errorHandler';
import { useAppContext } from '../../context/AppContext';
import type { LeaderRequest } from '../../api/types/club.types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

// Form field configuration - theo API backend mới
const formFields = [
  {
    id: 'motivation',
    label: 'Động lực muốn trở thành Club Leader',
    required: true,
    placeholder: 'Hãy chia sẻ động lực chính khiến bạn muốn trở thành Club Leader...',
  },
  {
    id: 'experience',
    label: 'Kinh nghiệm lãnh đạo / hoạt động ngoại khóa',
    required: true,
    placeholder: 'Mô tả các kinh nghiệm lãnh đạo, tham gia CLB, hoạt động ngoại khóa của bạn...',
  },
  {
    id: 'vision',
    label: 'Tầm nhìn cho câu lạc bộ',
    required: true,
    placeholder: 'Chia sẻ tầm nhìn, định hướng phát triển câu lạc bộ nếu bạn trở thành Leader...',
  },
  {
    id: 'commitment',
    label: 'Cam kết đồng hành',
    required: true,
    placeholder: 'Bạn cam kết như thế nào về thời gian, trách nhiệm và sự gắn bó với câu lạc bộ?...',
  },
] as const;

// Icons
const Icons = {
  Check: () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Lightbulb: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Clock: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  X: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Send: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Spinner: () => (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  Shield: () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Info: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Eye: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
};

// Form field component

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const FormField = ({ id, label, required, placeholder, value, onChange, disabled }: FormFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={5}
        maxLength={150}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition"
      />
      <div className="absolute bottom-2 right-3 text-xs text-slate-500">
        {value.length}/150
      </div>
    </div>
  </div>
);

function StudentBecomeLeaderPage() {
  const { user } = useAppContext();
  
  // Kiểm tra xem user có role clubleader không
  const [isClubLeader, setIsClubLeader] = useState(false);

  const [formData, setFormData] = useState({
    motivation: '',
    experience: '',
    vision: '',
    commitment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [myRequests, setMyRequests] = useState<LeaderRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaderRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Check if user is club leader whenever user changes
  useEffect(() => {
    const checkLeaderStatus = () => {
      const hasLeaderRole = user?.roles?.some(role => role.toLowerCase() === 'clubleader') ?? false;
      setIsClubLeader(hasLeaderRole);
    };
    
    checkLeaderStatus();
  }, [user, user?.roles]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is already a club leader
    if (isClubLeader) {
      return;
    }

    // Validation
    const fields = [
      { key: 'motivation', label: 'Động lực muốn trở thành Club Leader' },
      { key: 'experience', label: 'Kinh nghiệm lãnh đạo / hoạt động ngoại khóa' },
      { key: 'vision', label: 'Tầm nhìn cho câu lạc bộ' },
      { key: 'commitment', label: 'Cam kết đồng hành' },
    ];

    for (const field of fields) {
      const value = formData[field.key as keyof typeof formData];
      if (!value.trim()) {
        showErrorToast(`${field.label} không được bỏ trống.`);
        return;
      }
      if (value.length > 150) {
        showErrorToast(`${field.label} không được quá 150 ký tự.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Gọi API để gửi yêu cầu trở thành Club Leader
      await clubService.createLeaderRequest({
        motivation: formData.motivation,
        experience: formData.experience,
        vision: formData.vision,
        commitment: formData.commitment,
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      showSuccessToast('Gửi yêu cầu trở thành Club Leader thành công!');
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          motivation: '',
          experience: '',
          vision: '',
          commitment: '',
        });
      }, 5000);
    } catch (error) {
      setIsSubmitting(false);
      handleApiError(error);
    }
  };

  const resetForm = () => {
    setFormData({
      motivation: '',
      experience: '',
      vision: '',
      commitment: '',
    });
  };

  // Fetch my leader requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      if (isClubLeader) return; // Skip if already club leader
      
      try {
        const requests = await clubService.getMyLeaderRequests();
        setMyRequests(requests);
      } catch (error) {
        // Handle 404 gracefully - if endpoint doesn't exist or no requests found, treat as empty
        if (error instanceof ApiError && error.status === 404) {
          setMyRequests([]);
          return;
        }
        // For other errors, just log but don't show to user
        setMyRequests([]);
      }
    };

    fetchMyRequests();
  }, [isClubLeader]);

  // Refresh requests after successful submission
  useEffect(() => {
    if (submitSuccess) {
      const fetchMyRequests = async () => {
        try {
          const requests = await clubService.getMyLeaderRequests();
          setMyRequests(requests);
        } catch (error) {
          // Handle 404 gracefully - if endpoint doesn't exist or no requests found, treat as empty
          if (error instanceof ApiError && error.status === 404) {
            setMyRequests([]);
            return;
          }
          // For other errors, just don't show to user
          setMyRequests([]);
        }
      };
      fetchMyRequests();
    }
  }, [submitSuccess]);

  return (
    <StudentLayout
      title="Yêu cầu trở thành Club Leader"
      subtitle="Gửi đơn ứng tuyển để trở thành người quản lý câu lạc bộ"
    >
      <div className="space-y-8 overflow-x-hidden">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Gửi yêu cầu mới</h2>
              <p className="mt-1 text-sm text-slate-600">Điền form bên dưới để gửi yêu cầu trở thành Club Leader</p>
            </div>
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icons.CheckCircle />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">Yêu cầu đã được gửi thành công!</h3>
                <p className="mb-4 text-sm text-slate-600">
                  Yêu cầu của bạn đang được xem xét. Chúng tôi sẽ thông báo kết quả qua email.
                </p>
                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">
                  <Icons.Clock />
                  Thời gian xử lý: 3-5 ngày làm việc
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Alert Messages */}
                {isClubLeader && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-amber-600">
                        <Icons.Info />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-700">
                          Bạn đã là Club Leader
                        </p>
                        <p className="mt-1 text-xs text-amber-600">
                          Bạn đang sở hữu quyền quản lý câu lạc bộ. Vui lòng sử dụng tài khoản Club Leader để quản lý.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                {formFields.map((field) => (
                  <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleChange}
                    disabled={isSubmitting || isClubLeader}
                  />
                ))}

                {/* Submit Buttons */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={resetForm} 
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    <Icons.X />
                    <span className="ml-2">Xóa form</span>
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isClubLeader ||
                      !formData.motivation.trim() ||
                      !formData.experience.trim() ||
                      !formData.vision.trim() ||
                      !formData.commitment.trim()
                    }
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Icons.Spinner />
                        <span className="ml-2">Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Send />
                        <span className="ml-2">Gửi yêu cầu</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column - My Requests Card Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Yêu cầu của tôi</h2>
                <p className="mt-1 text-sm text-slate-600">Lịch sử các yêu cầu bạn đã gửi</p>
              </div>
              <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                {myRequests.length} {myRequests.length === 1 ? 'yêu cầu' : 'yêu cầu'}
              </span>
            </div>
            {myRequests.length > 0 ? (
              <div className="space-y-4">
                {myRequests.map((request, index) => {
                  const statusConfig: Record<string, {
                    textColor: string;
                    bgColor: string;
                    label: string;
                  }> = {
                    pending: {
                      textColor: 'text-yellow-800',
                      bgColor: 'bg-yellow-100 border-yellow-300',
                      label: 'Đang chờ',
                    },
                    approved: {
                      textColor: 'text-emerald-800',
                      bgColor: 'bg-emerald-100 border-emerald-300',
                      label: 'Đã duyệt',
                    },
                    rejected: {
                      textColor: 'text-red-800',
                      bgColor: 'bg-red-100 border-red-300',
                      label: 'Đã từ chối',
                    },
                  };
                  const status = request.status?.toLowerCase() || 'pending';
                  const config = statusConfig[status] || statusConfig.pending;
                  const date = new Date(request.requestDate);
                  const formattedDate = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
                  
                  return (
                    <div
                      key={request.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-semibold">
                            #{index + 1}
                          </div>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Icons.Clock />
                              <span className="font-medium">{formattedDate}</span>
                            </div>
                            <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${config.bgColor} ${config.textColor}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsDetailModalOpen(true);
                          }}
                          className="shrink-0"
                        >
                          <Icons.Eye />
                          <span className="ml-2">Chi tiết</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                  <Icons.Info />
                </div>
                <p className="text-sm text-slate-600">
                  Bạn chưa có yêu cầu nào. Hãy gửi yêu cầu mới ở form bên cạnh.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu</DialogTitle>
            {selectedRequest && (
              <div className="mt-4 space-y-6">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Icons.Clock />
                    Ngày gửi: {(() => {
                      const date = new Date(selectedRequest.requestDate);
                      return `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
                    })()}
                  </span>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                    selectedRequest.status === 'pending' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                    selectedRequest.status === 'approved' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' :
                    'bg-red-100 border-red-300 text-red-800'
                  }`}>
                    {selectedRequest.status === 'pending' ? 'Đang chờ' :
                     selectedRequest.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Động lực muốn trở thành Club Leader</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedRequest.motivation}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Kinh nghiệm lãnh đạo / hoạt động ngoại khóa</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedRequest.experience}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Tầm nhìn cho câu lạc bộ</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedRequest.vision}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Cam kết đồng hành</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedRequest.commitment}</p>
                  </div>

                  {selectedRequest.note && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <h4 className="font-semibold text-amber-900 mb-2">Ghi chú từ admin</h4>
                      <p className="text-amber-800 whitespace-pre-wrap">{selectedRequest.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogHeader>
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Đóng</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}

export default StudentBecomeLeaderPage;

