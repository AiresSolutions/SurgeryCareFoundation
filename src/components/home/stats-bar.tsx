"use client";

import { Container } from "@/components/ui/container";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";
import { formatINR } from "@/lib/format";

export function StatsBar() {
  const { data: stats, isLoading } = useApi(() => publicService.getStats(), []);
  const raisedValue = !isLoading && stats
    ? `\u20B9 ${formatINR(stats.totalRaised)}`
    : "\u2014";
  const donationsValue = !isLoading && stats
    ? stats.totalDonors.toLocaleString("en-IN")
    : "\u2014";
  const activeCausesValue = !isLoading && stats
    ? String(stats.totalCampaigns)
    : "\u2014";

  const items = [
    { value: "400+", label: "Volunteers" },
    { value: raisedValue, label: "Raised" },
    { value: donationsValue, label: "Donations" },
    { value: activeCausesValue, label: "Active Causes" },
  ];

  return (
    <section className="border-y border-surface-border bg-white py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="mb-1 text-[40px] font-black leading-tight text-primary md:text-[48px]">
                {stat.value}
              </p>
              <p className="text-body-sm font-bold text-slate-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
