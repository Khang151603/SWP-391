// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7124';

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
  GET_ALL: '/api/Club',
  GET_ALL_CLUBS: '/api/Clubs', // Endpoint for student explore page
  GET_MY_CLUBS: '/api/clubs/my',
  GET_BY_ID: (id: number | string) => `/api/Club/${id}`,
  CREATE: '/api/Club',
  UPDATE: (id: number | string) => `/api/Club/${id}`,
  DELETE: (id: number | string) => `/api/Club/${id}`,
  GET_MEMBERS: (id: number | string) => `/api/Club/${id}/members`,
  JOIN_REQUEST: (id: number | string) => `/api/Club/${id}/join`,
  LEADER_REQUEST: '/api/club-leader-requests',
  MY_LEADER_REQUEST: '/api/club-leader-requests/my-request',
  LEADER_CREATE: '/api/leader/clubs',
  LEADER_MY_CLUBS: '/api/clubs/my',
  LEADER_CLUB_BY_ID: (id: number | string) => `/api/clubs/${id}`,
} as const;

// Activities Endpoints
export const ACTIVITY_ENDPOINTS = {
  GET_ALL: '/api/Activities',
  GET_BY_ID: (id: number | string) => `/api/Activities/${id}`,
  CREATE: '/api/Activities',
  UPDATE: (id: number | string) => `/api/Activities/${id}`,
  DELETE: (id: number | string) => `/api/Activities/${id}`,
  GET_BY_CLUB: (clubId: number | string) => `/api/Activities/club/${clubId}`,
  REGISTER: (id: number | string) => `/api/Activities/${id}/register`,
  UNREGISTER: (id: number | string) => `/api/Activities/${id}/unregister`,
} as const;

// User/Account Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: '/api/User/profile',
  UPDATE_PROFILE: '/api/User/profile',
  GET_BY_ID: (id: number | string) => `/api/User/${id}`,
  GET_MY_CLUBS: '/api/User/my-clubs',
  GET_MY_ACTIVITIES: '/api/User/my-activities',
} as const;

// Membership Endpoints
export const MEMBERSHIP_ENDPOINTS = {
  GET_ALL: '/api/Membership',
  GET_BY_ID: (id: number | string) => `/api/Membership/${id}`,
  CREATE: '/api/Membership',
  UPDATE: (id: number | string) => `/api/Membership/${id}`,
  DELETE: (id: number | string) => `/api/Membership/${id}`,
  APPROVE: (id: number | string) => `/api/Membership/${id}/approve`,
  REJECT: (id: number | string) => `/api/Membership/${id}/reject`,
} as const;

// Finance Endpoints
export const FINANCE_ENDPOINTS = {
  GET_CLUB_FINANCES: (clubId: number | string) => `/api/Finance/club/${clubId}`,
  GET_TRANSACTION_BY_ID: (id: number | string) => `/api/Finance/${id}`,
  CREATE_TRANSACTION: '/api/Finance',
  UPDATE_TRANSACTION: (id: number | string) => `/api/Finance/${id}`,
  DELETE_TRANSACTION: (id: number | string) => `/api/Finance/${id}`,
  GET_REPORT: (clubId: number | string) => `/api/Finance/club/${clubId}/report`,
} as const;

// Report Endpoints
export const REPORT_ENDPOINTS = {
  GET_ALL: '/api/Report',
  GET_BY_ID: (id: number | string) => `/api/Report/${id}`,
  CREATE: '/api/Report',
  UPDATE: (id: number | string) => `/api/Report/${id}`,
  DELETE: (id: number | string) => `/api/Report/${id}`,
  GET_BY_CLUB: (clubId: number | string) => `/api/Report/club/${clubId}`,
} as const;

