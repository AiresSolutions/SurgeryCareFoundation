"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RoleGuard } from "@/components/shared/role-guard";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ClockIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { financeService } from "@/services/finance.service";
import { formatINR } from "@/lib/format";
import type { PaginatedData } from "@/types/api";
import type { Donation } from "@/services/finance.service";

const FILTERS = ["All", "Succeeded", "Pending", "Failed"] as const;

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "outline" | "default" }> = {
  succeeded: { label: "Succeeded", variant: "success" },
  pending: { label: "Pending", variant: "outline" },
  failed: { label: "Failed", variant: "default" },
  initiated: { label: "Initiated", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "default" },
  refunded: { label: "Refunded", variant: "outline" },
};

function getDonorDisplayName(donation: Donation): string {
  if (donation.donor) {
    return `${donation.donor.firstName} ${donation.donor.lastName}`;
  }
  return "Anonymous";
}

export default function FinanceDonationsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const limit = 20;

  const params: Record<string, string | number | boolean | undefined> = {
    page,
    limit,
    ...(activeFilter !== "All" ? { status: activeFilter.toLowerCase() } : {}),
  };

  const { data, isLoading } = useApi<PaginatedData<Donation>>(
    () => financeService.getAllDonations(params),
    [activeFilter, page],
  );

  const donations = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function handleFilterChange(filter: string) {
    setActiveFilter(filter);
    setPage(1);
  }

  return (
    <RoleGuard allowedRoles={["finance_manager", "super_admin"]}>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Link
            href="/finance"
            className="text-btn font-bold text-accent transition-colors hover:text-accent-green"
          >
            Finance
          </Link>
          <span className="text-slate-light">/</span>
          <Heading level="h2" as="h1">All Donations</Heading>
        </div>
        <Text variant="secondary" className="mb-8">
          View and manage all donations across every campaign.
        </Text>

        {/* Filter tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilterChange(filter)}
              className={cn(
                "rounded-full px-4 py-1.5 text-btn font-bold transition-colors",
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-white text-slate border border-surface-border hover:bg-surface-page",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Donations table */}
        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">
              {activeFilter === "All" ? "All Donations" : `${activeFilter} Donations`}
              <span className="ml-2 text-body text-slate-light font-normal">
                ({data?.total ?? 0})
              </span>
            </Heading>
          </div>

          {/* Table header */}
          <div className="hidden border-b border-surface-border px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
            <Text variant="muted" size="label" className="col-span-3">Donor</Text>
            <Text variant="muted" size="label" className="col-span-3">Campaign</Text>
            <Text variant="muted" size="label" className="col-span-2 text-right">Amount</Text>
            <Text variant="muted" size="label" className="col-span-2 text-center">Status</Text>
            <Text variant="muted" size="label" className="col-span-2 text-right">Date</Text>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Text variant="secondary">Loading donations...</Text>
            </div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
                <ClockIcon className="size-7 text-slate-light" />
              </span>
              <Text variant="secondary" className="text-center">
                No {activeFilter === "All" ? "" : activeFilter.toLowerCase() + " "}donations found.
              </Text>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {donations.map((donation) => {
                const cfg = STATUS_CONFIG[donation.status] ?? {
                  label: donation.status,
                  variant: "outline" as const,
                };
                const donorName = getDonorDisplayName(donation);

                return (
                  <div
                    key={donation.id}
                    className="flex flex-col gap-3 px-6 py-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                  >
                    {/* Donor */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Avatar
                        initials={donorName.slice(0, 2).toUpperCase()}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-btn font-black text-primary">
                          {donorName}
                        </p>
                        {donation.donor?.email && (
                          <Text variant="muted" size="label" className="truncate normal-case tracking-normal">
                            {donation.donor.email}
                          </Text>
                        )}
                      </div>
                    </div>

                    {/* Campaign */}
                    <div className="col-span-3 min-w-0">
                      {donation.campaign ? (
                        <Link
                          href={`/causes/${donation.campaign.slug}`}
                          className="truncate text-btn font-bold text-primary hover:text-accent transition-colors"
                        >
                          {donation.campaign.title}
                        </Link>
                      ) : (
                        <Text variant="muted">Unknown Campaign</Text>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 text-right">
                      <p className="text-btn font-black text-accent">
                        &#8377; {formatINR(donation.amount)}
                      </p>
                      <Text variant="muted" size="label" className="normal-case tracking-normal">
                        {donation.currency}
                      </Text>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex sm:justify-center">
                      <Badge variant={cfg.variant} className="text-[10px]">
                        {cfg.label}
                      </Badge>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-right">
                      <Text variant="muted" size="label" className="normal-case tracking-normal">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
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
