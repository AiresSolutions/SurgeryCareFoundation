import { apiClient } from "@/lib/api-client";

export interface DashboardAnalytics {
  totalFundsRaised: number;
  totalPatients: number;
  activeCampaigns: number;
  urgentCampaigns: number;
  totalDonors: number;
  pendingWithdrawals: number;
}

export interface DonationAnalytics {
  groupBy: "day" | "week" | "month";
  data: {
    period: string;
    total: number;
    count: number;
  }[];
}

export interface CampaignAnalytics {
  data: {
    id: string;
    title: string;
    slug: string;
    status: string;
    goalAmount: number;
    raisedAmount: number;
    donationCount: number;
    completionRate: number;
    createdAt: string;
  }[];
}

interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month";
}

export const analyticsService = {
  getDashboard(filters?: Pick<AnalyticsFilters, "startDate" | "endDate">) {
    return apiClient.get<DashboardAnalytics>("/analytics/dashboard", {
      params: filters as Record<string, string | number | boolean | undefined> | undefined,
    });
  },

  getDonationAnalytics(filters?: AnalyticsFilters) {
    return apiClient.get<DonationAnalytics>("/analytics/donations", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  getCampaignAnalytics(filters?: AnalyticsFilters) {
    return apiClient.get<CampaignAnalytics>("/analytics/campaigns", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },
};
