import { HeroSection } from "@/components/home/hero-section";
import { ImpactStats } from "@/components/home/impact-stats";
import { MissionSection } from "@/components/home/mission-section";
import { CausesPreview } from "@/components/home/causes-preview";
import { VolunteerTeam } from "@/components/home/volunteer-team";
import { StatsBar } from "@/components/home/stats-bar";
import { Testimonials } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq-section";
import { TrustStrip } from "@/components/ui/trust-strip";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImpactStats />
      <TrustStrip />
      <CausesPreview />
      <MissionSection />
      <VolunteerTeam />
      <StatsBar />
      <Testimonials />
      <FaqSection />
    </>
  );
}
