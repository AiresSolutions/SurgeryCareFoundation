import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { MailIcon, PhoneIcon, MapPinIcon, ArrowRightIcon } from "@/components/ui/icons";

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/causes", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "#",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
] as const;

const PAYMENT_METHODS = [
  { src: "/images/pay-amex.png", alt: "American Express", width: 68 },
  { src: "/images/pay-upi.png", alt: "UPI", width: 40 },
  { src: "/images/pay-paytm.png", alt: "Paytm", width: 48 },
  { src: "/images/pay-visa.png", alt: "Visa", width: 50 },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-surface-border bg-surface-bg">
      {/* Gradient line */}
      <div className="h-1 bg-footer-line" />

      {/* Green blur decoration — bottom right */}
      <div className="pointer-events-none absolute -bottom-20 right-0 h-[433px] w-[624px] rounded-full bg-[rgba(208,250,229,0.5)] blur-[120px]" />

      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div>
            <div className="mb-4 flex items-baseline gap-2">
              <Heading level="h4" as="h2" className="text-[30px] leading-[36px] tracking-[-0.75px]">
                Surgery Care
              </Heading>
              <span className="text-[20px] font-bold uppercase tracking-[1px] text-accent">
                Promise
              </span>
            </div>

            <Text variant="secondary" className="mb-6 max-w-[391px]">
              At Surgery Care Foundation, we provide timely and ethical surgical
              care to underprivileged patients, using every donation
              transparently to support life-saving treatment with compassion and
              trust.
            </Text>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-[16px] font-bold text-primary transition-colors hover:text-accent"
            >
              Read Our Story
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <Heading level="h4" as="h2" className="mb-8 text-[20px] tracking-[0.5px]">
              Quick Links
            </Heading>
            <ul className="space-y-4" role="list">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-body-sm text-slate-medium transition-colors hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <Heading level="h4" as="h2" className="mb-8 text-[20px] tracking-[0.5px]">
              Contact Us
            </Heading>
            <ul className="space-y-5" role="list">
              <li>
                <a
                  href="mailto:info@surgerycare.in"
                  className="inline-flex items-center gap-3 text-body-sm text-slate-medium transition-colors hover:text-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-surface-subtle bg-white shadow-card">
                    <MailIcon className="size-4 text-slate-light" />
                  </span>
                  info@surgerycare.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919960513453"
                  className="inline-flex items-center gap-3 text-body-sm text-slate-medium transition-colors hover:text-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-surface-subtle bg-white shadow-card">
                    <PhoneIcon className="size-4 text-slate-light" />
                  </span>
                  +91 9960513453
                </a>
              </li>
              <li className="flex items-start gap-3 text-body-sm text-slate-medium">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-surface-subtle bg-white shadow-card">
                  <MapPinIcon className="size-4 text-slate-light" />
                </span>
                <span className="leading-relaxed">
                  1st Floor, Plot No. 06, Katol Road,<br />
                  Falke Layout, Kolbaswami Nagar,<br />
                  Akar Nagar, Nagpur,<br />
                  Maharashtra 440013
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Follow Us + Payment */}
        <div className="mt-12">
          <div className="mb-8">
            <Heading level="h4" as="h3" className="mb-4 text-[20px] tracking-[0.5px]">
              Follow Us
            </Heading>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-surface-border bg-white text-primary shadow-card transition-colors hover:bg-surface-green hover:border-accent/30"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <Text variant="muted" size="label" className="mb-3 tracking-[1.28px]">
              We Accept
            </Text>
            <div className="flex flex-wrap gap-3">
              {PAYMENT_METHODS.map(({ src, alt, width }) => (
                <span
                  key={alt}
                  className="inline-flex h-10 items-center justify-center rounded-[10px] border border-surface-subtle bg-white px-3 opacity-80 shadow-card"
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={24}
                    className="object-contain"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar — copyright right-aligned */}
      <div className="relative border-t border-surface-border">
        <Container className="flex items-center justify-between py-8">
          <Link
            href="/privacy-policy"
            className="text-label uppercase tracking-[1.2px] text-slate-light transition-colors hover:text-accent"
          >
            Privacy Policy
          </Link>
          <Text variant="muted" size="label" className="tracking-[1.2px] uppercase">
            &copy; 2026 Surgery Care Foundation. All Rights Reserved.
          </Text>
        </Container>
      </div>
    </footer>
  );
}
