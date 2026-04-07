export interface CreateDonationRequest {
  campaignId: string;
  amount: number;
  currency?: string;
  isAnonymous?: boolean;
  message?: string;
  donorName?: string;
  donorEmail?: string;
}

export interface CreatedDonation {
  id: string;
  campaignId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface DonationInitiation {
  donation: CreatedDonation;
  paymentIntent: PaymentIntent;
}

export interface CreatePaymentIntentRequest {
  donationId: string;
  amount: number;
  currency?: string;
}

export interface PaymentIntent {
  id: string;
  donationId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  providerOrderId: string | null;
  providerIntentId: string | null;
  clientData: {
    key: string;
    order_id: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    prefill?: {
      name?: string;
      email?: string;
    };
  };
}

export interface PaymentStatus {
  id: string;
  status: string;
  donation: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}
