"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { useAuth } from "@/context/auth-context";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useApi } from "@/hooks/use-api";
import { analyticsService, type AnalyticsOverview } from "@/services/analytics.service";
import { formatINR } from "@/lib/format";

// ─── Role guard ──────────────────────────────────────────
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
          <Text variant="secondary">You do not have permission to view this page.</Text>
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            Go Home
          </Link>
        </div>
      </Container>
    );
  }
  return <>{children}</>;
}

// ─── Helpers ─────────────────────────────────────────────
const inr = (n: number) => `₹ ${formatINR(n)}`;
const compactInr = (n: number) => {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}k`;
  return `₹${n}`;
};
const formatDayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

function deltaPct(current: number, prior: number): number | null {
  if (prior <= 0) return current > 0 ? null : 0;
  return Math.round(((current - prior) / prior) * 100);
}

const STATUS_COLOR: Record<string, string> = {
  SUCCEEDED: "#0caf7b",
  INITIATED: "#90a1b9",
  FAILED: "#ef4444",
  REFUNDED: "#f59e0b",
};
const URGENCY_TONE: Record<string, string> = {
  critical: "bg-red-50 text-red-700 ring-1 ring-red-200",
  high: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

// ─── KPI Card ────────────────────────────────────────────
function KpiCard({
  label,
  value,
  delta,
  sublabel,
}: {
  label: string;
  value: string;
  delta?: { value: number | null; positiveIsGood?: boolean };
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
      <Text variant="muted" size="label" className="mb-2 tracking-wider">
        {label}
      </Text>
      <p className="text-h4 font-black text-primary">{value}</p>
      <div className="mt-2 flex items-center gap-2 min-h-[20px]">
        {delta && delta.value !== null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-bold ${
              (delta.positiveIsGood ?? true) === delta.value >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {delta.value >= 0 ? "▲" : "▼"} {Math.abs(delta.value)}%
          </span>
        )}
        {sublabel && (
          <Text as="span" variant="muted" size="label" className="normal-case tracking-normal">
            {sublabel}
          </Text>
        )}
      </div>
    </div>
  );
}

// ─── Section Card ────────────────────────────────────────
function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-surface-border px-5 py-4">
        <div>
          <Heading level="h4" as="h2">
            {title}
          </Heading>
          {description && (
            <Text variant="muted" size="label" className="normal-case tracking-normal">
              {description}
            </Text>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────
function AdminDashboardInner() {
  const { data, isLoading, error } = useApi<AnalyticsOverview>(
    () => analyticsService.getOverview(),
    [],
  );

  const todayDelta = useMemo(
    () => deltaPct(data?.deltas.raisedToday ?? 0, data?.deltas.raisedYesterday ?? 0),
    [data],
  );
  const weekDelta = useMemo(
    () => deltaPct(data?.deltas.raisedThisWeek ?? 0, data?.deltas.raisedLastWeek ?? 0),
    [data],
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Text variant="secondary">Loading dashboard...</Text>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <Heading level="h4" as="h2" className="mb-2 text-red-800">
          Couldn&apos;t load dashboard
        </Heading>
        <Text className="text-red-700">{error ?? "Unknown error."}</Text>
      </div>
    );
  }

  const { kpis, deltas, statusBreakdown30d, timeseries30d, topCampaigns, recentDonations } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading level="h3" as="h1" className="mb-1">
          Dashboard
        </Heading>
        <Text variant="secondary">
          Live overview of donations, campaigns, and platform health. Cached 60 seconds.
        </Text>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Raised"
          value={inr(kpis.totalRaised)}
          delta={{ value: weekDelta }}
          sublabel="vs last 7d"
        />
        <KpiCard
          label="Total Donors"
          value={kpis.totalDonors.toLocaleString("en-IN")}
          sublabel={`${kpis.totalDonations.toLocaleString("en-IN")} donations`}
        />
        <KpiCard
          label="Active Campaigns"
          value={kpis.activeCampaigns.toLocaleString("en-IN")}
          sublabel={`${kpis.urgentCampaigns} urgent · ${kpis.totalCampaigns} total`}
        />
        <KpiCard
          label="30-day Conversion"
          value={`${kpis.conversionRate30d}%`}
          sublabel="succeeded / attempted"
        />
        <KpiCard
          label="Today"
          value={inr(deltas.raisedToday)}
          delta={{ value: todayDelta }}
          sublabel={`${deltas.donationsToday} donations`}
        />
        <KpiCard
          label="This Week"
          value={inr(deltas.raisedThisWeek)}
          sublabel={`${deltas.donationsThisWeek} donations`}
        />
        <KpiCard
          label="Pending Withdrawals"
          value={kpis.pendingWithdrawals.toLocaleString("en-IN")}
          sublabel="awaiting approval"
        />
        <KpiCard
          label="Yesterday"
          value={inr(deltas.raisedYesterday)}
          sublabel={`${deltas.donationsYesterday} donations`}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Raised Over Time"
          description="Last 30 days, successful donations only"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseries30d}>
                <defs>
                  <linearGradient id="raisedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0caf7b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#0caf7b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  tickFormatter={formatDayLabel}
                  tick={{ fontSize: 11, fill: "#62748e" }}
                  tickMargin={6}
                />
                <YAxis
                  tickFormatter={compactInr}
                  tick={{ fontSize: 11, fill: "#62748e" }}
                  width={50}
                />
                <Tooltip
                  formatter={(v: number) => [inr(v), "Raised"]}
                  labelFormatter={(d: string) => formatDayLabel(d)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="raised"
                  stroke="#0caf7b"
                  strokeWidth={2}
                  fill="url(#raisedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Donations by Day"
          description="Successful donations per day, last 30 days"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeseries30d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  tickFormatter={formatDayLabel}
                  tick={{ fontSize: 11, fill: "#62748e" }}
                  tickMargin={6}
                />
                <YAxis tick={{ fontSize: 11, fill: "#62748e" }} width={30} />
                <Tooltip
                  formatter={(v: number) => [String(v), "Donations"]}
                  labelFormatter={(d: string) => formatDayLabel(d)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Bar dataKey="donations" fill="#014a62" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Status breakdown + Top campaigns */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Donation Status"
          description="Last 30 days"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusBreakdown30d} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#62748e" }} />
                <YAxis
                  dataKey="status"
                  type="category"
                  tick={{ fontSize: 11, fill: "#45556c", fontWeight: 700 }}
                  width={90}
                />
                <Tooltip
                  formatter={(v: number) => [String(v), "Count"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {statusBreakdown30d.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLOR[s.status] ?? "#90a1b9"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard
            title="Top Active Campaigns"
            description="Sorted by amount raised"
            action={
              <Link
                href="/admin/campaigns"
                className="text-btn font-bold text-accent hover:underline"
              >
                View all →
              </Link>
            }
          >
            {topCampaigns.length === 0 ? (
              <Text variant="secondary">No active campaigns yet.</Text>
            ) : (
              <ul className="divide-y divide-surface-border">
                {topCampaigns.map((c) => (
                  <li key={c.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/causes/${c.slug}`}
                        className="line-clamp-1 text-btn font-bold text-primary hover:text-accent"
                      >
                        {c.title}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {c.urgencyLevel && URGENCY_TONE[c.urgencyLevel] && (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-caption font-bold uppercase ${URGENCY_TONE[c.urgencyLevel]}`}
                          >
                            {c.urgencyLevel}
                          </span>
                        )}
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          {inr(c.raisedAmount)} of {inr(c.goalAmount)}
                        </Text>
                      </div>
                    </div>
                    <div className="w-full sm:w-48">
                      <ProgressBar value={c.raisedAmount} max={c.goalAmount} />
                      <Text variant="muted" size="label" className="mt-1 text-right normal-case tracking-normal">
                        {c.pct < 1 && c.raisedAmount > 0 ? "<1" : c.pct}% funded
                      </Text>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Recent donations */}
      <SectionCard
        title="Recent Donations"
        description="Last 15 transactions across all statuses"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="pb-3 text-label uppercase tracking-wider text-slate-medium">When</th>
                <th className="pb-3 text-label uppercase tracking-wider text-slate-medium">Donor</th>
                <th className="pb-3 text-label uppercase tracking-wider text-slate-medium">Campaign</th>
                <th className="pb-3 text-right text-label uppercase tracking-wider text-slate-medium">
                  Amount
                </th>
                <th className="pb-3 text-right text-label uppercase tracking-wider text-slate-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {recentDonations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    <Text variant="secondary">No donations yet.</Text>
                  </td>
                </tr>
              )}
              {recentDonations.map((d) => (
                <tr key={d.id}>
                  <td className="py-3 pr-3 align-top">
                    <Text variant="secondary" size="label" className="normal-case tracking-normal">
                      {new Date(d.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <Text className="font-bold">
                      {d.isAnonymous ? "Anonymous" : d.donorName ?? "—"}
                    </Text>
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <Link
                      href={`/causes/${d.campaign.slug}`}
                      className="line-clamp-1 text-btn font-bold text-primary hover:text-accent"
                    >
                      {d.campaign.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 text-right align-top font-black text-primary">
                    {inr(d.amount)}
                  </td>
                  <td className="py-3 text-right align-top">
                    <Badge
                      variant={
                        d.status === "SUCCEEDED"
                          ? "success"
                          : d.status === "FAILED"
                            ? "default"
                            : "outline"
                      }
                      className="text-[10px]"
                    >
                      {d.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <AdminDashboardInner />
    </RoleGuard>
  );
}
