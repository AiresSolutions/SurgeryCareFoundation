"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/types/auth";
import type { IconProps } from "@/components/ui/icons";
import {
  GridIcon,
  ClipboardCheckIcon,
  DollarSignIcon,
  ArrowDownUpIcon,
  ScaleIcon,
  UsersIcon,
  ScrollTextIcon,
  LayoutDashboardIcon,
  BarChart3Icon,
  FileTextIcon,
  ChevronRightIcon,
  LogOutIcon,
} from "@/components/ui/icons";

interface NavItem {
  href: string;
  label: string;
  icon: (props: IconProps) => React.JSX.Element;
}

const MODERATOR_NAV: NavItem[] = [
  { href: "/moderator", label: "Campaign Review", icon: ClipboardCheckIcon },
];

const FINANCE_NAV: NavItem[] = [
  { href: "/finance/donations", label: "Donations", icon: DollarSignIcon },
  { href: "/finance/withdrawals", label: "Withdrawals", icon: ArrowDownUpIcon },
  { href: "/finance/reconciliation", label: "Reconciliation", icon: ScaleIcon },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/campaigns", label: "Campaigns", icon: GridIcon },
  { href: "/admin/donors", label: "Donors", icon: UsersIcon },
  { href: "/admin/audit", label: "Audit Logs", icon: ScrollTextIcon },
  { href: "/admin/content", label: "Content", icon: FileTextIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3Icon },
];

function getNavItems(roles: UserRole[]): { section: string; items: NavItem[] }[] {
  const sections: { section: string; items: NavItem[] }[] = [];

  const isSuperAdmin = roles.includes("super_admin");
  const isModerator = roles.includes("moderator");
  const isFinance = roles.includes("finance_manager");

  if (isSuperAdmin || isModerator) {
    sections.push({ section: "Moderation", items: MODERATOR_NAV });
  }

  if (isSuperAdmin || isFinance) {
    sections.push({ section: "Finance", items: FINANCE_NAV });
  }

  if (isSuperAdmin) {
    sections.push({ section: "Administration", items: ADMIN_NAV });
  }

  return sections;
}

function SidebarSkeleton() {
  return (
    <aside className="w-full rounded-2xl border border-surface-border bg-white p-6 shadow-card lg:w-[310px]">
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-surface-page" />
      <nav aria-label="Admin navigation" className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-11 animate-pulse rounded-xl bg-surface-page"
          />
        ))}
      </nav>
    </aside>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  if (isLoading || !user) {
    return <SidebarSkeleton />;
  }

  const sections = getNavItems(user.roles);

  return (
    <aside className="w-full rounded-2xl border border-surface-border bg-white p-6 shadow-card lg:w-[310px]">
      {sections.map(({ section, items }, sectionIndex) => (
        <div key={section} className={cn(sectionIndex > 0 && "mt-6")}>
          <p className="mb-2 px-4 text-label font-bold uppercase tracking-wider text-slate-medium">
            {section}
          </p>
          <nav aria-label={`${section} navigation`} className="space-y-1">
            {items.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
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
        </div>
      ))}

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
