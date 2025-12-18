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

export function showErrorToast(message: string, options?: ToastOptions) {
  toast.error(message, { ...defaultErrorOptions, ...options });
}

export function showSuccessToast(message: string, options?: ToastOptions) {
  toast.success(message, { ...defaultSuccessOptions, ...options });
}

// Helper cho trường hợp có error object từ API
export function showApiErrorToast(error: unknown, fallbackMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.') {
  if (error instanceof Error && error.message) {
    showErrorToast(error.message);
  } else {
    showErrorToast(fallbackMessage);
  }
}


