"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/shared/role-guard";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { financeService } from "@/services/finance.service";
import { useApi } from "@/hooks/use-api";
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

export default function FinanceReconciliationPage() {
  const { data, isLoading } = useApi(
    () => financeService.getReconciliation(DEFAULT_RANGE),
    [],
  );

  const cards = data
    ? [
        {
          label: "Succeeded Donations",
          total: data.donations.total,
          count: data.donations.count,
        },
        {
          label: "Withdrawal Requests",
          total: data.withdrawalRequests.total,
          count: data.withdrawalRequests.count,
        },
        {
          label: "Disbursements",
          total: data.disbursements.total,
          count: data.disbursements.count,
        },
      ]
    : [];

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
          <Heading level="h2" as="h1">Reconciliation</Heading>
        </div>
        <Text variant="secondary" className="mb-8">
          Financial summary for the last 30 days.
        </Text>

        <div className="mb-8 rounded-2xl border border-surface-border bg-white p-6 shadow-card">
          <Text variant="muted" size="label" className="mb-1">
            Period
          </Text>
          <p className="text-btn font-black text-primary">
            {isLoading || !data
              ? "Loading..."
              : `${formatDateLabel(data.period.startDate)} - ${formatDateLabel(data.period.endDate)}`}
          </p>
          <Text variant="secondary" className="mt-3">
            Net balance is calculated as succeeded donations minus disbursements in the selected period.
          </Text>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
              <Text variant="muted" size="label" className="mb-1">
                {card.label}
              </Text>
              <p className="text-h4 text-primary">
                {isLoading ? "\u2014" : `₹ ${formatINR(card.total)}`}
              </p>
              <Text variant="secondary" className="mt-1">
                {isLoading ? "" : `${card.count} record${card.count === 1 ? "" : "s"}`}
              </Text>
            </div>
          ))}

          <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
            <Text variant="muted" size="label" className="mb-1">
              Net Balance
            </Text>
            <p className="text-h4 text-primary">
              {isLoading || !data ? "\u2014" : `₹ ${formatINR(data.netBalance)}`}
            </p>
            <Text variant="secondary" className="mt-1">
              Available after recorded disbursements
            </Text>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/finance/donations"
            className="rounded-2xl border border-surface-border bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
          >
            <Heading level="h4" as="h2" className="mb-2">
              Open Donations
            </Heading>
            <Text variant="secondary">
              Review succeeded and pending donations in detail.
            </Text>
          </Link>

          <Link
            href="/finance/withdrawals"
            className="rounded-2xl border border-surface-border bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
          >
            <Heading level="h4" as="h2" className="mb-2">
              Open Withdrawals
            </Heading>
            <Text variant="secondary">
              Review approvals, rejections, and disbursement history.
            </Text>
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}
