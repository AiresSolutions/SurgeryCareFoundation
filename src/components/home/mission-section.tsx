import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/ui/icons";

export function MissionSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Image */}
          <div className="relative mx-auto h-[400px] w-full max-w-lg overflow-hidden rounded-[48px] shadow-elevated lg:h-[520px]">
            <Image
              src="/images/mission.jpg"
              alt="Young patient receiving care at Surgery Care Foundation"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 530px, (min-width: 640px) 512px, 100vw"
            />
          </div>

          {/* Right — Content */}
          <div>
            {/* Label */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[3px] w-8 rounded-full bg-accent-green" />
              <Text
                as="span"
                size="label"
                className="font-black tracking-[1.4px] text-accent-green"
              >
                Make an Impact
              </Text>
            </div>

            {/* Heading */}
            <Heading level="h2" className="mb-6">
              Donate to{" "}
              <span className="bg-gradient-to-b from-accent-green to-accent-mint bg-clip-text text-transparent">
                Support
              </span>{" "}
              Life-Saving Surgeries
            </Heading>

            {/* Body */}
            <Text variant="secondary" size="body-lg" className="mb-8">
              Surgery Care partners with top hospitals across India to bring
              high-quality treatment to every class of patient. For families
              who cannot afford care, we raise the funds needed and complete
              the treatment at no cost &mdash; staying with the patient end to end.
            </Text>

            {/* Callout */}
            <div className="mb-8 flex items-center gap-4 rounded-2xl border-l-4 border-accent bg-white p-6 shadow-soft">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-green">
                <CheckCircleIcon className="size-6 text-accent" />
              </span>
              <p className="text-btn-lg font-bold text-primary">
                The patient always comes first &mdash; from first consult to full recovery.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/about"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "gap-2",
              })}
            >
              About Us
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
