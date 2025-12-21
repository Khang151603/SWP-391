import { httpClient } from '../config/client';
import { API_BASE_URL, PAYMENT_ENDPOINTS } from '../config/constants';
import { ApiError } from '../utils/errorHandler';
import type {
  PayOSCreatePaymentRequest,
    PayOSPaymentResponse,
    MembershipPaymentRequest,
  StudentPaidPayment,
  StudentDebt,
  ClubLeaderPaymentHistory,
} from '../types/payment.types';

/**
 * Payment Service
 */
export const paymentService = {
  /**
   * Create PayOS payment link
   * Note: PayOS API requires payment ID in URL path, so we use fetch directly
   * instead of httpClient to maintain the exact endpoint structure
   */
  async createPayOSPayment(
    paymentId: number,
    data: PayOSCreatePaymentRequest
  ): Promise<PayOSPaymentResponse> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/PayOS/create/${paymentId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
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
   */
  async createMembershipPayment(
    data: MembershipPaymentRequest
  ): Promise<PayOSPaymentResponse> {
    // Use paymentId if available, otherwise use membershipRequestId as fallback
    const paymentId = data.paymentId || data.membershipRequestId;
    
    // Generate order code (use timestamp + membership request ID)
    const orderCode = parseInt(
      `${Date.now()}${data.membershipRequestId}`.slice(-10)
    );

    const paymentRequest: PayOSCreatePaymentRequest = {
      orderCode,
      amount: data.amount,
      description: `Thanh toán phí tham gia CLB: ${data.clubName}`,
      items: [
        {
          name: `Phí tham gia CLB ${data.clubName}`,
          quantity: 1,
          price: data.amount,
        },
      ],
      returnUrl: `${window.location.origin}/student/membership-requests?payment=success`,
      cancelUrl: `${window.location.origin}/student/membership-requests?payment=cancelled`,
    };

    return this.createPayOSPayment(paymentId, paymentRequest);
  },

  /**
   * Student: Get paid payments
   */
  async getStudentPaidPayments(): Promise<StudentPaidPayment[]> {
    return httpClient.get<StudentPaidPayment[]>(PAYMENT_ENDPOINTS.STUDENT_PAID);
  },

  /**
   * Student: Get debts
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
};

