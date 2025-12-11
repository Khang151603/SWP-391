import type {
  PayOSCreatePaymentRequest,
  PayOSPaymentResponse,
  MembershipPaymentRequest,
} from '../types/payment.types';

// PayOS API Base URL
const PAYOS_API_BASE_URL = 'https://ximena-unaccountable-carmelina.ngrok-free.dev';

/**
 * Payment Service
 */
export const paymentService = {
  /**
   * Create PayOS payment link
   */
  async createPayOSPayment(
    paymentId: number,
    data: PayOSCreatePaymentRequest
  ): Promise<PayOSPaymentResponse> {
    // PayOS API requires payment ID in URL path
    const response = await fetch(`${PAYOS_API_BASE_URL}/api/PayOS/create/${paymentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `PayOS API error: ${response.status} ${response.statusText}`
      );
    }

    // Check if response is a string URL or JSON object
    const responseText = await response.text();
    
    // Try to parse as JSON first
    try {
      const jsonData = JSON.parse(responseText);
      return jsonData;
    } catch {
      // If not JSON, treat as plain text URL
      return responseText.trim();
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
};

