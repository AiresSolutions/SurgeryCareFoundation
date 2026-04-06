"use client";

import { useState, useEffect, useCallback } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { FormSection } from "@/components/ui/form-section";
import { useToast } from "@/components/ui/toast";
import { useApi } from "@/hooks/use-api";
import { campaignService } from "@/services/campaign.service";
import { withdrawalService } from "@/services/withdrawal.service";
import type { CampaignBalance } from "@/services/withdrawal.service";
import { formatINR } from "@/lib/format";
import type { PaginatedData } from "@/types/api";
import type { Campaign } from "@/types/campaign";
import type { Withdrawal } from "@/services/withdrawal.service";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "accent" | "success" | "outline" }
> = {
  requested: { label: "Requested", variant: "outline" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "default" },
  partially_disbursed: { label: "Partially Disbursed", variant: "accent" },
  fully_disbursed: { label: "Disbursed", variant: "accent" },
  cancelled: { label: "Cancelled", variant: "default" },
};

export default function WithdrawalsPage() {
  const { toast } = useToast();

  // Fetch user's campaigns
  const { data: campaignsData, isLoading: campaignsLoading } = useApi<PaginatedData<Campaign>>(
    () => campaignService.getMyCampaigns(),
    [],
  );

  // Fetch withdrawals
  const {
    data: withdrawalsData,
    isLoading: withdrawalsLoading,
    refetch: refetchWithdrawals,
  } = useApi<PaginatedData<Withdrawal>>(
    () => withdrawalService.getMyWithdrawals(),
    [],
  );

  const campaigns = campaignsData?.items ?? [];
  const withdrawals = withdrawalsData?.items ?? [];

  // Form state
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Balance state
  const [balance, setBalance] = useState<CampaignBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const fetchBalance = useCallback(async (campaignId: string) => {
    if (!campaignId) {
      setBalance(null);
      return;
    }
    setBalanceLoading(true);
    try {
      const data = await withdrawalService.getCampaignBalance(campaignId);
      setBalance(data);
    } catch {
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance(selectedCampaignId);
  }, [selectedCampaignId, fetchBalance]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedCampaignId) {
      toast("Please select a campaign.", "error");
      return;
    }

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast("Please enter a valid amount.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await withdrawalService.requestWithdrawal({
        campaignId: selectedCampaignId,
        amount: parsedAmount,
        reason: reason || undefined,
      });
      toast("Withdrawal request submitted successfully!", "success");
      setAmount("");
      setReason("");
      refetchWithdrawals();
      fetchBalance(selectedCampaignId);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to submit withdrawal request.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Heading level="h2" as="h1" className="mb-2">
        Withdrawals
      </Heading>
      <Text variant="secondary" className="mb-8">
        Request fund withdrawals from your campaigns and track their status.
      </Text>

      {/* Balance summary */}
      {selectedCampaignId && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
            <Text variant="muted" size="label" className="mb-1">
              Available Balance
            </Text>
            <p className="text-h4 text-accent">
              {balanceLoading
                ? "\u2014"
                : <>&#8377; {formatINR(balance?.availableBalance ?? 0)}</>}
            </p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
            <Text variant="muted" size="label" className="mb-1">
              Total Raised
            </Text>
            <p className="text-h4 text-primary">
              {balanceLoading
                ? "\u2014"
                : <>&#8377; {formatINR(balance?.totalRaised ?? 0)}</>}
            </p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
            <Text variant="muted" size="label" className="mb-1">
              Total Withdrawn
            </Text>
            <p className="text-h4 text-primary">
              {balanceLoading
                ? "\u2014"
                : <>&#8377; {formatINR(balance?.totalWithdrawn ?? 0)}</>}
            </p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
            <Text variant="muted" size="label" className="mb-1">
              Pending Withdrawals
            </Text>
            <p className="text-h4 text-primary">
              {balanceLoading
                ? "\u2014"
                : <>&#8377; {formatINR(balance?.pendingWithdrawals ?? 0)}</>}
            </p>
          </div>
        </div>
      )}

      {/* Withdrawal request form */}
      <FormSection icon="\uD83D\uDCB3" title="Request Withdrawal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="campaign-select"
              className="text-[14px] font-bold uppercase leading-[20px] tracking-[0.35px] text-[#314158]"
            >
              Campaign
            </label>
            <select
              id="campaign-select"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              disabled={campaignsLoading}
              className="w-full rounded-[14px] border border-surface-border bg-surface-bg px-4 py-[14px] text-body text-slate transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {campaignsLoading ? "Loading campaigns..." : "Select a campaign"}
              </option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Amount"
            type="number"
            placeholder="Enter withdrawal amount"
            min={1}
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Textarea
            label="Reason (optional)"
            placeholder="Describe the purpose of this withdrawal..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="pt-2">
            <Button type="submit" variant="secondary" disabled={submitting || !selectedCampaignId}>
              {submitting ? "Submitting..." : "Request Withdrawal"}
            </Button>
          </div>
        </form>
      </FormSection>

      {/* Withdrawal history */}
      <div className="rounded-2xl border border-surface-border bg-white shadow-card">
        <div className="border-b border-surface-border px-6 py-4">
          <Heading level="h4" as="h2">
            Withdrawal History
            <span className="ml-2 text-body text-slate-light font-normal">
              ({withdrawals.length})
            </span>
          </Heading>
        </div>

        {withdrawalsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Text variant="secondary">Loading withdrawals...</Text>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
              <Text variant="secondary" className="text-xl">
                {"\uD83D\uDCB3"}
              </Text>
            </span>
            <Text variant="secondary" className="text-center">
              No withdrawal requests yet. Use the form above to request your first withdrawal.
            </Text>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {withdrawals.map((withdrawal) => {
              const cfg = STATUS_CONFIG[withdrawal.status] ?? {
                label: withdrawal.status,
                variant: "outline" as const,
              };
              const campaignTitle =
                withdrawal.campaign?.title ?? "Unknown Campaign";
              const campaignInitials = campaignTitle.slice(0, 2).toUpperCase();

              return (
                <div
                  key={withdrawal.id}
                  className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
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
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </Text>
                      {withdrawal.reason && (
                        <Text
                          variant="muted"
                          size="label"
                          className="mt-1 normal-case tracking-normal"
                        >
                          {withdrawal.reason}
                        </Text>
                      )}
                    </div>
                  </div>

                  {/* Right: amount + status */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <Badge variant={cfg.variant} className="text-[10px]">
                      {cfg.label}
                    </Badge>
                    <div className="text-right">
                      <p className="text-btn font-black text-accent">
                        &#8377; {formatINR(withdrawal.amount)}
                      </p>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal"
                      >
                        {withdrawal.currency}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
