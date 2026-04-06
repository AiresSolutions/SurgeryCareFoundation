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

export interface CreatePaymentIntentRequest {
  donationId: string;
  amount: number;
  currency?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  gatewayOrderId: string;
}

export interface PaymentStatus {
  id: string;
  status: string;
  donationId: string;
}
