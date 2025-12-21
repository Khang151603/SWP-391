import { toast, type ToastOptions } from 'react-toastify';

// Cấu hình mặc định cho toast lỗi (tiếng Việt)
const defaultErrorOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
};

const defaultSuccessOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
};

// Hàm chuyển đổi thông báo tiếng Anh sang tiếng Việt
function translateToVietnamese(message: string): string {
  const msg = message.trim();
  const msgLower = msg.toLowerCase();
  
  // Kiểm tra nếu đã là tiếng Việt (có chứa ký tự tiếng Việt)
  const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  if (vietnameseRegex.test(msg)) {
    return msg; // Đã là tiếng Việt, giữ nguyên
  }
  
  // Chuyển đổi các thông báo tiếng Anh phổ biến
  if (msgLower === 'invalid username or password.' || msgLower === 'invalid username or password') {
    return 'Tên đăng nhập hoặc mật khẩu không đúng.';
  }
  if (msgLower.includes('unauthorized') || msgLower.includes('401')) {
    return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
  }
  if (msgLower.includes('forbidden') || msgLower.includes('403')) {
    return 'Bạn không có quyền thực hiện thao tác này.';
  }
  if (msgLower.includes('not found') || msgLower.includes('404')) {
    return 'Không tìm thấy dữ liệu.';
  }
  if (msgLower.includes('network') || msgLower.includes('fetch failed') || msgLower.includes('failed to fetch')) {
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
  }
  if (msgLower.includes('already registered') || msgLower.includes('already exists')) {
    return 'Bạn đã đăng ký rồi.';
  }
  if (msgLower.includes('not yet open') || msgLower.includes('not yet opened')) {
    return 'Hoạt động này chưa mở đăng ký.';
  }
  if (msgLower.includes('closed') && msgLower.includes('registration')) {
    return 'Đăng ký cho hoạt động này đã được đóng.';
  }
  if (msgLower.includes('completed')) {
    return 'Hoạt động này đã hoàn thành.';
  }
  if (msgLower.includes('ongoing')) {
    return 'Hoạt động này đang diễn ra, không thể đăng ký thêm.';
  }
  if (msgLower.includes('cancelled') || msgLower.includes('canceled')) {
    return 'Hoạt động này đã bị hủy.';
  }
  if (msgLower.includes('already a member')) {
    return 'Bạn đã là thành viên của CLB này.';
  }
  if (msgLower.includes('not a member') || msgLower.includes('not member')) {
    return 'Bạn chưa phải thành viên của CLB này.';
  }
  if (msgLower.includes('username already exists') || msgLower.includes('username is already taken')) {
    return 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.';
  }
  if (msgLower.includes('email already exists') || msgLower.includes('email is already taken')) {
    return 'Email đã được sử dụng. Vui lòng sử dụng email khác.';
  }
  if (msgLower.includes('phone already exists')) {
    return 'Số điện thoại đã được sử dụng. Vui lòng sử dụng số khác.';
  }
  if (msgLower.includes('payment failed') || msgLower.includes('payment error')) {
    return 'Thanh toán thất bại. Vui lòng thử lại.';
  }
  if (msgLower.includes('cannot create payment') || msgLower.includes('unable to create payment')) {
    return 'Không thể tạo link thanh toán. Vui lòng thử lại.';
  }
  if (msgLower.includes('internal server error') || msgLower.includes('500')) {
    return 'Lỗi hệ thống. Vui lòng thử lại sau.';
  }
  if (msgLower.includes('bad request') || msgLower.includes('400')) {
    return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
  }
  
  // Nếu không khớp với bất kỳ pattern nào, trả về message gốc
  return msg;
}

// Track recent toast messages to prevent duplicates
const recentToasts = new Set<string>();
const TOAST_DEDUP_INTERVAL = 2000; // 2 seconds

export function showErrorToast(message: string, options?: ToastOptions) {
  const translatedMessage = translateToVietnamese(message);
  
  // Create a unique ID for this message
  const toastId = `error-${translatedMessage}`;
  
  // Check if this message was shown recently
  if (recentToasts.has(toastId)) {
    return; // Skip duplicate toast
  }
  
  // Add to recent toasts
  recentToasts.add(toastId);
  
  // Remove from recent toasts after interval
  setTimeout(() => {
    recentToasts.delete(toastId);
  }, TOAST_DEDUP_INTERVAL);
  
  toast.error(translatedMessage, { 
    ...defaultErrorOptions, 
    ...options,
    toastId, // Use toastId to prevent duplicates
  });
}

export function showSuccessToast(message: string, options?: ToastOptions) {
  // Create a unique ID for this message
  const toastId = `success-${message}`;
  
  toast.success(message, { 
    ...defaultSuccessOptions, 
    ...options,
    toastId, // Use toastId to prevent duplicates
  });
}

// Helper cho trường hợp có error object từ API
export function showApiErrorToast(error: unknown, fallbackMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.') {
  if (error instanceof Error && error.message) {
    showErrorToast(error.message);
  } else if (typeof error === 'string') {
    showErrorToast(error);
  } else {
    showErrorToast(fallbackMessage);
  }
}


