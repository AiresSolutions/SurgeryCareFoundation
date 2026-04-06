"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  UsersIcon,
  GridIcon,
  HeartIcon,
  ClockIcon,
  FileTextIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { adminService } from "@/services/admin.service";
import type { AdminDashboard } from "@/services/admin.service";
import { formatINR } from "@/lib/format";

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

const QUICK_LINKS = [
  { label: "Donors", href: "/admin/donors", icon: UsersIcon },
  { label: "Campaigns", href: "/admin/campaigns", icon: GridIcon },
  { label: "Audit Logs", href: "/admin/audit", icon: ShieldCheckIcon },
  { label: "Content", href: "/admin/content", icon: FileTextIcon },
] as const;

export default function AdminDashboardPage() {
  const { data, isLoading } = useApi<AdminDashboard>(
    () => adminService.getDashboard(),
    [],
  );

  const stats = [
    {
      label: "Total Users",
      value: data ? String(data.totalUsers) : "\u2014",
      icon: UsersIcon,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Campaigns",
      value: data ? String(data.totalCampaigns) : "\u2014",
      icon: GridIcon,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Total Donations",
      value: data ? String(data.totalDonations) : "\u2014",
      icon: HeartIcon,
      color: "bg-red-50 text-red-500",
    },
    {
      label: "Total Raised",
      value: data ? `\u20B9 ${formatINR(data.totalRaised)}` : "\u2014",
      icon: HeartIcon,
      color: "bg-surface-green text-accent",
    },
    {
      label: "Active Campaigns",
      value: data ? String(data.activeCampaigns) : "\u2014",
      icon: GridIcon,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Pending Withdrawals",
      value: data ? String(data.pendingWithdrawals) : "\u2014",
      icon: ClockIcon,
      color: "bg-yellow-50 text-yellow-600",
    },
  ] as const;

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Admin Dashboard
          </Heading>
          <Text variant="secondary">
            Platform-wide overview and management tools.
          </Text>
        </div>

        {/* Stats grid */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-surface-border bg-white p-6 shadow-card"
            >
              <div
                className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="size-5" />
              </div>
              <Text variant="muted" size="label" className="mb-1">
                {label}
              </Text>
              <p className="text-h4 text-primary">
                {isLoading ? "\u2014" : value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">
              Quick Links
            </Heading>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-bg p-4 transition-all hover:border-accent hover:shadow-md"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="text-btn font-black text-primary">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
