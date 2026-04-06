"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { UsersIcon, ClockIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { adminService } from "@/services/admin.service";
import type { AdminDonor } from "@/services/admin.service";
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

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "success" | "outline" | "default" | "accent" }
> = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "default" },
  pending: { label: "Pending", variant: "outline" },
  deactivated: { label: "Deactivated", variant: "default" },
};

export default function AdminDonorsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useApi<PaginatedData<AdminDonor>>(
    () =>
      adminService.listDonors({
        page,
        limit,
        search: search || undefined,
      }),
    [page, search],
  );

  const donors = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Donor Management
          </Heading>
          <Text variant="secondary">
            View and manage all donors on the platform.
          </Text>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<UsersIcon className="size-4" />}
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">
              All Donors
              <span className="ml-2 text-body text-slate-light font-normal">
                ({data?.total ?? 0})
              </span>
            </Heading>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Text variant="secondary">Loading donors...</Text>
            </div>
          ) : donors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
                <ClockIcon className="size-7 text-slate-light" />
              </span>
              <Text variant="secondary" className="text-center">
                {search
                  ? `No donors found matching "${search}".`
                  : "No donors found."}
              </Text>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden border-b border-surface-border bg-surface-bg px-6 py-3 sm:grid sm:grid-cols-5 sm:gap-4">
                <Text variant="muted" size="label">
                  Name
                </Text>
                <Text variant="muted" size="label">
                  Email
                </Text>
                <Text variant="muted" size="label" className="text-center">
                  Donations
                </Text>
                <Text variant="muted" size="label" className="text-center">
                  Status
                </Text>
                <Text variant="muted" size="label" className="text-right">
                  Joined
                </Text>
              </div>

              {/* Rows */}
              <div className="divide-y divide-surface-border">
                {donors.map((donor) => {
                  const cfg = STATUS_CONFIG[donor.accountStatus] ?? {
                    label: donor.accountStatus,
                    variant: "outline" as const,
                  };
                  return (
                    <div
                      key={donor.id}
                      className="grid items-center gap-2 px-6 py-4 sm:grid-cols-5 sm:gap-4"
                    >
                      <p className="text-btn font-black text-primary">
                        {donor.firstName} {donor.lastName}
                      </p>
                      <Text variant="secondary" className="truncate">
                        {donor.email}
                      </Text>
                      <Text
                        variant="secondary"
                        className="text-center sm:text-center"
                      >
                        {donor.donationCount ?? donor._count?.donations ?? 0}
                      </Text>
                      <div className="flex justify-center">
                        <Badge variant={cfg.variant} className="text-[10px]">
                          {cfg.label}
                        </Badge>
                      </div>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal text-right"
                      >
                        {new Date(donor.createdAt).toLocaleDateString()}
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
