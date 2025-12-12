// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7124';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/api/Auth/register',
  LOGIN: '/api/Auth/login',
  LOGOUT: '/api/Auth/logout',
  REFRESH_TOKEN: '/api/Auth/refresh-token',
  CHANGE_PASSWORD: '/api/Auth/change-password',
} as const;

// Club Endpoints
export const CLUB_ENDPOINTS = {
  GET_ALL_CLUBS: '/api/Clubs', // Endpoint for student explore page
  JOIN_REQUEST: (id: number | string) => `/api/Club/${id}/join`,
  LEADER_REQUEST: '/api/club-leader-requests',
  MY_LEADER_REQUEST: '/api/club-leader-requests/my-request',
  LEADER_CREATE: '/api/clubs',
  LEADER_MY_CLUBS: '/api/clubs/my',
  LEADER_CLUB_BY_ID: (id: number | string) => `/api/clubs/${id}`,
} as const;

// Activities Endpoints
export const ACTIVITY_ENDPOINTS = {
  GET_BY_CLUB: (clubId: number | string) => `/api/Activities/club/${clubId}`,
  CREATE: '/api/Activities',
  // Student activity endpoints
  STUDENT_VIEW_ALL: '/api/student/activities/view-all',
  STUDENT_VIEW_CLUB: (clubId: number | string) => `/api/student/activities/view-club/${clubId}`,
  STUDENT_REGISTER: (id: number | string) => `/api/student/activities/${id}/register`,
  STUDENT_FOR_REGISTRATION: '/api/student/activities/for-registration',
} as const;

// User/Account Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: '/api/User/profile',
  UPDATE_PROFILE: '/api/User/profile',
} as const;

// Membership Endpoints
export const MEMBERSHIP_ENDPOINTS = {
  // Student membership request endpoints
  STUDENT_REQUEST: '/api/student/membership/request',
  STUDENT_REQUESTS: '/api/student/membership/requests',
  STUDENT_MY_CLUBS: '/api/student/membership/my-clubs',
  // Leader membership request endpoints
  LEADER_PENDING: '/api/leader/membership/pending',
  LEADER_MEMBERS: '/api/leader/membership/members',
  LEADER_CLUB_MEMBERS: (clubId: number | string) => `/api/leader/membership/clubs/${clubId}/members`,
  LEADER_APPROVE: (id: number | string) => `/api/leader/membership/${id}/approve`,
  LEADER_REJECT: (id: number | string) => `/api/leader/membership/${id}/reject`,
  LEADER_LOCK_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}/lock`,
  LEADER_UNLOCK_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}/unlock`,
  LEADER_DELETE_MEMBER: (membershipId: number | string) => `/api/leader/membership/members/${membershipId}`,
} as const;


