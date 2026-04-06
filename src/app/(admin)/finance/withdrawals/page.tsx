"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RoleGuard } from "@/components/shared/role-guard";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ClockIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { useApi } from "@/hooks/use-api";
import { financeService } from "@/services/finance.service";
import { formatINR } from "@/lib/format";
import type { PaginatedData } from "@/types/api";
import type { Withdrawal } from "@/services/finance.service";

const FILTERS = ["All", "Requested", "Approved", "Rejected", "Disbursed"] as const;

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "accent" | "success" | "outline" }> = {
  requested: { label: "Requested", variant: "outline" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "default" },
  partially_disbursed: { label: "Partially Disbursed", variant: "accent" },
  fully_disbursed: { label: "Disbursed", variant: "accent" },
  cancelled: { label: "Cancelled", variant: "default" },
};

const FILTER_TO_STATUS: Record<string, string | undefined> = {
  All: undefined,
  Requested: "requested",
  Approved: "approved",
  Rejected: "rejected",
  Disbursed: "fully_disbursed",
};

type ActionType = "approve" | "reject" | "disburse";

interface ActionState {
  withdrawalId: string;
  type: ActionType;
}

export default function FinanceWithdrawalsPage() {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Action modal state
  const [activeAction, setActiveAction] = useState<ActionState | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [disburseAmount, setDisburseAmount] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const statusParam = FILTER_TO_STATUS[activeFilter];
  const params: Record<string, string | number | boolean | undefined> = {
    page,
    limit,
    ...(statusParam ? { status: statusParam } : {}),
  };

  const { data, isLoading, refetch } = useApi<PaginatedData<Withdrawal>>(
    () => financeService.getWithdrawals(params),
    [activeFilter, page],
  );

  const withdrawals = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function handleFilterChange(filter: string) {
    setActiveFilter(filter);
    setPage(1);
  }

  function openAction(withdrawalId: string, type: ActionType, withdrawal: Withdrawal) {
    setActiveAction({ withdrawalId, type });
    setActionNotes("");
    setRejectReason("");
    setDisburseAmount(String(withdrawal.amount));
    setTransactionRef("");
  }

  function closeAction() {
    setActiveAction(null);
    setActionNotes("");
    setRejectReason("");
    setDisburseAmount("");
    setTransactionRef("");
  }

  async function handleApprove() {
    if (!activeAction) return;
    setSubmitting(true);
    try {
      await financeService.approveWithdrawal(activeAction.withdrawalId, {
        notes: actionNotes || undefined,
      });
      toast("Withdrawal approved successfully.", "success");
      closeAction();
      refetch();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to approve withdrawal.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    if (!activeAction) return;
    if (!rejectReason.trim()) {
      toast("Please provide a reason for rejection.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await financeService.rejectWithdrawal(activeAction.withdrawalId, {
        reason: rejectReason.trim(),
        notes: actionNotes || undefined,
      });
      toast("Withdrawal rejected.", "success");
      closeAction();
      refetch();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to reject withdrawal.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDisburse() {
    if (!activeAction) return;
    const parsedAmount = Number(disburseAmount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast("Please enter a valid disbursement amount.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await financeService.disburse(activeAction.withdrawalId, {
        amount: parsedAmount,
        transactionReference: transactionRef || undefined,
        notes: actionNotes || undefined,
      });
      toast("Funds disbursed successfully.", "success");
      closeAction();
      refetch();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to disburse funds.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleActionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeAction) return;
    if (activeAction.type === "approve") handleApprove();
    else if (activeAction.type === "reject") handleReject();
    else if (activeAction.type === "disburse") handleDisburse();
  }

  return (
    <RoleGuard allowedRoles={["finance_manager", "super_admin"]}>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Link
            href="/finance"
            className="text-btn font-bold text-accent transition-colors hover:text-accent-green"
          >
            Finance
          </Link>
          <span className="text-slate-light">/</span>
          <Heading level="h2" as="h1">Withdrawals</Heading>
        </div>
        <Text variant="secondary" className="mb-8">
          Review, approve, reject, and disburse withdrawal requests.
        </Text>

        {/* Filter tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilterChange(filter)}
              className={cn(
                "rounded-full px-4 py-1.5 text-btn font-bold transition-colors",
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-white text-slate border border-surface-border hover:bg-surface-page",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Withdrawals list */}
        <div className="rounded-2xl border border-surface-border bg-white shadow-card">
          <div className="border-b border-surface-border px-6 py-4">
            <Heading level="h4" as="h2">
              {activeFilter === "All" ? "All Withdrawals" : `${activeFilter} Withdrawals`}
              <span className="ml-2 text-body text-slate-light font-normal">
                ({data?.total ?? 0})
              </span>
            </Heading>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Text variant="secondary">Loading withdrawals...</Text>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
                <ClockIcon className="size-7 text-slate-light" />
              </span>
              <Text variant="secondary" className="text-center">
                No {activeFilter === "All" ? "" : activeFilter.toLowerCase() + " "}withdrawals found.
              </Text>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {withdrawals.map((withdrawal) => {
                const cfg = STATUS_CONFIG[withdrawal.status] ?? {
                  label: withdrawal.status,
                  variant: "outline" as const,
                };
                const campaignTitle = withdrawal.campaign?.title ?? "Unknown Campaign";
                const campaignInitials = campaignTitle.slice(0, 2).toUpperCase();
                const requestedByName = withdrawal.requestedBy
                  ? `${withdrawal.requestedBy.firstName} ${withdrawal.requestedBy.lastName}`
                  : "Unknown";

                const isExpanded =
                  activeAction?.withdrawalId === withdrawal.id;

                return (
                  <div key={withdrawal.id} className="px-6 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Left: campaign info */}
                      <div className="flex items-center gap-4">
                        <Avatar initials={campaignInitials} size="md" />
                        <div>
                          <p className="text-btn font-black text-primary">
                            {campaignTitle}
                          </p>
                          <Text
                            variant="muted"
                            size="label"
                            className="normal-case tracking-normal"
                          >
                            Requested by {requestedByName}
                          </Text>
                          <Text
                            variant="muted"
                            size="label"
                            className="normal-case tracking-normal"
                          >
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>

                      {/* Right: amount, status, actions */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Badge variant={cfg.variant} className="text-[10px]">
                          {cfg.label}
                        </Badge>
                        <p className="text-btn font-black text-accent">
                          &#8377; {formatINR(withdrawal.amount)}
                        </p>

                        {/* Action buttons */}
                        {withdrawal.status === "requested" && (
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => openAction(withdrawal.id, "approve", withdrawal)}
                              disabled={isExpanded}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => openAction(withdrawal.id, "reject", withdrawal)}
                              disabled={isExpanded}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {withdrawal.status === "approved" && (
                          <Button
                            variant="secondary"
                            onClick={() => openAction(withdrawal.id, "disburse", withdrawal)}
                            disabled={isExpanded}
                          >
                            Disburse
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Inline action form */}
                    {isExpanded && activeAction && (
                      <form
                        onSubmit={handleActionSubmit}
                        className="mt-4 rounded-xl border border-surface-border bg-surface-page p-4"
                      >
                        <Heading level="h4" as="h3" className="mb-3">
                          {activeAction.type === "approve" && "Approve Withdrawal"}
                          {activeAction.type === "reject" && "Reject Withdrawal"}
                          {activeAction.type === "disburse" && "Disburse Funds"}
                        </Heading>

                        <div className="space-y-3">
                          {activeAction.type === "reject" && (
                            <Textarea
                              label="Reason for Rejection *"
                              placeholder="Provide a reason for rejecting this withdrawal..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              className="min-h-[80px]"
                            />
                          )}

                          {activeAction.type === "disburse" && (
                            <>
                              <Input
                                label="Disbursement Amount"
                                type="number"
                                placeholder="Enter amount to disburse"
                                min={1}
                                step="any"
                                value={disburseAmount}
                                onChange={(e) => setDisburseAmount(e.target.value)}
                              />
                              <Input
                                label="Transaction Reference (optional)"
                                placeholder="e.g. bank transaction ID"
                                value={transactionRef}
                                onChange={(e) => setTransactionRef(e.target.value)}
                              />
                            </>
                          )}

                          <Textarea
                            label={`Notes${activeAction.type === "reject" ? " (optional)" : " (optional)"}`}
                            placeholder="Add any additional notes..."
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                            className="min-h-[60px]"
                          />

                          <div className="flex gap-3 pt-2">
                            <Button
                              type="submit"
                              variant="secondary"
                              disabled={submitting}
                            >
                              {submitting
                                ? "Processing..."
                                : activeAction.type === "approve"
                                  ? "Confirm Approval"
                                  : activeAction.type === "reject"
                                    ? "Confirm Rejection"
                                    : "Confirm Disbursement"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={closeAction}
                              disabled={submitting}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Show review note or reason if present */}
                    {withdrawal.reviewNote && !isExpanded && (
                      <div className="mt-2">
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          Note: {withdrawal.reviewNote}
                        </Text>
                      </div>
                    )}
                    {withdrawal.reason && withdrawal.status === "rejected" && !isExpanded && (
                      <div className="mt-2">
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          Rejection reason: {withdrawal.reason}
                        </Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
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
