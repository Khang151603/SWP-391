// API Error Handler
export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(
    status: number,
    statusText: string,
    message: string,
    data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(0, 'Unknown', error.message);
  }

  return new ApiError(0, 'Unknown', 'An unexpected error occurred');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.';
}

