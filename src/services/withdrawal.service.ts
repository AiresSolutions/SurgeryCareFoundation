import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";

export interface Withdrawal {
  id: string;
  campaignId: string;
  amount: number;
  currency: string;
  status: string; // requested, under_review, approved, rejected, partially_disbursed, fully_disbursed, cancelled
  reason?: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
  campaign?: { id: string; title: string; slug: string };
}

export interface CampaignBalance {
  availableBalance: number;
  totalRaised: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
}

export const withdrawalService = {
  requestWithdrawal(data: { campaignId: string; amount: number; reason?: string }) {
    return apiClient.post<Withdrawal>("/withdrawals", data);
  },

  getMyWithdrawals(params?: {
    page?: number;
    limit?: number;
    campaignId?: string;
    status?: string;
  }) {
    return apiClient.get<PaginatedData<Withdrawal>>("/withdrawals/me", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getById(id: string) {
    return apiClient.get<Withdrawal>(`/withdrawals/${id}`);
  },

  getCampaignWithdrawals(campaignId: string, params?: { page?: number; limit?: number }) {
    return apiClient.get<PaginatedData<Withdrawal>>(`/withdrawals/campaign/${campaignId}`, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getCampaignBalance(campaignId: string) {
    return apiClient.get<CampaignBalance>(`/withdrawals/campaign/${campaignId}/balance`);
  },
};
