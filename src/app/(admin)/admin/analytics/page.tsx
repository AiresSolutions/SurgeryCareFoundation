"use client";

import { RoleGuard } from "@/components/shared/role-guard";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import {
  analyticsService,
  type DashboardAnalytics,
  type DonationAnalytics,
  type CampaignAnalytics,
} from "@/services/analytics.service";
import { getLastNDaysRange } from "@/lib/date-range";
import { formatINR } from "@/lib/format";

const DEFAULT_RANGE = getLastNDaysRange(30);

function formatDateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminAnalyticsPage() {
  const { data: dashboardData, isLoading: dashboardLoading } = useApi<DashboardAnalytics>(
    () => analyticsService.getDashboard(DEFAULT_RANGE),
    [],
  );
  const { data: donationData, isLoading: donationsLoading } = useApi<DonationAnalytics>(
    () => analyticsService.getDonationAnalytics({ ...DEFAULT_RANGE, groupBy: "day" }),
    [],
  );
  const { data: campaignData, isLoading: campaignsLoading } = useApi<CampaignAnalytics>(
    () => analyticsService.getCampaignAnalytics(DEFAULT_RANGE),
    [],
  );

  const isLoading = dashboardLoading || donationsLoading || campaignsLoading;
  const campaigns = campaignData?.data ?? [];
  const donationRows = donationData?.data ?? [];

  const overviewCards = dashboardData
    ? [
        { label: "Funds Raised", value: `₹ ${formatINR(dashboardData.totalFundsRaised)}` },
        { label: "Patients Supported", value: String(dashboardData.totalPatients) },
        { label: "Active Campaigns", value: String(dashboardData.activeCampaigns) },
        { label: "Urgent Campaigns", value: String(dashboardData.urgentCampaigns) },
        { label: "Unique Donors", value: String(dashboardData.totalDonors) },
        { label: "Pending Withdrawals", value: String(dashboardData.pendingWithdrawals) },
      ]
    : [];

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Analytics
          </Heading>
          <Text variant="secondary">
            Performance summary for {formatDateLabel(DEFAULT_RANGE.startDate)} - {formatDateLabel(DEFAULT_RANGE.endDate)}.
          </Text>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
              <Text variant="muted" size="label" className="mb-1">
                {card.label}
              </Text>
              <p className="text-h4 text-primary">
                {isLoading ? "\u2014" : card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">Donation Trends</Heading>
          </div>

          {donationRows.length === 0 && !isLoading ? (
            <div className="px-6 py-16">
              <Text variant="secondary">No donation analytics available for this period.</Text>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {donationRows.map((row) => (
                <div key={row.period} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-btn font-black text-primary">{row.period}</p>
                    <Text variant="secondary">{row.count} donation{row.count === 1 ? "" : "s"}</Text>
                  </div>
                  <p className="text-btn font-black text-accent">₹ {formatINR(row.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">Campaign Performance</Heading>
          </div>

          {campaigns.length === 0 && !isLoading ? (
            <div className="px-6 py-16">
              <Text variant="secondary">No campaign analytics available for this period.</Text>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {campaigns.slice(0, 10).map((campaign) => (
                <div key={campaign.id} className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-btn font-black text-primary">{campaign.title}</p>
                    <Text variant="secondary">
                      Created {new Date(campaign.createdAt).toLocaleDateString("en-IN")}
                    </Text>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="text-[10px]">
                      {campaign.status}
                    </Badge>
                    <Text variant="secondary">{campaign.donationCount} donations</Text>
                    <Text variant="secondary">₹ {formatINR(campaign.raisedAmount)} / ₹ {formatINR(campaign.goalAmount)}</Text>
                    <Text className="font-black text-accent">{campaign.completionRate}% funded</Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
