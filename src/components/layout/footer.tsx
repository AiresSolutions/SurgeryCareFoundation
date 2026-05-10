import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { MailIcon, PhoneIcon, MapPinIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/ui/icons";

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/causes", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact us" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/donation-policy", label: "Donation Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/aml-policy", label: "AML Policy" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/share/18iDggNjyh/",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/surgerycarefoundation",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@surgerycarefoundation",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
] as const;

const COMPLIANCE_BADGES = [
  { label: "80G", sub: "Donor Tax Benefit" },
  { label: "12A", sub: "Income Tax Exempt" },
  { label: "Section 8", sub: "Registered NGO" },
  { label: "NGO Darpan", sub: "Govt of India" },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-surface-border bg-surface-bg">
      {/* Gradient line */}
      <div className="h-1 bg-footer-line" />

      {/* Green blur decoration — bottom right */}
      <div className="pointer-events-none absolute -bottom-20 right-0 h-[433px] w-[624px] rounded-full bg-[rgba(208,250,229,0.5)] blur-[120px]" />

      <Container className="relative py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
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
              At Surgery Care Foundation, we provide every donation
              transparently to support life-saving treatment with compassion
              and trust.
            </Text>

            <div className="mb-6 flex flex-wrap gap-x-3 gap-y-2">
              {["Registered NGO", "12A", "80G"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3 py-1 text-caption font-bold uppercase tracking-[1px] text-accent"
                >
                  <ShieldCheckIcon className="size-3.5" />
                  {label}
                </span>
              ))}
            </div>

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
            <Heading level="h4" as="h2" className="mb-4 text-[20px] tracking-[0.5px] md:mb-8">
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
            <Heading level="h4" as="h2" className="mb-4 text-[20px] tracking-[0.5px] md:mb-8">
              Contact Us
            </Heading>
            <ul className="space-y-5" role="list">
              <li>
                <a
                  href="mailto:info@surgerycarefoundation.com"
                  className="inline-flex items-center gap-3 text-body-sm text-slate-medium transition-colors hover:text-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-surface-subtle bg-white shadow-card">
                    <MailIcon className="size-4 text-slate-light" />
                  </span>
                  info@surgerycarefoundation.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918815935091"
                  className="inline-flex items-center gap-3 text-body-sm text-slate-medium transition-colors hover:text-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-surface-subtle bg-white shadow-card">
                    <PhoneIcon className="size-4 text-slate-light" />
                  </span>
                  +91 8815935091
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
        <div className="mt-8 md:mt-12">
          <div className="mb-4 md:mb-8">
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
                  className="inline-flex size-10 items-center justify-center rounded-full border border-surface-border bg-white text-primary shadow-card transition-colors hover:bg-surface-green hover:border-accent/30 md:size-11"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <Text variant="muted" size="label" className="mb-3 tracking-[1.28px]">
              Registrations & Compliance
            </Text>
            <div className="flex flex-wrap gap-3">
              {COMPLIANCE_BADGES.map(({ label, sub }) => (
                <span
                  key={label}
                  className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-surface-subtle bg-white px-3 shadow-card"
                >
                  <ShieldCheckIcon className="size-4 text-accent" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[13px] font-bold text-primary">{label}</span>
                    <span className="text-[10px] uppercase tracking-[0.5px] text-slate-light">
                      {sub}
                    </span>
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar — legal links + copyright */}
      <div className="relative border-t border-surface-border">
        <Container className="flex flex-col items-center justify-between gap-4 py-5 md:flex-row md:py-8">
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-label uppercase tracking-[1.2px] text-slate-light transition-colors hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
          <Text variant="muted" size="label" className="tracking-[1.2px] uppercase">
            &copy; 2025 Surgery Care Foundation. All Rights Reserved.
          </Text>
        </Container>
      </div>
    </footer>
  );
}
