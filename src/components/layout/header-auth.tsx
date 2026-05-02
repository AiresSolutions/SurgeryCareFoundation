"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { getDefaultAppRoute } from "@/lib/get-default-app-route";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { PhoneIcon, HeartFilledIcon, MenuIcon, CloseIcon, BellIcon } from "@/components/ui/icons";
import { NotificationBell } from "@/components/layout/notification-bell";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/causes", label: "Causes" },
  { href: "/blog", label: "Blog" },
  { href: "/fundraiser/new", label: "Start a Fundraiser" },
  { href: "/contact", label: "Contact us" },
] as const;

function getUserInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? "";
  const last = lastName?.charAt(0)?.toUpperCase() ?? "";
  return first + last || "?";
}

function getUserDisplayName(firstName?: string, lastName?: string): string {
  const name = [firstName, lastName].filter(Boolean).join(" ");
  return name || "Account";
}

export function HeaderAuth() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuth();

  const initials = getUserInitials(user?.firstName, user?.lastName);
  const displayName = getUserDisplayName(user?.firstName, user?.lastName);
  const appHome = getDefaultAppRoute(user?.roles);

  return (
    <header className="sticky top-0 z-50">
      <nav className="border-b border-surface-border/50 bg-white/70 shadow-subtle backdrop-blur-md" aria-label="Main navigation">
        <Container className="flex h-20 items-center justify-between">
          <Logo />

          <ul className="hidden items-center gap-8 lg:flex" role="list">
            {NAV_ITEMS.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href} active={pathname === href}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 lg:flex">
            <a href="tel:+919960513453" className="inline-flex items-center gap-1.5 font-black text-btn text-primary">
              <PhoneIcon className="size-3.5 text-accent" />
              +91 9960513453
            </a>

            <Link href="/causes" className={buttonVariants({ variant: "secondary", size: "default" })}>
              <HeartFilledIcon className="mr-2 size-3.5" />
              Donate
            </Link>

            <NotificationBell />

            <Link href={appHome} className="flex items-center gap-2">
              {isLoading ? (
                <div className="size-10 animate-pulse rounded-full bg-surface-green" />
              ) : (
                <Avatar
                  src={user?.avatarUrl ?? undefined}
                  alt={displayName}
                  initials={initials}
                  size="md"
                />
              )}
              <div>
                <p className="text-caption uppercase text-slate-light">My Account</p>
                <p className="text-btn font-black text-primary">
                  {isLoading ? "Loading\u2026" : displayName}
                </p>
              </div>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate transition-colors hover:bg-surface-green lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </Container>

        <div className={cn(
          "overflow-hidden border-t border-surface-border bg-white transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <Container className="py-4">
            <ul className="flex flex-col gap-1" role="list">
              {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn("block rounded-lg px-4 py-3 text-nav transition-colors", pathname === href ? "bg-surface-green text-accent" : "text-slate hover:bg-surface-page")}
                    onClick={() => setMobileOpen(false)}
                  >{label}</Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-nav text-slate hover:bg-surface-page"
                  onClick={() => setMobileOpen(false)}
                >
                  <BellIcon className="size-4" />
                  Notifications
                </Link>
              </li>
              <li>
                <Link href={appHome} className="block rounded-lg px-4 py-3 text-nav text-slate hover:bg-surface-page" onClick={() => setMobileOpen(false)}>
                  My Account
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      </nav>
    </header>
  );
}
