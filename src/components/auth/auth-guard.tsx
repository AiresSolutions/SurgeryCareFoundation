"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    const redirect = encodeURIComponent(pathname || "/");
    router.replace(`/login?redirect=${redirect}`);
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
