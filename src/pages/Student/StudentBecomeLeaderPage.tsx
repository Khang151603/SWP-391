import { useState, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { Button } from '../../components/ui/Button';
import { clubService } from '../../api/services/club.service';
import { handleApiError, ApiError } from '../../api/utils/errorHandler';
import { useAppContext } from '../../context/AppContext';
import type { LeaderRequest } from '../../api/types/club.types';

// Form field configuration - chỉ giữ lại reason theo API backend
const formFields = [
  {
    id: 'reason',
    label: 'Lý do muốn trở thành Club Leader',
    required: true,
    placeholder: 'Hãy chia sẻ lý do bạn muốn trở thành Club Leader...',
  },
];

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
        maxLength={500}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition"
      />
      <div className="absolute bottom-2 right-3 text-xs text-slate-500">
        {value.length}/500
      </div>
    </div>
  </div>
);

function StudentBecomeLeaderPage() {
  const { user } = useAppContext();
  
  // Kiểm tra xem user có role clubleader không
  const [isClubLeader, setIsClubLeader] = useState(false);

  const [formData, setFormData] = useState({
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [myRequests, setMyRequests] = useState<LeaderRequest[]>([]);

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

    setIsSubmitting(true);

    try {
      // Gọi API để gửi yêu cầu trở thành Club Leader
      await clubService.createLeaderRequest({
        reason: formData.reason,
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({ reason: '' });
      }, 5000);
    } catch (error) {
      setIsSubmitting(false);
      handleApiError(error);
    }
  };

  const resetForm = () => {
    setFormData({ reason: '' });
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
                    disabled={isSubmitting || !formData.reason.trim() || isClubLeader}
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

          {/* Right Column - My Requests Table Section */}
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
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                          STT
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Ngày gửi
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Lý do
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
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
                        return (
                          <tr key={request.id} className="transition-colors hover:bg-slate-50">
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm font-medium text-slate-900">{index + 1}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm text-slate-900">
                                {(() => {
                                  const date = new Date(request.requestDate);
                                  const day = String(date.getUTCDate()).padStart(2, '0');
                                  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                                  const year = date.getUTCFullYear();
                                  return `${day}/${month}/${year}`;
                                })()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs text-sm text-slate-700">
                                <p className="line-clamp-2">{request.reason}</p>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                                {config.label}
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
    </StudentLayout>
  );
}

export default StudentBecomeLeaderPage;

