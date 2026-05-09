import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { RotatingTagline } from "./rotating-tagline";
import { MobileHeroSlideshow } from "./mobile-hero-slideshow";

const HERO_IMAGES = [
  {
    src: "/images/hero-1.jpg",
    alt: "Children smiling together",
    className: "col-start-1 row-start-1 row-span-2 h-[280px] md:h-[352px]",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "Child in need of medical care",
    className: "col-start-2 row-start-1 h-[180px] md:h-[229px]",
  },
  {
    src: "/images/hero-3.jpg",
    alt: "Elderly patient receiving care",
    className: "col-start-2 row-start-2 row-span-2 h-[280px] md:h-[372px]",
  },
  {
    src: "/images/hero-4.jpg",
    alt: "Community support for patients",
    className: "col-start-1 row-start-3 h-[180px] md:h-[229px]",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Background heart watermark */}
      <div className="pointer-events-none absolute left-1/3 top-0 size-[500px] opacity-[0.07] lg:size-[713px]">
        <svg viewBox="0 0 200 200" fill="none" className="size-full">
          <path
            d="M100 180s-70-50-85-90C5 55 25 20 60 20c20 0 35 15 40 25 5-10 20-25 40-25 35 0 55 35 45 70-15 40-85 90-85 90z"
            stroke="currentColor"
            strokeWidth="4"
            className="text-white"
          />
        </svg>
      </div>

      <Container className="relative pb-16 pt-8 md:pb-20 md:pt-10 lg:pb-24 lg:pt-12">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left Column: Text Content ──────────────── */}
          <div>
            {/* Eyebrow — rotating tagline */}
            <div className="relative mb-4 inline-flex max-w-full">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-accent-mint/60 via-accent-green/60 to-accent-mint/60 opacity-80 blur-[6px]"
              />
              <span className="relative inline-flex rounded-full bg-primary-deep/70 px-5 py-2 ring-1 ring-inset ring-accent-mint/50 backdrop-blur-md">
                <span className="bg-gradient-to-r from-accent-mint via-accent-green to-accent-mint bg-clip-text text-label font-black uppercase tracking-[1.4px] text-transparent">
                  <RotatingTagline />
                </span>
              </span>
            </div>

            {/* Heading */}
            <Heading level="h1" className="mb-6 text-white lg:!text-[72px] lg:!leading-[76px] lg:!tracking-[-1.8px]">
              Quality Surgery for{" "}
              <span className="bg-gradient-to-b from-accent-mint to-accent-green bg-clip-text text-transparent">
                Every Patient
              </span>
            </Heading>

            {/* Description */}
            <Text
              variant="on-dark"
              size="body-lg"
              className="mb-6 max-w-md text-justify text-white/90"
            >
              We connect patients to top hospitals across India for high-quality
              treatment, and raise funds so that no family has to delay
              life-saving surgery for cost. Every case is medically verified
              before it goes live, and your contribution is sent directly to
              the hospital, never to a personal account.
            </Text>

            {/* CTA Button */}
            <Link
              href="/causes"
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className: "gap-3 pr-3",
              })}
            >
              Donate Now
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/30">
                <ArrowRightIcon className="size-4 text-primary-deep" />
              </span>
            </Link>
          </div>

          {/* ── Right Column: Image Collage ────────────── */}
          <div className="hidden lg:block">
            <div className="grid auto-rows-auto grid-cols-2 gap-4">
              {HERO_IMAGES.map((image) => (
                <div
                  key={image.src}
                  className={`relative overflow-hidden rounded-image ${image.className}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 280px, 0px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: rotating hero slideshow */}
          <MobileHeroSlideshow />
        </div>
      </Container>
    </section>
  );
}
