// Payment API Types
export interface PayOSCreatePaymentRequest {
  orderCode: number;
  amount: number;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  returnUrl: string;
  cancelUrl: string;
}

export interface PayOSCreatePaymentResponse {
  error: number;
  message: string;
  data?: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    qrCode: string;
    checkoutUrl: string;
    expiresAt: string;
  };
}

// Response can be either a string URL or the full object
export type PayOSPaymentResponse = string | PayOSCreatePaymentResponse;

export interface MembershipPaymentRequest {
  membershipRequestId: number;
  paymentId: number | null;
  amount: number;
  clubName: string;
}

