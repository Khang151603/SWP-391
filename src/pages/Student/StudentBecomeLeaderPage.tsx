import { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { Button } from '../../components/ui/Button';

// Form field configuration
const formFields = [
  {
    id: 'reason',
    label: 'Lý do muốn trở thành Club Leader',
    required: true,
    placeholder: 'Hãy chia sẻ lý do bạn muốn trở thành Club Leader của câu lạc bộ này...',
  },
  {
    id: 'experience',
    label: 'Kinh nghiệm liên quan',
    required: false,
    placeholder: 'Kinh nghiệm quản lý, tổ chức sự kiện, hoặc các hoạt động liên quan...',
  },
  {
    id: 'vision',
    label: 'Tầm nhìn và kế hoạch phát triển CLB',
    required: false,
    placeholder: 'Chia sẻ tầm nhìn và kế hoạch của bạn để phát triển câu lạc bộ...',
  },
];

// Icons
const Icons = {
  Check: () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Building: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Lightbulb: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Eye: () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
}

const FormField = ({ id, label, required, placeholder, value, onChange, icon: Icon }: FormFieldProps) => (
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
        rows={5}
        maxLength={500}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-slate-500/70 transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30 resize-none"
      />
      <div className="absolute bottom-2 right-3 text-xs text-slate-500">{value.length}/500</div>
    </div>
  </div>
);

function StudentBecomeLeaderPage() {
  const [formData, setFormData] = useState({
    clubId: '',
    reason: '',
    experience: '',
    vision: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Gọi API để gửi yêu cầu trở thành Club Leader
    // await submitLeaderRequest(formData);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({ clubId: '', reason: '', experience: '', vision: '' });
      }, 5000);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ clubId: '', reason: '', experience: '', vision: '' });
  };

  // Mock data - TODO: Lấy từ API
  const clubs = [
    { id: '1', name: 'CLB Lập trình', members: 45 },
    { id: '2', name: 'CLB Nghệ thuật', members: 32 },
    { id: '3', name: 'CLB Thể thao', members: 58 },
  ];

  const selectedClub = clubs.find((club) => club.id === formData.clubId);

  const fieldIcons = {
    reason: Icons.Lightbulb,
    experience: Icons.Briefcase,
    vision: Icons.Eye,
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
              Nếu bạn muốn đóng góp và quản lý một câu lạc bộ, hãy điền form dưới đây để gửi yêu cầu.
              Yêu cầu của bạn sẽ được xem xét bởi ban quản trị hệ thống.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl" />
        </div>

        {/* Form Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm">
          {submitSuccess ? (
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
              {/* Club Selection */}
              <div className="space-y-3">
                <label htmlFor="clubId" className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Icons.Building />
                  <span>
                    Chọn câu lạc bộ <span className="text-fuchsia-400">*</span>
                  </span>
                </label>
                <select
                  id="clubId"
                  name="clubId"
                  value={formData.clubId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-white transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30"
                >
                  <option value="" className="bg-slate-900">-- Chọn câu lạc bộ --</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id} className="bg-slate-900">
                      {club.name}
                    </option>
                  ))}
                </select>
                {selectedClub && (
                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-violet-200">{selectedClub.name}</span>
                      <span className="text-xs text-violet-300/80">{selectedClub.members} thành viên</span>
                    </div>
                  </div>
                )}
              </div>

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
                  icon={fieldIcons[field.id as keyof typeof fieldIcons]}
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
                  disabled={isSubmitting || !formData.clubId || !formData.reason}
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

