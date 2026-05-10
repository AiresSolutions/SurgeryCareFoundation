import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";

interface DonationFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface WithdrawalFilters {
  page?: number;
  limit?: number;
  status?: string;
}

interface ApproveWithdrawalRequest {
  notes?: string;
}

interface RejectWithdrawalRequest {
  reason: string;
  notes?: string;
}

interface DisburseRequest {
  amount: number;
  transactionReference?: string;
  notes?: string;
}

interface ReconciliationFilters {
  startDate: string;
  endDate: string;
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  status: string;
  donorId: string;
  campaignId: string;
  paymentMethod: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  donor?: { id: string; firstName: string; lastName: string; email: string };
  campaign?: { id: string; title: string; slug: string };
}

export interface Withdrawal {
  id: string;
  campaignId: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  reviewNote?: string;
  transactionReference: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  campaign?: { id: string; title: string; slug: string };
  requestedBy?: { id: string; firstName: string; lastName: string };
}

export interface ReconciliationData {
  period: { startDate: string; endDate: string };
  donations: {
    total: number;
    count: number;
  };
  withdrawalRequests: {
    total: number;
    count: number;
  };
  disbursements: {
    total: number;
    count: number;
  };
  netBalance: number;
}

export const financeService = {
  listDonations(filters?: DonationFilters) {
    return apiClient.get<PaginatedData<Donation>>("/finance/donations", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  getAllDonations(params?: Record<string, string | number | boolean | undefined>) {
    return apiClient.get<PaginatedData<Donation>>("/finance/donations", {
      params,
    });
  },

  async exportDonations(filters?: { startDate?: string; endDate?: string; status?: string }) {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.status) params.status = filters.status;

    const { blob, filename } = await apiClient.download(
      "/finance/donations/export",
      { params },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? "donations.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  listWithdrawals(filters?: WithdrawalFilters) {
    return apiClient.get<PaginatedData<Withdrawal>>("/finance/withdrawals", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  getWithdrawals(params?: Record<string, string | number | boolean | undefined>) {
    return apiClient.get<PaginatedData<Withdrawal>>("/finance/withdrawals", {
      params,
    });
  },

  approveWithdrawal(id: string, data?: ApproveWithdrawalRequest) {
    return apiClient.post<Withdrawal>(`/finance/withdrawals/${id}/approve`, data);
  },

  rejectWithdrawal(id: string, data: RejectWithdrawalRequest) {
    return apiClient.post<Withdrawal>(`/finance/withdrawals/${id}/reject`, data);
  },

  disburse(id: string, data: DisburseRequest) {
    return apiClient.post<Withdrawal>(`/finance/withdrawals/${id}/disburse`, data);
  },

  getReconciliation(filters?: ReconciliationFilters) {
    return apiClient.get<ReconciliationData>("/finance/reconciliation", {
      params: filters ? { ...filters } : undefined,
    });
  },
};
