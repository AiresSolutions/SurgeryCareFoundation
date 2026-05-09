import { Container } from "@/components/ui/container";
import { ShieldCheckIcon } from "@/components/ui/icons";

const TRUST_BADGES = [
  "Registered NGO",
  "12A Tax Exempt",
  "80G Donor Benefit",
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-surface-border bg-white py-5">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
          {TRUST_BADGES.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 text-btn font-bold uppercase tracking-[1px] text-primary"
            >
              <ShieldCheckIcon className="size-5 text-accent" />
              {label}
            </span>
          ))}
          <span
            aria-hidden="true"
            className="hidden text-slate-light sm:inline"
          >
            ·
          </span>
          <span className="text-btn font-bold uppercase tracking-[1px] text-slate-light">
            Documents available on request
          </span>
        </div>
      </Container>
    </section>
  );
}
