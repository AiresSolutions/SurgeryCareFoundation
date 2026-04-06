"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import type { UserRole } from "@/types/auth";
import {
  GridIcon,
  ClockIcon,
  PlusIcon,
  BookmarkIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronRightIcon,
  BellIcon,
  HeartIcon,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: GridIcon },
  { href: "/dashboard/donations", label: "Donation History", icon: ClockIcon },
  { href: "/dashboard/fundraisers", label: "My Fundraisers", icon: PlusIcon },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: HeartIcon },
  { href: "/dashboard/notifications", label: "Notifications", icon: BellIcon },
  { href: "/dashboard/saved", label: "Saved Causes", icon: BookmarkIcon },
  { href: "/dashboard/account", label: "Account & Profile", icon: SettingsIcon },
] as const;

const ROLE_LABELS: Record<UserRole, string> = {
  visitor: "Visitor",
  donor: "Donor",
  campaign_creator: "Campaign Creator",
  moderator: "Moderator",
  finance_manager: "Finance Manager",
  super_admin: "Super Admin",
};

function getDisplayRole(roles: UserRole[]): string {
  if (!roles || roles.length === 0) return "Member";
  // Pick the highest-privilege role (last in the priority order)
  const priority: UserRole[] = [
    "visitor",
    "donor",
    "campaign_creator",
    "moderator",
    "finance_manager",
    "super_admin",
  ];
  const sorted = [...roles].sort(
    (a, b) => priority.indexOf(a) - priority.indexOf(b)
  );
  const primary = sorted[sorted.length - 1];
  return ROLE_LABELS[primary] ?? "Member";
}

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.[0]?.toUpperCase() ?? "";
  const last = lastName?.[0]?.toUpperCase() ?? "";
  return first + last || "?";
}

function SidebarSkeleton() {
  return (
    <aside className="w-full rounded-2xl border border-surface-border bg-white p-6 shadow-card lg:w-[310px]">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 size-20 animate-pulse rounded-full bg-surface-page" />
        <div className="mb-2 h-5 w-28 animate-pulse rounded bg-surface-page" />
        <div className="mb-1 h-4 w-24 animate-pulse rounded bg-surface-page" />
        <div className="h-4 w-20 animate-pulse rounded bg-surface-page" />
      </div>
      <nav aria-label="Dashboard navigation" className="space-y-1">
        {NAV_ITEMS.map(({ href }) => (
          <div
            key={href}
            className="h-11 animate-pulse rounded-xl bg-surface-page"
          />
        ))}
      </nav>
    </aside>
  );
}

export function ProfileSidebar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  if (isLoading || !user) {
    return <SidebarSkeleton />;
  }

  const initials = getInitials(user.firstName, user.lastName);
  const fullName = `${user.firstName} ${user.lastName}`.trim() || "User";
  const displayRole = getDisplayRole(user.roles);

  return (
    <aside className="w-full rounded-2xl border border-surface-border bg-white p-6 shadow-card lg:w-[310px]">
      {/* User info */}
      <div className="mb-6 flex flex-col items-center text-center">
        <Avatar
          src={user.avatarUrl ?? undefined}
          alt={fullName}
          initials={initials}
          size="lg"
          className="mb-3"
        />
        <p className="text-btn-lg font-black text-primary">{fullName}</p>
        <div className="mb-1 flex items-center gap-1">
          <span className="size-2 rounded-full bg-accent" />
          <Text
            as="span"
            variant="muted"
            size="label"
            className="normal-case tracking-normal text-accent"
          >
            {displayRole}
          </Text>
        </div>
        <Text
          variant="muted"
          size="label"
          className="normal-case tracking-normal"
        >
          {user.createdAt
            ? `Joined ${new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
            : ""}
        </Text>
      </div>

      {/* Nav */}
      <nav aria-label="Dashboard navigation" className="space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-btn font-bold transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-medium hover:bg-surface-page"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" />
              {label}
              {isActive && <ChevronRightIcon className="ml-auto size-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Divider + Sign out */}
      <div className="mt-4 border-t border-surface-border pt-4">
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-btn font-bold text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOutIcon className="size-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
