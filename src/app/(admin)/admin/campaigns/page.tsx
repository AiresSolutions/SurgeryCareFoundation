"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ClockIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { adminService } from "@/services/admin.service";
import { formatINR } from "@/lib/format";
import type { PaginatedData } from "@/types/api";
import type { Campaign } from "@/types/campaign";

function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="flex items-center justify-center">
          <Text variant="secondary">Loading...</Text>
        </div>
      </Container>
    );
  }

  if (!user || !user.roles.some((r) => allowedRoles.includes(r))) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Heading level="h3">Access Denied</Heading>
          <Text variant="secondary">
            You do not have permission to view this page.
          </Text>
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            Go Home
          </Link>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}

const STATUS_FILTERS = [
  "All",
  "Draft",
  "Submitted",
  "Active",
  "Completed",
  "Rejected",
] as const;

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "accent" | "success" | "outline" }
> = {
  draft: { label: "Draft", variant: "outline" },
  submitted: { label: "Submitted", variant: "outline" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "accent" },
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "outline" },
  rejected: { label: "Rejected", variant: "default" },
  completed: { label: "Completed", variant: "accent" },
  closed: { label: "Closed", variant: "default" },
};

export default function AdminCampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const limit = 20;

  const statusParam =
    statusFilter === "All" ? undefined : statusFilter.toLowerCase();

  const { data, isLoading } = useApi<PaginatedData<Campaign>>(
    () =>
      adminService.listCampaigns({
        page,
        limit,
        status: statusParam,
      }),
    [page, statusFilter],
  );

  const campaigns = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Campaign Management
          </Heading>
          <Text variant="secondary">
            View and manage all campaigns on the platform.
          </Text>
        </div>

        {/* Status filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setStatusFilter(filter);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-btn font-bold transition-colors",
                statusFilter === filter
                  ? "bg-primary text-white"
                  : "bg-white text-slate border border-surface-border hover:bg-surface-page",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">
              {statusFilter === "All"
                ? "All Campaigns"
                : `${statusFilter} Campaigns`}
              <span className="ml-2 text-body text-slate-light font-normal">
                ({data?.total ?? 0})
              </span>
            </Heading>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Text variant="secondary">Loading campaigns...</Text>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
                <ClockIcon className="size-7 text-slate-light" />
              </span>
              <Text variant="secondary" className="text-center">
                No{" "}
                {statusFilter === "All"
                  ? ""
                  : statusFilter.toLowerCase() + " "}
                campaigns found.
              </Text>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden border-b border-surface-border bg-surface-bg px-6 py-3 lg:grid lg:grid-cols-6 lg:gap-4">
                <Text variant="muted" size="label" className="col-span-2">
                  Title
                </Text>
                <Text variant="muted" size="label">
                  Category
                </Text>
                <Text variant="muted" size="label" className="text-center">
                  Status
                </Text>
                <Text variant="muted" size="label" className="text-right">
                  Raised / Goal
                </Text>
                <Text variant="muted" size="label" className="text-right">
                  Created
                </Text>
              </div>

              {/* Rows */}
              <div className="divide-y divide-surface-border">
                {campaigns.map((campaign) => {
                  const cfg = STATUS_CONFIG[campaign.status] ?? {
                    label: campaign.status,
                    variant: "outline" as const,
                  };
                  const creatorName = campaign.creator
                    ? `${campaign.creator.firstName} ${campaign.creator.lastName}`
                    : "Unknown";

                  return (
                    <Link
                      key={campaign.id}
                      href={`/admin/campaigns/${campaign.id}`}
                      className="grid items-center gap-2 px-6 py-4 hover:bg-surface-page lg:grid-cols-6 lg:gap-4"
                    >
                      <div className="col-span-2">
                        <p className="text-btn font-black text-primary truncate hover:text-accent">
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
                      <Text variant="secondary" className="capitalize">
                        {campaign.category}
                      </Text>
                      <div className="flex lg:justify-center">
                        <Badge
                          variant={cfg.variant}
                          className="text-[10px]"
                        >
                          {cfg.label}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-btn font-black text-accent">
                          &#8377; {formatINR(campaign.raisedAmount)}
                        </p>
                        <Text
                          variant="muted"
                          size="label"
                          className="normal-case tracking-normal"
                        >
                          of &#8377; {formatINR(campaign.goalAmount)}
                        </Text>
                      </div>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal text-right"
                      >
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </Text>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-surface-border px-6 py-4">
              <Text variant="muted" size="label" className="normal-case tracking-normal">
                Page {page} of {totalPages}
              </Text>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
