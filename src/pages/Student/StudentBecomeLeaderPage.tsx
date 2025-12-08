import { useState, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { Button } from '../../components/ui/Button';
import { clubService } from '../../api/services/club.service';
import { handleApiError } from '../../api/utils/errorHandler';
import { useAppContext } from '../../context/AppContext';

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
  icon: React.ComponentType;
  disabled?: boolean;
}

const FormField = ({ id, label, required, placeholder, value, onChange, icon: Icon, disabled }: FormFieldProps) => (
  <div className="space-y-3">
    <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
      <Icon />
      <span>
        {label} {required && <span className="text-fuchsia-400">*</span>}
      </span>
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
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-slate-500/70 transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="absolute bottom-2 right-3 text-xs text-slate-500">{value.length}/500</div>
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <StudentLayout
      title="Yêu cầu trở thành Club Leader"
      subtitle="Gửi đơn ứng tuyển để trở thành người quản lý câu lạc bộ"
    >
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/30 via-fuchsia-600/25 to-emerald-500/20 p-6 md:p-8 backdrop-blur-sm border border-white/10">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <Icons.Check />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-200/80">
                  Leader Application
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Đăng ký trở thành Club Leader
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-200/90 max-w-2xl">
              Nếu bạn muốn đóng góp và quản lý một câu lạc bộ, hãy điền lý do của bạn vào form dưới đây để gửi yêu cầu.
              Yêu cầu của bạn sẽ được xem xét bởi ban quản trị hệ thống.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl" />
        </div>

        {/* Form Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm">
          {isClubLeader ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/30 to-amber-400/20 ring-4 ring-amber-500/20">
                <Icons.Shield />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Bạn đã là Club Leader</h3>
              <p className="mb-6 text-sm text-slate-300">
                Bạn đang là Club Leader rồi. Không thể gửi yêu cầu trở thành leader mới.
              </p>
              <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300 ring-1 ring-amber-400/30">
                <Icons.Info />
                Vui lòng sử dụng tài khoản Club Leader để quản lý câu lạc bộ
              </div>
            </div>
          ) : submitSuccess ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-400/20 ring-4 ring-emerald-500/20">
                <Icons.CheckCircle />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Yêu cầu đã được gửi thành công!</h3>
              <p className="mb-6 text-sm text-slate-300">
                Yêu cầu của bạn đang được xem xét. Chúng tôi sẽ thông báo kết quả qua email.
              </p>
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                <Icons.Clock />
                Thời gian xử lý: 3-5 ngày làm việc
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <Icons.X />
                    <span>{errorMessage}</span>
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
                  icon={Icons.Lightbulb}
                  disabled={isClubLeader}
                />
              ))}

              {/* Submit Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
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
      </div>
    </StudentLayout>
  );
}

export default StudentBecomeLeaderPage;

