import type { UserRole } from "@/types/auth";

export function getDefaultAppRoute(roles: UserRole[] | string[] | undefined): string {
  if (!roles || roles.length === 0) {
    return "/dashboard";
  }

  if (roles.includes("super_admin") || roles.includes("moderator")) {
    return "/moderator";
  }

  if (roles.includes("finance_manager")) {
    return "/finance";
  }

  return "/dashboard";
}
