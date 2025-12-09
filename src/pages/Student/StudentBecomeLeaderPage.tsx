import { useState, useMemo, useEffect } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { Button } from '../../components/ui/Button';
import { clubService } from '../../api/services/club.service';
import { handleApiError } from '../../api/utils/errorHandler';
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
    <label htmlFor={id} className="block text-sm font-medium text-slate-300">
      {label} {required && <span className="text-red-400">*</span>}
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
        className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
  const isClubLeader = useMemo(() => {
    return user?.roles?.some(role => role.toLowerCase() === 'clubleader') ?? false;
  }, [user?.roles]);

  const [formData, setFormData] = useState({
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [myRequests, setMyRequests] = useState<LeaderRequest[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is already a club leader
    if (isClubLeader) {
      setErrorMessage('Bạn đã là Club Leader rồi. Không thể gửi yêu cầu trở thành leader mới.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

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
      const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.';
      setErrorMessage(errorMsg);
      handleApiError(error);
    }
  };

  const resetForm = () => {
    setFormData({ reason: '' });
    setErrorMessage(null);
  };

  // Fetch my leader requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      if (isClubLeader) return; // Skip if already club leader
      
      try {
        const requests = await clubService.getMyLeaderRequests();
        setMyRequests(requests);
      } catch (error) {
        console.error('Failed to fetch leader requests:', error);
        // Don't show error to user, just log it
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
          console.error('Failed to fetch leader requests:', error);
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
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Simple Header */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Đăng ký trở thành Club Leader
          </h1>
          <p className="text-slate-400">
            Điền lý do của bạn vào form bên dưới để gửi yêu cầu. Yêu cầu sẽ được xem xét bởi ban quản trị hệ thống.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Section */}
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Gửi yêu cầu mới</h2>
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <Icons.CheckCircle />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Yêu cầu đã được gửi thành công!</h3>
                <p className="mb-4 text-sm text-slate-400">
                  Yêu cầu của bạn đang được xem xét. Chúng tôi sẽ thông báo kết quả qua email.
                </p>
                <div className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400">
                  <Icons.Clock />
                  Thời gian xử lý: 3-5 ngày làm việc
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Alert Messages */}
                {errorMessage && (
                  <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-red-400">
                        <Icons.X />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-400">{errorMessage}</p>
                        {isClubLeader && (
                          <p className="mt-1 text-xs text-red-300">
                            Vui lòng sử dụng tài khoản Club Leader để quản lý câu lạc bộ của bạn.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isClubLeader && !errorMessage && (
                  <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-amber-400">
                        <Icons.Info />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-400">
                          Bạn đã là Club Leader
                        </p>
                        <p className="mt-1 text-xs text-amber-300">
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
                    disabled={isSubmitting}
                  />
                ))}

                {/* Submit Buttons */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-700 pt-5 sm:flex-row sm:justify-end">
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
                    disabled={isSubmitting || !formData.reason.trim()}
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
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Yêu cầu của tôi</h2>
              <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300">
                {myRequests.length} {myRequests.length === 1 ? 'yêu cầu' : 'yêu cầu'}
              </span>
            </div>
            {myRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Ngày gửi
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Lý do
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {myRequests.map((request, index) => {
                      const statusConfig: Record<string, {
                        textColor: string;
                        bgColor: string;
                        label: string;
                      }> = {
                        pending: {
                          textColor: 'text-yellow-400',
                          bgColor: 'bg-yellow-500/10',
                          label: 'Đang chờ',
                        },
                        approved: {
                          textColor: 'text-green-400',
                          bgColor: 'bg-green-500/10',
                          label: 'Đã duyệt',
                        },
                        rejected: {
                          textColor: 'text-red-400',
                          bgColor: 'bg-red-500/10',
                          label: 'Đã từ chối',
                        },
                      };
                      const status = request.status?.toLowerCase() || 'pending';
                      const config = statusConfig[status] || statusConfig.pending;
                      return (
                        <tr key={request.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2 text-xs text-slate-300">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-300">
                            {new Date(request.requestDate).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-3 py-2 text-xs text-white max-w-[120px]">
                            <div className="line-clamp-2">{request.reason}</div>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                              {config.label}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-400 max-w-[120px]">
                            {request.note ? (
                              <div className="line-clamp-2">{request.note}</div>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700/50">
                  <Icons.Info />
                </div>
                <p className="text-sm text-slate-400">
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

