import { apiClient } from "@/lib/api-client";
import type {
  CreateDonationRequest,
  CreatedDonation,
  CreatePaymentIntentRequest,
  PaymentIntent,
  PaymentStatus,
} from "@/types/payment";

export const paymentService = {
  createDonation(data: CreateDonationRequest) {
    return apiClient.post<CreatedDonation>("/donations", data);
  },

  createIntent(data: CreatePaymentIntentRequest) {
    return apiClient.post<PaymentIntent>("/payments/create-intent", data);
  },

  getStatus(id: string) {
    return apiClient.get<PaymentStatus>(`/payments/${id}/status`);
  },
};
