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

export interface AnalyticsOverview {
  kpis: {
    totalRaised: number;
    totalDonations: number;
    totalDonors: number;
    activeCampaigns: number;
    urgentCampaigns: number;
    totalCampaigns: number;
    pendingWithdrawals: number;
    conversionRate30d: number;
  };
  deltas: {
    raisedToday: number;
    donationsToday: number;
    raisedYesterday: number;
    donationsYesterday: number;
    raisedThisWeek: number;
    donationsThisWeek: number;
    raisedLastWeek: number;
    donationsLastWeek: number;
  };
  statusBreakdown30d: Array<{ status: string; count: number; total: number }>;
  timeseries30d: Array<{ day: string; raised: number; donations: number }>;
  topCampaigns: Array<{
    id: string;
    slug: string;
    title: string;
    status: string;
    urgencyLevel: string | null;
    goalAmount: number;
    raisedAmount: number;
    pct: number;
  }>;
  recentDonations: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    donorName: string | null;
    isAnonymous: boolean;
    createdAt: string;
    campaign: { id: string; slug: string; title: string };
  }>;
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

  getOverview() {
    return apiClient.get<AnalyticsOverview>("/analytics/overview");
  },
};
