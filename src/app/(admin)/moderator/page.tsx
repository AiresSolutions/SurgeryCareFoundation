"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "@/components/ui/icons";
import { RoleGuard } from "@/components/shared/role-guard";
import { useApi } from "@/hooks/use-api";
import { moderationService } from "@/services/moderation.service";
import type { PaginatedData } from "@/types/api";
import type { Campaign } from "@/types/campaign";

const FILTER_TABS = ["All", "Submitted", "Under Review"] as const;

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "accent" | "success" | "outline" }
> = {
  submitted: { label: "Submitted", variant: "outline" },
  under_review: { label: "Under Review", variant: "accent" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "default" },
  draft: { label: "Draft", variant: "outline" },
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "outline" },
  completed: { label: "Completed", variant: "accent" },
  closed: { label: "Closed", variant: "default" },
};

const URGENCY_CONFIG: Record<
  string,
  { label: string; variant: "default" | "accent" | "success" | "outline" }
> = {
  critical: { label: "Critical", variant: "default" },
  high: { label: "High", variant: "accent" },
  medium: { label: "Medium", variant: "outline" },
  low: { label: "Low", variant: "success" },
};

function filterToStatus(filter: string): string | undefined {
  if (filter === "All") return undefined;
  if (filter === "Under Review") return "under_review";
  return filter.toLowerCase();
}

export default function ModeratorDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const statusParam = filterToStatus(activeTab);

  const { data, isLoading } = useApi<PaginatedData<Campaign>>(
    () => moderationService.listPendingCampaigns({ status: statusParam }),
    [activeTab],
  );

  const campaigns = data?.items ?? [];

  return (
    <RoleGuard allowedRoles={["moderator", "super_admin"]}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Moderation Queue
          </Heading>
          <Text variant="secondary">
            Review, approve, or reject campaigns pending moderation.
          </Text>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-4 py-1.5 text-btn font-bold transition-colors",
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-white text-slate border border-surface-border hover:bg-surface-page",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Campaign list */}
        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">
              {activeTab === "All" ? "All Pending Campaigns" : `${activeTab} Campaigns`}
              <span className="ml-2 text-body text-slate-light font-normal">
                ({data?.total ?? 0})
              </span>
            </Heading>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-surface-border border-t-accent" />
              <Text variant="secondary">Loading campaigns...</Text>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
                <ClockIcon className="size-7 text-slate-light" />
              </span>
              <Text variant="secondary" className="text-center">
                No {activeTab === "All" ? "pending" : activeTab.toLowerCase()} campaigns to review.
              </Text>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden border-b border-surface-border bg-surface-bg px-6 py-3 lg:grid lg:grid-cols-7 lg:gap-4">
                <Text variant="muted" size="label" className="col-span-2">
                  Title
                </Text>
                <Text variant="muted" size="label">
                  Category
                </Text>
                <Text variant="muted" size="label" className="text-center">
                  Urgency
                </Text>
                <Text variant="muted" size="label" className="text-center">
                  Status
                </Text>
                <Text variant="muted" size="label" className="text-right">
                  Submitted
                </Text>
                <Text variant="muted" size="label" className="text-right">
                  Action
                </Text>
              </div>

              {/* Rows */}
              <div className="divide-y divide-surface-border">
                {campaigns.map((campaign) => {
                  const statusCfg = STATUS_CONFIG[campaign.status] ?? {
                    label: campaign.status,
                    variant: "outline" as const,
                  };
                  const urgencyCfg = URGENCY_CONFIG[campaign.urgencyLevel] ?? {
                    label: campaign.urgencyLevel,
                    variant: "outline" as const,
                  };
                  const creatorName = campaign.creator
                    ? `${campaign.creator.firstName} ${campaign.creator.lastName}`
                    : "Unknown";
                  const submittedDate = new Date(campaign.createdAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" },
                  );

                  return (
                    <div
                      key={campaign.id}
                      className="grid items-center gap-2 px-6 py-4 lg:grid-cols-7 lg:gap-4"
                    >
                      {/* Title + Creator */}
                      <div className="col-span-2">
                        <p className="text-btn font-black text-primary truncate">
                          {campaign.title}
                        </p>
                        <Text
                          variant="muted"
                          size="label"
                          className="normal-case tracking-normal"
                        >
                          by {creatorName}
                        </Text>
                      </div>

                      {/* Category */}
                      <Text variant="secondary" className="capitalize">
                        {campaign.category}
                      </Text>

                      {/* Urgency */}
                      <div className="flex lg:justify-center">
                        <Badge variant={urgencyCfg.variant} className="text-[10px]">
                          {urgencyCfg.label}
                        </Badge>
                      </div>

                      {/* Status */}
                      <div className="flex lg:justify-center">
                        <Badge variant={statusCfg.variant} className="text-[10px]">
                          {statusCfg.label}
                        </Badge>
                      </div>

                      {/* Submitted date */}
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal text-right"
                      >
                        {submittedDate}
                      </Text>

                      {/* Review link */}
                      <div className="flex lg:justify-end">
                        <Link
                          href={`/moderator/campaigns/${campaign.id}`}
                          className="rounded-full border border-primary bg-transparent px-4 py-1.5 text-btn font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
