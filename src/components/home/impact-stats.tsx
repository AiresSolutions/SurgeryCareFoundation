"use client";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";
import { formatINR } from "@/lib/format";

export function ImpactStats() {
  const { data: stats, isLoading } = useApi(() => publicService.getStats(), []);

  const totalRaised = stats?.totalRaised ?? 0;
  const totalGoal = stats?.totalGoal ?? 0;
  const raisedDisplay = isLoading ? "\u2014" : `\u20B9 ${formatINR(totalRaised)}`;
  const goalDisplay = isLoading ? "\u2014" : `\u20B9 ${formatINR(totalGoal)}`;
  // Same "<1%" rule as cause cards: if money has come in but the
  // ratio rounds to zero, show "<1% funded" so donors don't think the
  // counter is broken.
  const fundedLabel = (() => {
    if (isLoading || totalGoal <= 0) return "\u2014";
    const raw = (totalRaised / totalGoal) * 100;
    if (totalRaised > 0 && raw < 1) return "<1% funded";
    return `${Math.min(100, Math.round(raw))}% funded`;
  })();

  return (
    <section className="relative -mt-16 z-10 pb-8">
      <Container>
        <div className="grid gap-6 rounded-[40px] bg-white p-8 shadow-elevated md:grid-cols-2 md:p-12">
          {/* Left — Total Raised */}
          <div className="border-r-0 pr-0 md:border-r md:border-surface-subtle md:pr-12">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="size-3 rounded-full bg-accent-mint shadow-[0px_0px_10px_0px_#00eea3]" />
              <Heading level="h4" as="h2" className="tracking-[-0.6px]">
                Total Raised Fund
              </Heading>
            </div>

            <div className="mb-1 flex items-end justify-between">
              <div>
                <p className="text-[30px] font-black leading-[30px] tracking-tight text-primary">
                  {raisedDisplay}
                </p>
                <Text as="span" variant="muted" size="label" className="mt-1 uppercase tracking-[1.2px] text-slate-medium">
                  Raised
                </Text>
              </div>
              <div className="text-right">
                <p className="text-h4 font-black text-accent">
                  {goalDisplay}
                </p>
                <Text as="span" variant="muted" size="label" className="mt-1 uppercase tracking-[1.2px] text-slate-medium">
                  Goal
                </Text>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Text as="span" variant="muted" size="label" className="uppercase tracking-[1.2px] text-slate-medium">
                Progress
              </Text>
              <p className="text-btn font-black text-accent">{fundedLabel}</p>
            </div>
            <ProgressBar
              value={isLoading ? 0 : totalRaised}
              max={totalGoal || 1}
              className="mt-2"
            />

            {/* Secondary stats */}
            {!isLoading && stats && (
              <div className="mt-6 flex gap-8">
                <div>
                  <p className="text-lg font-black text-primary">{stats.totalDonors.toLocaleString("en-IN")}</p>
                  <Text as="span" variant="muted" size="label" className="uppercase tracking-[1.2px] text-slate-medium">
                    Donors
                  </Text>
                </div>
                <div>
                  <p className="text-lg font-black text-primary">{stats.totalCampaigns}</p>
                  <Text as="span" variant="muted" size="label" className="uppercase tracking-[1.2px] text-slate-medium">
                    Campaigns
                  </Text>
                </div>
              </div>
            )}
          </div>

          {/* Right — How Your Support Helps */}
          <div className="border-t border-surface-border pt-6 md:border-t-0 md:pl-10 md:pt-0">
            <div className="mb-3 flex gap-3">
              <span className="rounded-full bg-primary px-3 py-1 text-[11.2px] font-bold uppercase tracking-[0.56px] text-white">
                Year 2025
              </span>
              <span className="rounded-full bg-surface-green px-3 py-1 text-[11.2px] font-bold uppercase tracking-[0.56px] text-accent">
                Healthcare
              </span>
            </div>

            <Heading level="h3" as="h2" className="mb-4 text-[40px] leading-[50px] tracking-[-1px]">
              How Your Support Makes a Difference
            </Heading>

            <Text variant="default" className="text-[18px] leading-[29.25px]">
              Every donation funds a verified surgical case at a partnered
              hospital. We stay with each patient from counselling through
              recovery.
            </Text>
          </div>
        </div>
      </Container>
    </section>
  );
}
