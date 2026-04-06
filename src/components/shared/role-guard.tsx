"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-surface-border border-t-primary" />
      </div>
    );
  }

  const hasAccess = user?.roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <h1 className="mb-2 text-2xl font-bold text-slate-dark">
          Access Denied
        </h1>
        <p className="mb-6 text-slate-medium">
          You do not have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="rounded-xl bg-primary px-6 py-3 text-btn font-bold text-white transition-colors hover:bg-primary/90"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
