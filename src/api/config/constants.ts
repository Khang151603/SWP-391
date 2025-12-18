// API Base URL
// Chỉ sử dụng giá trị từ biến môi trường VITE_API_BASE_URL
const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (!envApiBaseUrl) {
  throw new Error('VITE_API_BASE_URL environment variable is not set');
}
export const API_BASE_URL = envApiBaseUrl as string;

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/api/Auth/register',
  LOGIN: '/api/Auth/login',
  REFRESH_TOKEN: '/api/Auth/refresh-token',
  CHANGE_PASSWORD: '/api/Auth/change-password',
  UPDATE_PROFILE: '/api/Account/profile',
} as const;

// Club Endpoints
export const CLUB_ENDPOINTS = {
  GET_ALL_CLUBS: '/api/clubs', // Endpoint for student explore page
  JOIN_REQUEST: (id: number | string) => `/api/Club/${id}/join`,
  LEADER_REQUEST: '/api/club-leader-requests',
  MY_LEADER_REQUEST: '/api/club-leader-requests/my-request',
  LEADER_CREATE: '/api/clubs',
  LEADER_MY_CLUBS: '/api/clubs/my',
  LEADER_CLUB_BY_ID: (id: number | string) => `/api/clubs/${id}`,
  UPLOAD_CLUB_IMAGE: (id: number | string) => `/api/clubs/${id}/upload-image`,
} as const;

// Activities Endpoints
export const ACTIVITY_ENDPOINTS = {
  GET_BY_CLUB: (clubId: number | string) => `/api/Activities/club/${clubId}`,
  CREATE: '/api/Activities',
  UPDATE: (id: number | string) => `/api/Activities/${id}`,
  DELETE: (id: number | string) => `/api/Activities/${id}`,
  UPLOAD_ACTIVITY_IMAGE: (id: number | string) => `/api/Activities/${id}/upload-image`,
  OPEN_REGISTRATION: (id: number | string) => `/api/Activities/${id}/open-registration`,
  CLOSE_REGISTRATION: (id: number | string) => `/api/Activities/${id}/close-registration`,
  START_ACTIVITY: (id: number | string) => `/api/Activities/${id}/start`,
  STOP_ACTIVITY: (id: number | string) => `/api/Activities/${id}/stop`,
  GET_PARTICIPANTS: (id: number | string) => `/api/Activities/${id}/participants`,
  // Student activity endpoints
  STUDENT_VIEW_ALL: '/api/student/activities/view-all',
  STUDENT_VIEW_CLUB: (clubId: number | string) => `/api/student/activities/view-club/${clubId}`,
  STUDENT_REGISTER: (id: number | string) => `/api/student/activities/${id}/register`,
  STUDENT_FOR_REGISTRATION: '/api/student/activities/for-registration',
  STUDENT_HISTORY: '/api/student/activities/history',
} as const;

// User/Account Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: '/api/User/profile',
  UPDATE_PROFILE: '/api/User/profile',
  UPLOAD_AVATAR: '/api/Account/upload-avatar',
} as const;

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  STUDENT_PAID: '/api/student/payment/paid',
  STUDENT_DEBTS: '/api/student/payment/debts',
  STUDENT_HISTORY: '/api/student/payment/history',
} as const;

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  UNREAD: '/notification',
  MARK_AS_READ: (notificationId: string) => `/notification/read/${notificationId}`,
} as const;

// Membership Endpoints
export const MEMBERSHIP_ENDPOINTS = {
  // Student membership request endpoints
  STUDENT_REQUEST: '/api/student/membership/request',
  STUDENT_REQUESTS: '/api/student/membership/requests',
  STUDENT_MY_CLUBS: '/api/student/membership/my-clubs',
  STUDENT_ACCOUNT_INFO: '/api/student/membership/account-info',
  // Leader membership request endpoints
  LEADER_PENDING: '/api/leader/membership/pending',
  LEADER_ALL_REQUESTS: '/api/leader/membership/requests',
  LEADER_MEMBERS: '/api/leader/membership/members',
  LEADER_CLUB_MEMBERS: (clubId: number | string) => `/api/leader/membership/clubs/${clubId}/members`,
  LEADER_APPROVE: (id: number | string) => `/api/leader/membership/${id}/approve`,
  LEADER_REJECT: (id: number | string) => `/api/leader/membership/${id}/reject`,
  LEADER_LOCK_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}/lock`,
  LEADER_UNLOCK_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}/unlock`,
  LEADER_DELETE_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}`,
} as const;


