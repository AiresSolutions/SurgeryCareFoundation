"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { campaignService } from "@/services/campaign.service";
import { formatINR } from "@/lib/format";
import type { PaginatedData } from "@/types/api";
import type { Campaign } from "@/types/campaign";

export default function MyFundraisersPage() {
  const { data, isLoading, refetch } = useApi<PaginatedData<Campaign>>(
    () => campaignService.getMyCampaigns(),
    [],
  );

  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const campaigns = data?.items ?? [];

  async function handleSubmit(id: string) {
    setSubmittingId(id);
    try {
      await campaignService.submit(id);
      refetch();
    } catch {
      // submission failed — user can retry
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level="h2" as="h1" className="mb-1">My Fundraisers</Heading>
          <Text variant="secondary">Manage and track the progress of your created causes.</Text>
        </div>
        <Link href="/fundraiser/new" className={buttonVariants({ variant: "secondary", className: "gap-2" })}>
          + New
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-surface-border bg-white py-16 shadow-card">
          <Text variant="secondary">Loading fundraisers...</Text>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-white py-16 shadow-card">
          <Text variant="secondary" className="mb-4">You haven&apos;t created any fundraisers yet.</Text>
          <Link href="/fundraiser/new" className={buttonVariants({ variant: "secondary" })}>
            + Create Your First Fundraiser
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-2xl border border-surface-border bg-white shadow-card">
              <div className="flex flex-col gap-6 p-6 sm:flex-row">
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
                  <Image
                    src={campaign.coverImageUrl || "/images/placeholder.jpg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge variant="accent" className="text-[10px]">
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1).replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <Heading level="h4" as="h2" className="mb-3 text-accent">
                    {campaign.title}
                  </Heading>

                  <div className="mb-2 flex items-baseline justify-between">
                    <Text className="font-black text-primary">
                      &#8377; {formatINR(campaign.raisedAmount)} raised
                    </Text>
                    <Text variant="muted" size="label" className="normal-case tracking-normal">
                      Goal: &#8377; {formatINR(campaign.goalAmount)}
                    </Text>
                  </div>
                  <ProgressBar value={campaign.raisedAmount} max={campaign.goalAmount} className="mb-4" />

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/causes/${campaign.slug}`}
                      className={buttonVariants({ variant: "outline", className: "flex-1 sm:flex-none" })}
                    >
                      View Public Page
                    </Link>
                    {campaign.status === "draft" && (
                      <button
                        type="button"
                        onClick={() => handleSubmit(campaign.id)}
                        disabled={submittingId === campaign.id}
                        className={buttonVariants({ variant: "outline", className: "flex-1 sm:flex-none" })}
                      >
                        {submittingId === campaign.id ? "Submitting..." : "Submit for Review"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
