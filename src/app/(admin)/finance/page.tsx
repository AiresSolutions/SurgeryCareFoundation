"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { financeService } from "@/services/finance.service";
import { formatINR } from "@/lib/format";
import type { PaginatedData } from "@/types/api";
import type { Donation, Withdrawal } from "@/services/finance.service";

const DONATION_STATUS_CONFIG: Record<string, { label: string; variant: "success" | "outline" | "default" }> = {
  succeeded: { label: "Succeeded", variant: "success" },
  pending: { label: "Pending", variant: "outline" },
  failed: { label: "Failed", variant: "default" },
  initiated: { label: "Initiated", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "default" },
  refunded: { label: "Refunded", variant: "outline" },
};

const WITHDRAWAL_STATUS_CONFIG: Record<string, { label: string; variant: "default" | "accent" | "success" | "outline" }> = {
  requested: { label: "Requested", variant: "outline" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "default" },
  partially_disbursed: { label: "Partially Disbursed", variant: "accent" },
  fully_disbursed: { label: "Disbursed", variant: "accent" },
  cancelled: { label: "Cancelled", variant: "default" },
};

function getDonorDisplayName(donation: Donation): string {
  if (donation.donor) {
    return `${donation.donor.firstName} ${donation.donor.lastName}`;
  }
  return "Anonymous";
}

export default function FinanceOverviewPage() {
  const { data: donationsData, isLoading: donationsLoading } = useApi<PaginatedData<Donation>>(
    () => financeService.getAllDonations({ limit: 50 }),
    [],
  );

  const { data: withdrawalsData, isLoading: withdrawalsLoading } = useApi<PaginatedData<Withdrawal>>(
    () => financeService.getWithdrawals({ limit: 50 }),
    [],
  );

  const donations = donationsData?.items ?? [];
  const withdrawals = withdrawalsData?.items ?? [];

  const totalDonations = donations
    .filter((d) => d.status === "succeeded")
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingWithdrawalsTotal = withdrawals
    .filter((w) => w.status === "requested" || w.status === "under_review" || w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingWithdrawalsCount = withdrawals.filter(
    (w) => w.status === "requested" || w.status === "under_review",
  ).length;

  const recentDonations = donations.slice(0, 5);
  const recentPendingWithdrawals = withdrawals
    .filter((w) => w.status === "requested" || w.status === "under_review")
    .slice(0, 5);

  const isLoading = donationsLoading || withdrawalsLoading;

  return (
    <RoleGuard allowedRoles={["finance_manager", "super_admin"]}>
      <div>
        <Heading level="h2" as="h1" className="mb-2">
          Finance Overview
        </Heading>
        <Text variant="secondary" className="mb-8">
          Monitor donations, manage withdrawal requests, and track financial activity.
        </Text>

        {/* Summary stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <HeartIcon className="size-5" />
            </div>
            <Text variant="muted" size="label" className="mb-1">Total Donations</Text>
            <p className="text-h4 text-primary">
              {isLoading ? "\u2014" : <>&#8377; {formatINR(totalDonations)}</>}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ClockIcon className="size-5" />
            </div>
            <Text variant="muted" size="label" className="mb-1">Pending Withdrawals</Text>
            <p className="text-h4 text-primary">
              {isLoading ? "\u2014" : <>&#8377; {formatINR(pendingWithdrawalsTotal)}</>}
            </p>
            {!isLoading && pendingWithdrawalsCount > 0 && (
              <Text variant="muted" size="label" className="mt-1 normal-case tracking-normal">
                {pendingWithdrawalsCount} request{pendingWithdrawalsCount !== 1 ? "s" : ""} awaiting review
              </Text>
            )}
          </div>

          <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircleIcon className="size-5" />
            </div>
            <Text variant="muted" size="label" className="mb-1">Total Transactions</Text>
            <p className="text-h4 text-primary">
              {isLoading ? "\u2014" : donations.length + withdrawals.length}
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/finance/donations"
            className="group flex items-center justify-between rounded-2xl border border-surface-border bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
          >
            <div>
              <Heading level="h4" as="h3" className="mb-1">
                All Donations
              </Heading>
              <Text variant="secondary">
                View and filter all donation records
              </Text>
            </div>
            <ArrowRightIcon className="size-5 text-slate-light transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/finance/withdrawals"
            className="group flex items-center justify-between rounded-2xl border border-surface-border bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
          >
            <div>
              <Heading level="h4" as="h3" className="mb-1">
                Withdrawals
              </Heading>
              <Text variant="secondary">
                Approve, reject, and disburse withdrawal requests
              </Text>
            </div>
            <ArrowRightIcon className="size-5 text-slate-light transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Recent activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent donations */}
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <Heading level="h4" as="h2">Recent Donations</Heading>
              <Link
                href="/finance/donations"
                className="text-btn font-bold text-accent transition-colors hover:text-accent-green"
              >
                View All
              </Link>
            </div>

            {donationsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">Loading donations...</Text>
              </div>
            ) : recentDonations.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">No donations yet</Text>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {recentDonations.map((donation) => {
                  const cfg = DONATION_STATUS_CONFIG[donation.status] ?? {
                    label: donation.status,
                    variant: "outline" as const,
                  };
                  return (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-btn font-black text-primary">
                          {getDonorDisplayName(donation)}
                        </p>
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          {donation.campaign?.title ?? "Unknown Campaign"}
                        </Text>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <Badge variant={cfg.variant} className="text-[10px]">
                          {cfg.label}
                        </Badge>
                        <p className="whitespace-nowrap text-btn font-black text-accent">
                          &#8377; {formatINR(donation.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending withdrawals */}
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <Heading level="h4" as="h2">Pending Withdrawals</Heading>
              <Link
                href="/finance/withdrawals"
                className="text-btn font-bold text-accent transition-colors hover:text-accent-green"
              >
                View All
              </Link>
            </div>

            {withdrawalsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">Loading withdrawals...</Text>
              </div>
            ) : recentPendingWithdrawals.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">No pending withdrawals</Text>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {recentPendingWithdrawals.map((withdrawal) => {
                  const cfg = WITHDRAWAL_STATUS_CONFIG[withdrawal.status] ?? {
                    label: withdrawal.status,
                    variant: "outline" as const,
                  };
                  return (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-btn font-black text-primary">
                          {withdrawal.campaign?.title ?? "Unknown Campaign"}
                        </p>
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          {withdrawal.requestedBy
                            ? `${withdrawal.requestedBy.firstName} ${withdrawal.requestedBy.lastName}`
                            : "Unknown"}{" "}
                          &middot; {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <Badge variant={cfg.variant} className="text-[10px]">
                          {cfg.label}
                        </Badge>
                        <p className="whitespace-nowrap text-btn font-black text-accent">
                          &#8377; {formatINR(withdrawal.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
