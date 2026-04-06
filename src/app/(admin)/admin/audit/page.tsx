"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ClockIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { adminService } from "@/services/admin.service";
import type { AuditLog } from "@/services/admin.service";
import type { PaginatedData } from "@/types/api";

function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="flex items-center justify-center">
          <Text variant="secondary">Loading...</Text>
        </div>
      </Container>
    );
  }

  if (!user || !user.roles.some((r) => allowedRoles.includes(r))) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Heading level="h3">Access Denied</Heading>
          <Text variant="secondary">
            You do not have permission to view this page.
          </Text>
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            Go Home
          </Link>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}

const ACTION_BADGE_VARIANT: Record<
  string,
  "default" | "accent" | "success" | "outline"
> = {
  create: "success",
  update: "accent",
  delete: "default",
  login: "outline",
  logout: "outline",
  approve: "success",
  reject: "default",
  suspend: "default",
  activate: "success",
};

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);
  const limit = 25;

  const { data, isLoading } = useApi<PaginatedData<AuditLog>>(
    () => adminService.listAuditLogs({ page, limit }),
    [page],
  );

  const logs = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function getActionVariant(
    action: string,
  ): "default" | "accent" | "success" | "outline" {
    const lower = action.toLowerCase();
    for (const [key, variant] of Object.entries(ACTION_BADGE_VARIANT)) {
      if (lower.includes(key)) return variant;
    }
    return "outline";
  }

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Audit Logs
          </Heading>
          <Text variant="secondary">
            View a chronological log of all admin and system actions.
          </Text>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">
              Activity Log
              <span className="ml-2 text-body text-slate-light font-normal">
                ({data?.total ?? 0})
              </span>
            </Heading>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Text variant="secondary">Loading audit logs...</Text>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
                <ClockIcon className="size-7 text-slate-light" />
              </span>
              <Text variant="secondary" className="text-center">
                No audit logs found.
              </Text>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden border-b border-surface-border bg-surface-bg px-6 py-3 xl:grid xl:grid-cols-6 xl:gap-4">
                <Text variant="muted" size="label">
                  Actor
                </Text>
                <Text variant="muted" size="label">
                  Action
                </Text>
                <Text variant="muted" size="label">
                  Entity
                </Text>
                <Text variant="muted" size="label">
                  Entity ID
                </Text>
                <Text variant="muted" size="label">
                  IP Address
                </Text>
                <Text variant="muted" size="label" className="text-right">
                  Timestamp
                </Text>
              </div>

              {/* Rows */}
              <div className="divide-y divide-surface-border">
                {logs.map((log) => {
                  const actorName = log.actorName
                    || (log.actor
                      ? `${log.actor.firstName} ${log.actor.lastName}`
                      : log.actorId);
                  const actorEmail = log.actor?.email ?? "";

                  return (
                    <div
                      key={log.id}
                      className="grid items-center gap-2 px-6 py-4 xl:grid-cols-6 xl:gap-4"
                    >
                      <div>
                        <p className="text-btn font-black text-primary truncate">
                          {actorName}
                        </p>
                        {actorEmail && (
                          <Text
                            variant="muted"
                            size="label"
                            className="normal-case tracking-normal truncate"
                          >
                            {actorEmail}
                          </Text>
                        )}
                      </div>
                      <div>
                        <Badge
                          variant={getActionVariant(log.action)}
                          className="text-[10px]"
                        >
                          {log.action}
                        </Badge>
                      </div>
                      <Text variant="secondary" className="capitalize">
                        {log.entityType}
                      </Text>
                      <Text
                        variant="muted"
                        className="truncate font-mono text-[13px]"
                      >
                        {log.entityId}
                      </Text>
                      <Text variant="muted" className="truncate">
                        {log.ipAddress ?? "\u2014"}
                      </Text>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal text-right"
                      >
                        {new Date(log.createdAt).toLocaleString()}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-surface-border px-6 py-4">
              <Text variant="muted" size="label" className="normal-case tracking-normal">
                Page {page} of {totalPages}
              </Text>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
