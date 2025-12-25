import { httpClient } from '../config/client';
import { API_BASE_URL, PAYMENT_ENDPOINTS } from '../config/constants';
import { ApiError } from '../utils/errorHandler';
import type {
  PayOSPaymentResponse,
  MembershipPaymentRequest,
  StudentPaidPayment,
  StudentDebt,
  ClubLeaderPaymentHistory,
} from '../types/payment.types';

/**
 * Payment Service
 * 
 * Used by:
 * - Pages: StudentMembershipRequestsPage.tsx, StudentPaymentHistoryPage.tsx,
 *          ClubLeaderPaymentHistoryPage.tsx
 */
export const paymentService = {
  /**
   * Create PayOS payment link
   * Note: PayOS API requires payment ID in URL path, so we use fetch directly
   * instead of httpClient to maintain the exact endpoint structure
   * Used internally by: createMembershipPayment()
   * 
   * Note: The new API endpoint only requires paymentId in URL, no body needed
   */
  async createPayOSPayment(
    paymentId: number
  ): Promise<PayOSPaymentResponse> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // New API endpoint doesn't require body, only paymentId in URL
    const response = await fetch(`${API_BASE_URL}/api/PayOS/create/${paymentId}`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as { message?: string })?.message || 
        `PayOS API error: ${response.status} ${response.statusText}`;
      throw new ApiError(response.status, response.statusText, errorMessage, errorData);
    }

    // Check if response is a string URL or JSON object
    const responseText = await response.text();
    
    // Try to parse as JSON first
    try {
      return JSON.parse(responseText) as PayOSPaymentResponse;
    } catch {
      // If not JSON, treat as plain text URL
      return responseText.trim() as PayOSPaymentResponse;
    }
  },

  /**
   * Create payment for membership request
   * Note: Updated to use new API that only requires paymentId
   */
  async createMembershipPayment(
    data: MembershipPaymentRequest
  ): Promise<PayOSPaymentResponse> {
    // Use paymentId if available, otherwise use membershipRequestId as fallback
    const paymentId = data.paymentId || data.membershipRequestId;
    
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }

    // New API only requires paymentId, no body needed
    return this.createPayOSPayment(paymentId);
  },

  /**
   * Student: Get paid payments
   * Note: Currently not used in any page/component (getStudentPaymentHistory is used instead)
   */
  async getStudentPaidPayments(): Promise<StudentPaidPayment[]> {
    return httpClient.get<StudentPaidPayment[]>(PAYMENT_ENDPOINTS.STUDENT_PAID);
  },

  /**
   * Student: Get debts
   * Note: Currently not used in any page/component
   */
  async getStudentDebts(): Promise<StudentDebt[]> {
    return httpClient.get<StudentDebt[]>(PAYMENT_ENDPOINTS.STUDENT_DEBTS);
  },

  /**
   * Student: Get payment history (all statuses)
   */
  async getStudentPaymentHistory(): Promise<StudentPaidPayment[]> {
    return httpClient.get<StudentPaidPayment[]>(PAYMENT_ENDPOINTS.STUDENT_HISTORY);
  },

  /**
   * Club Leader: Get payment history for a specific club
   */
  async getClubPaymentHistory(clubId: number | string): Promise<ClubLeaderPaymentHistory[]> {
    return httpClient.get<ClubLeaderPaymentHistory[]>(PAYMENT_ENDPOINTS.LEADER_CLUB_HISTORY(clubId));
  },

  /**
   * Cancel payment (change status from pending to cancelled)
   */
  async cancelPayment(paymentId: number): Promise<void> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/PayOS/cancel/${paymentId}`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as { message?: string })?.message || 
        `Cancel payment error: ${response.status} ${response.statusText}`;
      throw new ApiError(response.status, response.statusText, errorMessage, errorData);
    }
  },
};

