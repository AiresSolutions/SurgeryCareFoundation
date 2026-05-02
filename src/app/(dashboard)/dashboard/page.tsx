"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { HeartIcon, GridIcon, BookmarkIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/context/auth-context";
import { userService } from "@/services/user.service";
import { formatINR } from "@/lib/format";
import { getDefaultAppRoute } from "@/lib/get-default-app-route";
import type { PaginatedData } from "@/types/api";
import type { Donation } from "@/types/donation";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useApi<PaginatedData<Donation>>(
    () => userService.getDonations({ limit: 50, status: "succeeded" }),
    [],
  );
  const { data: savedCauses } = useApi(
    () => userService.getSavedCauses(),
    [],
  );

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const appHome = getDefaultAppRoute(user.roles);
    if (appHome !== "/dashboard") {
      router.replace(appHome);
    }
  }, [authLoading, router, user]);

  const donations = data?.items ?? [];

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const causesSupported = new Set(donations.map((d) => d.campaignId)).size;
  const recentDonations = donations.slice(0, 3);

  const stats = [
    { label: "Total Donated", value: `\u20B9 ${formatINR(totalDonated)}`, icon: HeartIcon, color: "bg-red-50 text-red-500" },
    { label: "Causes Supported", value: String(causesSupported), icon: GridIcon, color: "bg-accent/10 text-accent" },
    { label: "Saved Causes", value: String(savedCauses?.length ?? 0), icon: BookmarkIcon, color: "bg-primary/10 text-primary" },
  ] as const;

  return (
    <div>
      {/* Header row */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Heading level="h2" as="h1">Dashboard Overview</Heading>
        <Link href="/fundraiser/new" className={buttonVariants({ variant: "secondary", className: "gap-2" })}>
          + Start a Fundraiser
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
            <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="size-5" />
            </div>
            <Text variant="muted" size="label" className="mb-1">{label}</Text>
            <p className="text-h4 text-primary">
              {isLoading ? "\u2014" : value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Donations */}
      <div className="rounded-2xl border border-surface-border bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <Heading level="h4" as="h2">Recent Donations</Heading>
          <Link href="/dashboard/donations" className="text-btn font-bold text-accent transition-colors hover:text-accent-green">
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Text variant="secondary">Loading donations...</Text>
          </div>
        ) : recentDonations.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Text variant="secondary">No donations yet</Text>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar initials={donation.campaign.title.slice(0, 2).toUpperCase()} size="md" />
                  <div>
                    <p className="text-btn font-black text-primary">{donation.campaign.title}</p>
                    <Text variant="muted" size="label" className="normal-case tracking-normal">
                      Donated on {new Date(donation.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-btn font-black text-accent">&#8377; {formatINR(donation.amount)}</p>
                  <Text variant="muted" size="label" className="normal-case tracking-normal">
                    {donation.receipt ? "Download Receipt" : "No receipt"}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
