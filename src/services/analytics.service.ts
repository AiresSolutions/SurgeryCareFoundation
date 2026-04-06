import { apiClient } from "@/lib/api-client";

type AnalyticsPeriod = "week" | "month" | "year";

interface DashboardAnalytics {
  overview: {
    totalRaised: number;
    totalDonors: number;
    totalCampaigns: number;
    avgDonation: number;
  };
  trends: {
    date: string;
    donations: number;
    amount: number;
  }[];
  topCampaigns: {
    id: string;
    title: string;
    raisedAmount: number;
    goalAmount: number;
    donorCount: number;
  }[];
}

interface DonationAnalytics {
  totalAmount: number;
  totalCount: number;
  avgAmount: number;
  byDay: { date: string; amount: number; count: number }[];
  byMethod: { method: string; amount: number; count: number }[];
}

interface CampaignAnalytics {
  totalCampaigns: number;
  byStatus: { status: string; count: number }[];
  byCategory: { category: string; count: number }[];
  completionRate: number;
  avgFundingPercentage: number;
}

interface AnalyticsFilters {
  period?: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
}

export const analyticsService = {
  getDashboard(period?: AnalyticsPeriod) {
    return apiClient.get<DashboardAnalytics>("/analytics/dashboard", {
      params: period
        ? ({ period } as Record<string, string | number | boolean | undefined>)
        : undefined,
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
