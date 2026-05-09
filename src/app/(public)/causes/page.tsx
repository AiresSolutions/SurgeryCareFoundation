"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import { useApi } from "@/hooks/use-api";
import { campaignService } from "@/services/campaign.service";
import { CAMPAIGN_CATEGORIES, categoryLabel } from "@/lib/categories";
import { UrgencyBadge } from "@/components/campaign/urgency-badge";
import type { CampaignFilters } from "@/types/campaign";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";

const FILTER_CHIPS = [
  { value: "", label: "All Causes" },
  ...CAMPAIGN_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
] as const;

export default function CausesPage() {
  const [activeFilter, setActiveFilter] = useState<string>(""); // "" = All Causes
  const [page, setPage] = useState(1);

  const filters: CampaignFilters = {
    page,
    limit: 8,
    ...(activeFilter ? { category: activeFilter } : {}),
  };

  const { data, error, isLoading } = useApi(
    () => campaignService.list(filters),
    [activeFilter, page],
  );

  const campaigns = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function handleCategoryChange(value: string) {
    setActiveFilter(value);
    setPage(1);
  }

  return (
    <section className="bg-surface-page pb-16 pt-8 md:pb-24 md:pt-10">
      <Container>
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Text size="label" className="mb-3 text-accent">
              PUBLIC FUNDRAISERS
            </Text>
            <Heading level="h1" as="h1" className="mb-4 lg:!text-[56px] lg:!leading-[60px] lg:!tracking-[-1.4px]">
              All campaigns on{" "}
              <br />
              <span className="bg-gradient-to-b from-accent-mint to-accent-green bg-clip-text text-transparent">
                Surgery Care Foundation
              </span>
            </Heading>
            <Text variant="secondary" size="body-lg">
              Browse every live fundraiser, track progress, and open a campaign to donate directly.
            </Text>
          </div>
          <div className="rounded-2xl border border-surface-border bg-white px-5 py-4 shadow-card">
            <Text size="label" variant="muted" className="mb-1">
              Showing
            </Text>
            <p className="text-h5 font-black text-primary">
              {data?.total ?? campaigns.length} campaign{(data?.total ?? campaigns.length) === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.value || "all"}
                type="button"
                onClick={() => handleCategoryChange(chip.value)}
                className={cn(
                  "rounded-full px-5 py-2 text-btn font-bold transition-colors",
                  activeFilter === chip.value
                    ? "bg-primary text-white"
                    : "bg-white text-slate hover:bg-surface-page"
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <div className="h-56 animate-pulse bg-surface-subtle" />
                <CardContent>
                  <div className="mb-4 h-10 animate-pulse rounded bg-surface-subtle" />
                  <div className="mb-3 h-4 animate-pulse rounded bg-surface-subtle" />
                  <div className="mb-4 h-2 animate-pulse rounded bg-surface-subtle" />
                  <div className="h-10 animate-pulse rounded bg-surface-subtle" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="flex justify-center py-16">
            <Text variant="secondary" className="text-red-600">
              {error}
            </Text>
          </div>
        )}

        {!isLoading && !error && campaigns.length === 0 && (
          <div className="flex justify-center py-16">
            <Text variant="secondary">No campaigns found.</Text>
          </div>
        )}

        {!isLoading && !error && campaigns.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {campaigns.map((campaign) => {
                // pctLabel surfaces "<1%" for tiny ratios so a ₹20
                // donation against a ₹15L goal still reads as funded
                // rather than a misleading "0%".
                const pctLabel = (() => {
                  if (campaign.goalAmount <= 0) return "0%";
                  const raw = (campaign.raisedAmount / campaign.goalAmount) * 100;
                  if (campaign.raisedAmount > 0 && raw < 1) return "<1%";
                  return `${Math.min(100, Math.round(raw))}%`;
                })();
                const backers = campaign._count?.donations || 0;
                return (
                  <Link
                    key={campaign.id}
                    href={`/causes/${campaign.slug}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-2xl"
                  >
                  <Card className="flex h-full flex-col overflow-hidden transition-transform group-hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-page">
                      {/* Blurred backdrop fills the dead space around
                          portrait/landscape mismatches so the actual cover
                          can stay object-contain (never clipped). */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={campaign.coverImageUrl || "/images/placeholder.jpg"}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 size-full scale-110 object-cover blur-2xl"
                      />
                      <div className="absolute inset-0 bg-black/15" />
                      <Image
                        src={campaign.coverImageUrl || "/images/placeholder.jpg"}
                        alt={campaign.title}
                        fill
                        className="relative object-contain"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="absolute left-3 right-3 top-3 z-10 flex items-center justify-between gap-2">
                        <Badge variant="accent" className="text-caption shadow-sm">
                          {categoryLabel(campaign.category)}
                        </Badge>
                        <UrgencyBadge level={campaign.urgencyLevel} className="shadow-sm" />
                      </div>
                    </div>
                    <CardContent className="flex flex-1 flex-col p-5">
                      <h3 className="mb-1 line-clamp-2 text-btn font-black text-primary transition-colors group-hover:text-accent">
                        {campaign.title}
                      </h3>
                      {campaign.condition && (
                        <Text variant="muted" size="label" className="mb-3 normal-case tracking-normal line-clamp-1">
                          {campaign.condition}
                        </Text>
                      )}
                      {campaign.summary && (
                        <Text variant="secondary" size="body" className="mb-4 line-clamp-2">
                          {campaign.summary}
                        </Text>
                      )}

                      {/* Progress */}
                      <div className="mt-auto">
                        <div className="mb-1.5 flex items-baseline justify-between gap-2">
                          <p className="text-btn font-black text-primary">
                            &#8377;&nbsp;{formatINR(campaign.raisedAmount)}
                          </p>
                          <p className="text-btn font-black text-accent">
                            {pctLabel} funded
                          </p>
                        </div>
                        <ProgressBar
                          value={campaign.raisedAmount}
                          max={campaign.goalAmount}
                          className="mb-2"
                        />
                        <div className="mb-4 flex items-center justify-between">
                          <Text variant="muted" size="label" className="normal-case tracking-normal">
                            of &#8377;&nbsp;{formatINR(campaign.goalAmount)} goal
                          </Text>
                          <Text variant="muted" size="label" className="normal-case tracking-normal">
                            {backers} {backers === 1 ? "backer" : "backers"}
                          </Text>
                        </div>
                        <span
                          className={buttonVariants({
                            variant: "secondary",
                            className: "w-full !text-white hover:!text-white",
                          })}
                        >
                          Donate Now
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={cn(
                    "rounded-full px-5 py-2 text-btn font-bold transition-colors",
                    page <= 1
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-white text-slate hover:bg-surface-page"
                  )}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={cn(
                        "rounded-full px-4 py-2 text-btn font-bold transition-colors",
                        page === p
                          ? "bg-primary text-white"
                          : "bg-white text-slate hover:bg-surface-page"
                      )}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className={cn(
                    "rounded-full px-5 py-2 text-btn font-bold transition-colors",
                    page >= totalPages
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-white text-slate hover:bg-surface-page"
                  )}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
