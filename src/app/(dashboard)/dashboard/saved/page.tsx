"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/format";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { BookmarkIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { useApi } from "@/hooks/use-api";
import { userService, type SavedCauseEntry } from "@/services/user.service";

export default function SavedCausesPage() {
  const { toast } = useToast();
  const { data, isLoading, error, refetch } = useApi<SavedCauseEntry[]>(
    () => userService.getSavedCauses(),
    [],
  );
  const [causes, setCauses] = useState<SavedCauseEntry[]>([]);

  useEffect(() => {
    setCauses(data ?? []);
  }, [data]);

  async function handleRemove(campaignId: string) {
    try {
      await userService.removeSavedCause(campaignId);
      setCauses((prev) => prev.filter((entry) => entry.campaign.id !== campaignId));
      toast("Cause removed from your saved list.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to remove saved cause.", "error");
    }
  }

  return (
    <div>
      <Heading level="h2" as="h1" className="mb-2">
        Saved Causes
      </Heading>
      <Text variant="secondary" className="mb-8">
        Causes you&apos;ve bookmarked for later. {!isLoading && `(${causes.length} saved)`}
      </Text>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-surface-border bg-white py-20 shadow-card">
          <Text variant="secondary">Loading your saved causes...</Text>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-white py-20 shadow-card">
          <Heading level="h3" as="h2" className="mb-2 text-accent">
            Unable to load saved causes
          </Heading>
          <Text variant="secondary" className="mb-6 max-w-sm text-center">
            {error}
          </Text>
          <button
            type="button"
            onClick={refetch}
            className={buttonVariants({ variant: "secondary" })}
          >
            Try Again
          </button>
        </div>
      ) : causes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-white py-20 shadow-card">
          <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-surface-page">
            <BookmarkIcon className="size-8 text-slate-light" />
          </span>
          <Heading level="h3" as="h2" className="mb-2 text-accent">
            No saved causes yet
          </Heading>
          <Text variant="secondary" className="mb-6 max-w-sm text-center">
            Browse causes and bookmark the ones you&apos;d like to support later.
          </Text>
          <Link href="/causes" className={buttonVariants({ variant: "secondary" })}>
            Browse Causes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {causes.map((entry) => {
            const cause = entry.campaign;
            const pct = Math.round((cause.raisedAmount / cause.goalAmount) * 100);

            return (
              <div
                key={entry.id}
                className="rounded-2xl border border-surface-border bg-white shadow-card"
              >
                <div className="flex flex-col gap-6 p-6 sm:flex-row">
                  <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-44">
                    <Image
                      src={cause.coverImageUrl || "/images/placeholder.jpg"}
                      alt={cause.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 176px, 100vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex items-center gap-3">
                      <Badge variant="accent" className="text-[10px]">
                        {cause.category}
                      </Badge>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal"
                      >
                        Saved on{" "}
                        {new Date(entry.savedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </div>

                    <Heading level="h4" as="h2" className="mb-2 text-accent">
                      {cause.title}
                    </Heading>

                    <Text variant="secondary" className="mb-4 line-clamp-2">
                      {cause.summary}
                    </Text>

                    <div className="mb-1 flex items-baseline justify-between">
                      <Text className="font-black text-primary">
                        &#8377; {formatINR(cause.raisedAmount)} raised
                      </Text>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal"
                      >
                        Goal: &#8377; {formatINR(cause.goalAmount)} • {pct}%
                      </Text>
                    </div>
                    <ProgressBar
                      value={cause.raisedAmount}
                      max={cause.goalAmount}
                      className="mb-4"
                    />

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/causes/${cause.slug}/checkout`}
                        className={buttonVariants({
                          variant: "secondary",
                          className: "flex-1 sm:flex-none",
                        })}
                      >
                        Donate Now
                      </Link>
                      <Link
                        href={`/causes/${cause.slug}`}
                        className={buttonVariants({
                          variant: "outline",
                          className: "flex-1 sm:flex-none",
                        })}
                      >
                        View Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(cause.id)}
                        className={buttonVariants({
                          variant: "outline",
                          className:
                            "flex-1 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 sm:flex-none",
                        })}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
