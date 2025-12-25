// API Base URL
// Chỉ sử dụng giá trị từ biến môi trường VITE_API_BASE_URL
const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (!envApiBaseUrl) {
  throw new Error('VITE_API_BASE_URL environment variable is not set');
}
export const API_BASE_URL: string = envApiBaseUrl;

// Auth Endpoints
// Used by: auth.service.ts
export const AUTH_ENDPOINTS = {
  REGISTER: '/api/Auth/register', // Pages: RegisterPage.tsx
  LOGIN: '/api/Auth/login', // Pages: LoginPage.tsx
  REFRESH_TOKEN: '/api/Auth/refresh-token', // Used internally by auth.service.ts
  CHANGE_PASSWORD: '/api/Auth/change-password', // Used by auth.service.ts
  UPDATE_PROFILE: '/api/Account/profile', // Pages: StudentProfilePage.tsx
} as const;

// Club Endpoints
// Used by: club.service.ts
export const CLUB_ENDPOINTS = {
  GET_ALL_CLUBS: '/api/clubs', // Pages: StudentExplorePage.tsx, HomePage.tsx
  JOIN_REQUEST: (id: number | string) => `/api/Club/${id}/join`, // Pages: StudentExploreDetailPage.tsx
  LEADER_REQUEST: '/api/club-leader-requests', // Pages: StudentBecomeLeaderPage.tsx
  MY_LEADER_REQUEST: '/api/club-leader-requests/my-request', // Pages: StudentBecomeLeaderPage.tsx
  LEADER_CREATE: '/api/clubs', // Pages: ClubLeaderInfoPage.tsx
  LEADER_MY_CLUBS: '/api/clubs/my', // Pages: ClubLeaderMembersPage.tsx, ClubLeaderRequestsPage.tsx, ClubLeaderDetailPage.tsx, ClubLeaderPaymentHistoryPage.tsx, ClubLeaderInfoPage.tsx, ClubLeaderDashboardPage.tsx
  LEADER_CLUB_BY_ID: (id: number | string) => `/api/clubs/${id}`, // Pages: StudentMyActivitiesPage.tsx, StudentClubsPage.tsx, StudentExploreDetailPage.tsx, StudentExplorePage.tsx, ClubLeaderDetailPage.tsx
  UPLOAD_CLUB_IMAGE: (id: number | string) => `/api/clubs/${id}/upload-image`, // Pages: ClubLeaderDetailPage.tsx
} as const;

// Activities Endpoints
// Used by: activity.service.ts
export const ACTIVITY_ENDPOINTS = {
  // Leader activity endpoints
  GET_BY_CLUB: (clubId: number | string) => `/api/Activities/club/${clubId}`, // Pages: ClubLeaderActivitiesPage.tsx, ClubLeaderDashboardPage.tsx, StudentActivitiesPage.tsx
  CREATE: '/api/Activities', // Pages: ClubLeaderActivitiesPage.tsx
  UPDATE: (id: number | string) => `/api/Activities/${id}`, // Pages: ClubLeaderActivitiesPage.tsx
  DELETE: (id: number | string) => `/api/Activities/${id}`, // Used by activity.service.ts
  UPLOAD_ACTIVITY_IMAGE: (id: number | string) => `/api/Activities/${id}/upload-image`, // Pages: ClubLeaderActivitiesPage.tsx
  OPEN_REGISTRATION: (id: number | string) => `/api/Activities/${id}/open-registration`, // Pages: ClubLeaderActivitiesPage.tsx
  CLOSE_REGISTRATION: (id: number | string) => `/api/Activities/${id}/close-registration`, // Pages: ClubLeaderActivitiesPage.tsx
  START_ACTIVITY: (id: number | string) => `/api/Activities/${id}/start`, // Pages: ClubLeaderActivitiesPage.tsx
  STOP_ACTIVITY: (id: number | string) => `/api/Activities/${id}/stop`, // Pages: ClubLeaderActivitiesPage.tsx
  GET_PARTICIPANTS: (id: number | string) => `/api/Activities/${id}/participants`, // Pages: ClubLeaderActivitiesPage.tsx
  // Student activity endpoints
  STUDENT_VIEW_ALL: '/api/student/activities/view-all', // Pages: StudentActivitiesPage.tsx
  STUDENT_VIEW_CLUB: (clubId: number | string) => `/api/student/activities/view-club/${clubId}`, // Pages: StudentActivitiesPage.tsx
  STUDENT_REGISTER: (id: number | string) => `/api/student/activities/${id}/register`, // Pages: StudentActivitiesPage.tsx
  STUDENT_FOR_REGISTRATION: '/api/student/activities/for-registration', // Pages: StudentActivitiesPage.tsx
  STUDENT_HISTORY: '/api/student/activities/history', // Pages: StudentMyActivitiesPage.tsx
} as const;


// User/Account Endpoints
export const USER_ENDPOINTS = {
  UPLOAD_AVATAR: '/api/Account/upload-avatar', // Pages: StudentProfilePage.tsx
} as const;

// Payment Endpoints
// Used by: payment.service.ts
export const PAYMENT_ENDPOINTS = {
  STUDENT_PAID: '/api/student/payment/paid', // Used by payment.service.ts
  STUDENT_DEBTS: '/api/student/payment/debts', // Used by payment.service.ts
  STUDENT_HISTORY: '/api/student/payment/history', // Pages: StudentPaymentHistoryPage.tsx
  LEADER_CLUB_HISTORY: (clubId: number | string) => `/api/ClubLeaderPayment/clubs/${clubId}/history`, // Pages: ClubLeaderPaymentHistoryPage.tsx
} as const;

// Membership Endpoints
// Used by: membership.service.ts
export const MEMBERSHIP_ENDPOINTS = {
  // Student membership request endpoints
  STUDENT_REQUEST: '/api/student/membership/request', // Pages: StudentExplorePage.tsx
  STUDENT_REQUESTS: '/api/student/membership/requests', // Pages: StudentExplorePage.tsx, StudentMembershipRequestsPage.tsx
  STUDENT_MY_CLUBS: '/api/student/membership/my-clubs', // Pages: StudentClubsPage.tsx, StudentActivitiesPage.tsx, StudentExplorePage.tsx, StudentExploreDetailPage.tsx
  STUDENT_ACCOUNT_INFO: '/api/student/membership/account-info', // Pages: StudentExplorePage.tsx
  STUDENT_LEAVE_CLUB: (clubId: number | string) => `/api/student/membership/leave/${clubId}`, // Pages: StudentClubsPage.tsx
  // Leader membership request endpoints
  LEADER_PENDING: '/api/leader/membership/pending', // Used by membership.service.ts
  LEADER_ALL_REQUESTS: '/api/leader/membership/requests', // Pages: ClubLeaderRequestsPage.tsx, ClubLeaderDashboardPage.tsx
  LEADER_MEMBERS: '/api/leader/membership/members', // Pages: ClubLeaderDashboardPage.tsx
  LEADER_CLUB_MEMBERS: (clubId: number | string) => `/api/leader/membership/clubs/${clubId}/members`, // Pages: ClubLeaderMembersPage.tsx, ClubLeaderDetailPage.tsx, ClubLeaderInfoPage.tsx
  LEADER_APPROVE: (id: number | string) => `/api/leader/membership/${id}/approve`, // Pages: ClubLeaderRequestsPage.tsx
  LEADER_REJECT: (id: number | string) => `/api/leader/membership/${id}/reject`, // Pages: ClubLeaderRequestsPage.tsx
  LEADER_LOCK_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}/lock`, // Pages: ClubLeaderMembersPage.tsx
  LEADER_UNLOCK_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}/unlock`, // Pages: ClubLeaderMembersPage.tsx
  LEADER_DELETE_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}`, // Pages: ClubLeaderMembersPage.tsx
} as const;

// Report Endpoints
// Used by: report.service.ts
export const REPORT_ENDPOINTS = {
  MY_CLUBS_REPORT: '/api/reports/my-clubs', // Pages: ClubLeaderReportsPage.tsx
} as const;


