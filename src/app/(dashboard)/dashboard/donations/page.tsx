"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import { downloadReceipt } from "@/lib/download-receipt";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { CalendarIcon, CheckCircleIcon, ClockIcon, HeartIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { userService } from "@/services/user.service";
import type { PaginatedData } from "@/types/api";
import type { Donation } from "@/types/donation";

const FILTERS = ["All", "Succeeded", "Pending", "Failed"] as const;

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "outline" | "default" }> = {
  SUCCEEDED: { label: "Succeeded", variant: "success" },
  PENDING: { label: "Pending", variant: "outline" },
  FAILED: { label: "Failed", variant: "default" },
  INITIATED: { label: "Initiated", variant: "outline" },
  CANCELLED: { label: "Cancelled", variant: "default" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

export default function DonationHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const params: Record<string, string | number | boolean | undefined> =
    activeFilter === "All" ? {} : { status: activeFilter.toUpperCase() };

  const { data, isLoading } = useApi<PaginatedData<Donation>>(
    () => userService.getDonations(params),
    [activeFilter],
  );

  async function handleDownload(donationId: string, receiptNumber?: string) {
    if (downloadingId) return;
    setDownloadingId(donationId);
    try {
      await downloadReceipt(donationId, receiptNumber ? `receipt-${receiptNumber}.pdf` : undefined);
    } catch {
      toast("Couldn't download receipt. Please try again.", "error");
    } finally {
      setDownloadingId(null);
    }
  }

  const donations = data?.items ?? [];

  const totalDonated = donations
    .filter((d) => d.status === "SUCCEEDED")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalCount = donations.filter((d) => d.status === "SUCCEEDED").length;

  const lastDonationDate =
    donations.length > 0
      ? new Date(donations[0].createdAt).toLocaleDateString()
      : "\u2014";

  return (
    <div>
      <Heading level="h2" as="h1" className="mb-2">Donation History</Heading>
      <Text variant="secondary" className="mb-8">View all your past donations and download receipts.</Text>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <HeartIcon className="size-5" />
          </div>
          <Text variant="muted" size="label" className="mb-1">Total Donated</Text>
          <p className="text-h4 text-primary">
            {isLoading ? "\u2014" : <>&#8377; {formatINR(totalDonated)}</>}
          </p>
        </div>
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <CheckCircleIcon className="size-5" />
          </div>
          <Text variant="muted" size="label" className="mb-1">Successful Donations</Text>
          <p className="text-h4 text-primary">{isLoading ? "\u2014" : totalCount}</p>
        </div>
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarIcon className="size-5" />
          </div>
          <Text variant="muted" size="label" className="mb-1">Last Donation</Text>
          <p className="text-h4 text-primary">{isLoading ? "\u2014" : lastDonationDate}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "rounded-full px-4 py-1.5 text-btn font-bold transition-colors",
              activeFilter === filter
                ? "bg-primary text-white"
                : "bg-white text-slate border border-surface-border hover:bg-surface-page"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Donations list */}
      <div className="rounded-2xl border border-surface-border bg-white shadow-card">
        <div className="border-b border-surface-border px-6 py-4">
          <Heading level="h4" as="h2">
            {activeFilter === "All" ? "All Donations" : `${activeFilter} Donations`}
            <span className="ml-2 text-body text-slate-light font-normal">({donations.length})</span>
          </Heading>
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
              const cfg = STATUS_CONFIG[donation.status] ?? { label: donation.status, variant: "outline" as const };
              return (
                <div key={donation.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: campaign info */}
                  <div className="flex items-center gap-4">
                    <Avatar initials={donation.campaign.title.slice(0, 2).toUpperCase()} size="md" />
                    <div>
                      <Link
                        href={`/causes/${donation.campaign.slug}`}
                        className="text-btn font-black text-primary hover:text-accent transition-colors"
                      >
                        {donation.campaign.title}
                      </Link>
                      <Text variant="muted" size="label" className="normal-case tracking-normal">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>

                  {/* Right: amount, status, receipt */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <Badge variant={cfg.variant} className="text-[10px]">
                      {cfg.label}
                    </Badge>
                    <div className="text-right">
                      <p className="text-btn font-black text-accent">&#8377; {formatINR(donation.amount)}</p>
                      {donation.receipt?.receiptNumber ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(donation.id, donation.receipt?.receiptNumber)}
                          disabled={downloadingId === donation.id}
                          className="text-label text-primary hover:text-accent transition-colors font-bold disabled:opacity-50"
                        >
                          {downloadingId === donation.id ? "Downloading..." : "Download Receipt"}
                        </button>
                      ) : (
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          No receipt
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
