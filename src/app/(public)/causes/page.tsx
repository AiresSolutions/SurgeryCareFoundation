"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import { useApi } from "@/hooks/use-api";
import { campaignService } from "@/services/campaign.service";
import { CAMPAIGN_CATEGORIES, categoryLabel } from "@/lib/categories";
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

const CONDITIONS = [
  {
    group: "Paediatric Surgery",
    items: [
      "Burns (children & adults)",
      "Cleft lip & palate",
      "Cystic hygroma (lymphangioma)",
      "Spina bifida & meningomyelocele",
      "Encephalocele",
      "Hydrocephalus",
      "Omphalocele",
      "Bladder exstrophy",
      "Ectopia cordis",
      "Conjoined twins",
      "Torticollis & neck abnormalities",
      "Achalasia",
    ],
  },
  {
    group: "Oncology & Tumors",
    items: [
      "Neuroblastoma",
      "Neuroectodermal tumour",
      "Visible oncology cases",
      "Visible tumours",
      "Huge abdominal tumours",
      "Von Recklinghausen’s disease (Neurofibromatosis 1)",
    ],
  },
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
    <section className="bg-surface-page py-16 md:py-24">
      <Container>
        {/* Conditions We Treat */}
        <div className="mb-12 rounded-[32px] border border-surface-border bg-white p-8 shadow-card md:p-10">
          <div className="mb-6 max-w-2xl">
            <Text size="label" className="mb-3 text-accent">
              CONDITIONS WE TREAT
            </Text>
            <Heading level="h2" as="h2" className="mb-3">
              Surgical care across paediatric, oncology and complex cases
            </Heading>
            <Text variant="secondary">
              Surgery Care supports patients with a wide range of surgical needs.
              Below are the conditions our network of partner hospitals regularly treats.
            </Text>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {CONDITIONS.map((group) => (
              <div key={group.group}>
                <p className="mb-3 text-btn font-black uppercase tracking-[0.7px] text-primary">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-surface-green px-4 py-2 text-caption font-bold text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Text size="label" className="mb-3 text-accent">
              PUBLIC FUNDRAISERS
            </Text>
            <Heading level="h1" as="h1" className="mb-4">
              All campaigns on Surgery Care Foundation
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
                const pct = Math.round(
                  (campaign.raisedAmount / campaign.goalAmount) * 100
                );
                return (
                  <Link
                    key={campaign.id}
                    href={`/causes/${campaign.slug}`}
                    className="block transition-transform hover:-translate-y-1"
                  >
                  <Card className="h-full overflow-hidden">
                    <div className="relative h-56 overflow-hidden bg-surface-page">
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
                      <Image
                        src={campaign.coverImageUrl || "/images/placeholder.jpg"}
                        alt={campaign.title}
                        fill
                        className="object-contain"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                        <p className="text-lg font-black text-white">
                          {campaign.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <Badge variant="accent" className="text-caption">
                            {categoryLabel(campaign.category)}
                          </Badge>
                          {campaign.condition && (
                            <span className="text-caption font-bold text-white/90">
                              {campaign.condition}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardContent>
                      <Text variant="secondary" className="mb-4 line-clamp-2">
                        {campaign.summary}
                      </Text>
                      <div className="mb-1 flex justify-between">
                        <p className="text-btn font-black text-primary">
                          &#8377; {formatINR(campaign.raisedAmount)}
                        </p>
                        <p className="text-btn font-black text-primary">
                          {campaign._count?.donations || 0}
                        </p>
                      </div>
                      <div className="mb-3 flex justify-between">
                        <Text as="span" variant="muted" size="label">
                          Raised
                        </Text>
                        <Text as="span" variant="muted" size="label">
                          Backers
                        </Text>
                      </div>
                      <div className="mb-1 flex justify-between">
                        <Text as="span" variant="muted" size="label">
                          Goal: &#8377; {formatINR(campaign.goalAmount)}
                        </Text>
                        <Text as="span" variant="muted" size="label">
                          {pct}%
                        </Text>
                      </div>
                      <ProgressBar
                        value={campaign.raisedAmount}
                        max={campaign.goalAmount}
                        className="mb-4"
                      />
                      <span
                        className={buttonVariants({
                          variant: "outline",
                          className: "w-full",
                        })}
                      >
                        Donate Now
                      </span>
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
