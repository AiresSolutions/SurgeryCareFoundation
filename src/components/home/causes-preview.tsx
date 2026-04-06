"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { useApi } from "@/hooks/use-api";
import { campaignService } from "@/services/campaign.service";
import type { Campaign } from "@/types/campaign";

function CauseCard({ cause }: { cause: Campaign }) {
  const percentage = cause.goalAmount > 0
    ? Math.round((cause.raisedAmount / cause.goalAmount) * 100)
    : 0;

  return (
    <Card>
      {/* Image with overlay */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={cause.coverImageUrl || "/images/placeholder.jpg"}
          alt={cause.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />

        {/* Name & category overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
          <p className="text-lg font-black text-white">{cause.title}</p>
          <Badge variant="accent" className="mt-1 text-caption">
            {cause.category}
          </Badge>
        </div>
      </div>

      <CardContent>
        <Text variant="secondary" className="mb-4 line-clamp-2">
          {cause.summary}
        </Text>

        {/* Stats row */}
        <div className="mb-1 flex items-baseline justify-between">
          <p className="text-btn font-black text-primary">
            &#8377; {formatINR(cause.raisedAmount)}
          </p>
          <p className="text-btn font-black text-primary">
            {cause._count?.donations ?? 0}
          </p>
        </div>
        <div className="mb-3 flex justify-between">
          <Text as="span" variant="muted" size="label">Raised</Text>
          <Text as="span" variant="muted" size="label">Backers</Text>
        </div>

        {/* Progress */}
        <div className="mb-1 flex justify-between">
          <Text as="span" variant="muted" size="label">
            Goal: &#8377; {formatINR(cause.goalAmount)}
          </Text>
          <Text as="span" variant="muted" size="label">{percentage}%</Text>
        </div>
        <ProgressBar value={cause.raisedAmount} max={cause.goalAmount} className="mb-4" />

        {/* CTA */}
        <Link
          href={`/causes/${cause.slug}`}
          className={buttonVariants({
            variant: "outline",
            size: "default",
            className: "w-full",
          })}
        >
          Donate Now
        </Link>
      </CardContent>
    </Card>
  );
}

export function CausesPreview() {
  const { data, isLoading } = useApi(
    () => campaignService.list({ limit: 4, sort: "createdAt", order: "desc" }),
    [],
  );

  const campaigns = data?.items ?? [];

  return (
    <section className="bg-surface-page py-16 md:py-24">
      <Container>
        <div className="mb-12 max-w-lg">
          <Heading level="h2" className="mb-4">
            Help and donate to them when they are in need.
          </Heading>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : campaigns.length === 0 ? (
          <Text variant="secondary" className="text-center py-12">
            No active campaigns right now. Check back soon!
          </Text>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {campaigns.map((campaign) => (
              <CauseCard key={campaign.id} cause={campaign} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
