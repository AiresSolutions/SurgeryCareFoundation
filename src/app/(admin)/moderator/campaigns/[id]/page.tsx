"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { RoleGuard } from "@/components/shared/role-guard";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { moderationService } from "@/services/moderation.service";
import { formatINR } from "@/lib/format";
import type { Campaign, CampaignDocument } from "@/types/campaign";

type ActionType = "approve" | "reject" | "request_changes" | null;

const DOC_STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "accent" | "success" | "outline" }
> = {
  pending: { label: "Pending", variant: "outline" },
  verified: { label: "Verified", variant: "success" },
  rejected: { label: "Rejected", variant: "default" },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "accent" | "success" | "outline" }
> = {
  submitted: { label: "Submitted", variant: "outline" },
  under_review: { label: "Under Review", variant: "accent" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "default" },
  draft: { label: "Draft", variant: "outline" },
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "outline" },
  completed: { label: "Completed", variant: "accent" },
  closed: { label: "Closed", variant: "default" },
};

const URGENCY_CONFIG: Record<
  string,
  { label: string; variant: "default" | "accent" | "success" | "outline" }
> = {
  critical: { label: "Critical", variant: "default" },
  high: { label: "High", variant: "accent" },
  medium: { label: "Medium", variant: "outline" },
  low: { label: "Low", variant: "success" },
};

export default function CampaignReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const campaignId = params.id;

  const {
    data: campaign,
    error: fetchError,
    isLoading,
    refetch: refetchCampaign,
  } = useApi<Campaign>(
    () => moderationService.getCampaignForReview(campaignId),
    [campaignId],
  );

  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [busyDocId, setBusyDocId] = useState<string | null>(null);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);

  async function handleVerifyDocument(doc: CampaignDocument) {
    setBusyDocId(doc.id);
    try {
      await moderationService.verifyDocument(doc.id);
      toast(`"${doc.fileName}" verified`, "success");
      await refetchCampaign();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to verify document", "error");
    } finally {
      setBusyDocId(null);
    }
  }

  async function handleRejectDocument(doc: CampaignDocument) {
    const reasonInput = window.prompt(`Reason for rejecting "${doc.fileName}":`);
    if (!reasonInput || !reasonInput.trim()) return;
    setBusyDocId(doc.id);
    try {
      await moderationService.rejectDocument(doc.id, { reason: reasonInput.trim() });
      toast(`"${doc.fileName}" rejected`, "success");
      await refetchCampaign();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to reject document", "error");
    } finally {
      setBusyDocId(null);
    }
  }

  async function handleVerifyAllDocuments() {
    setIsVerifyingAll(true);
    try {
      const result = await moderationService.verifyAllDocuments(campaignId);
      toast(
        result.verifiedCount > 0
          ? `Verified ${result.verifiedCount} document(s)`
          : "No pending documents to verify",
        "success",
      );
      await refetchCampaign();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to verify documents", "error");
    } finally {
      setIsVerifyingAll(false);
    }
  }

  function openAction(action: ActionType) {
    setActiveAction(action);
    setReason("");
    setNotes("");
    setValidationError(null);
  }

  function closeAction() {
    setActiveAction(null);
    setReason("");
    setNotes("");
    setValidationError(null);
  }

  async function handleSubmitAction() {
    if (!campaign) return;

    // Validate reason for reject and request_changes
    if ((activeAction === "reject" || activeAction === "request_changes") && !reason.trim()) {
      setValidationError("Reason is required.");
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    try {
      if (activeAction === "approve") {
        await moderationService.approveCampaign(campaignId, {
          notes: notes.trim() || undefined,
        });
        toast("Campaign approved successfully", "success");
      } else if (activeAction === "reject") {
        await moderationService.rejectCampaign(campaignId, {
          reason: reason.trim(),
          notes: notes.trim() || undefined,
        });
        toast("Campaign rejected", "success");
      } else if (activeAction === "request_changes") {
        await moderationService.requestChanges(campaignId, {
          reason: reason.trim(),
          notes: notes.trim() || undefined,
        });
        toast("Changes requested successfully", "success");
      }

      router.push("/moderator");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RoleGuard allowedRoles={["moderator", "super_admin"]}>
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-surface-border border-t-accent" />
            <Text variant="secondary">Loading campaign details...</Text>
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && (fetchError || !campaign) && (
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <Heading level="h3" as="h1" className="mb-2 text-red-800">
            Campaign Not Found
          </Heading>
          <Text className="mb-6 text-red-600">
            {fetchError ?? "The campaign you are looking for does not exist or could not be loaded."}
          </Text>
          <Link
            href="/moderator"
            className="inline-flex items-center gap-2 text-btn font-bold text-accent hover:underline"
          >
            &larr; Back to Moderation Queue
          </Link>
        </div>
      )}

      {/* Campaign details */}
      {!isLoading && !fetchError && campaign && (
        <div>
          {/* Back link */}
          <Link
            href="/moderator"
            className="mb-6 inline-flex items-center gap-2 text-btn font-bold text-accent hover:underline"
          >
            &larr; Back to Moderation Queue
          </Link>

          {/* Page header */}
          <div className="mb-8">
            <Heading level="h2" as="h1" className="mb-2">
              Campaign Review
            </Heading>
            <Text variant="secondary">
              Review the campaign details below and take an appropriate action.
            </Text>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - campaign details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign info card */}
              <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  {(() => {
                    const statusCfg = STATUS_CONFIG[campaign.status] ?? {
                      label: campaign.status,
                      variant: "outline" as const,
                    };
                    return (
                      <Badge variant={statusCfg.variant} className="text-[10px]">
                        {statusCfg.label}
                      </Badge>
                    );
                  })()}
                  {(() => {
                    const urgencyCfg = URGENCY_CONFIG[campaign.urgencyLevel] ?? {
                      label: campaign.urgencyLevel,
                      variant: "outline" as const,
                    };
                    return (
                      <Badge variant={urgencyCfg.variant} className="text-[10px]">
                        {urgencyCfg.label} Urgency
                      </Badge>
                    );
                  })()}
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {campaign.category}
                  </Badge>
                </div>

                <Heading level="h3" as="h2" className="mb-4 text-accent">
                  {campaign.title}
                </Heading>

                {campaign.summary && (
                  <Text className="mb-4">{campaign.summary}</Text>
                )}

                {campaign.description && (
                  <div className="mb-4">
                    <Text variant="muted" size="label" className="mb-2">
                      Description
                    </Text>
                    <Text variant="secondary">{campaign.description}</Text>
                  </div>
                )}

                <div className="grid gap-4 border-t border-surface-border pt-4 sm:grid-cols-2">
                  <div>
                    <Text variant="muted" size="label" className="mb-1">
                      Goal Amount
                    </Text>
                    <p className="text-btn font-black text-primary">
                      &#8377; {formatINR(campaign.goalAmount)}
                    </p>
                  </div>
                  <div>
                    <Text variant="muted" size="label" className="mb-1">
                      Raised So Far
                    </Text>
                    <p className="text-btn font-black text-accent">
                      &#8377; {formatINR(campaign.raisedAmount)}
                    </p>
                  </div>
                  <div>
                    <Text variant="muted" size="label" className="mb-1">
                      Created
                    </Text>
                    <Text variant="secondary">
                      {new Date(campaign.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </div>
                  {campaign.startDate && (
                    <div>
                      <Text variant="muted" size="label" className="mb-1">
                        Start Date
                      </Text>
                      <Text variant="secondary">
                        {new Date(campaign.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </div>
                  )}
                  {campaign.endDate && (
                    <div>
                      <Text variant="muted" size="label" className="mb-1">
                        End Date
                      </Text>
                      <Text variant="secondary">
                        {new Date(campaign.endDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              {/* Creator info card */}
              <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
                <Heading level="h4" as="h3" className="mb-4">
                  Creator Information
                </Heading>
                {campaign.creator ? (
                  <div className="flex items-center gap-4">
                    <Avatar
                      initials={
                        (campaign.creator.firstName[0] + campaign.creator.lastName[0]).toUpperCase()
                      }
                      size="md"
                    />
                    <div>
                      <p className="text-btn font-black text-primary">
                        {campaign.creator.firstName} {campaign.creator.lastName}
                      </p>
                      <Text variant="muted" size="label" className="normal-case tracking-normal">
                        Creator ID: {campaign.creator.id}
                      </Text>
                    </div>
                  </div>
                ) : (
                  <Text variant="secondary">Creator information unavailable.</Text>
                )}
              </div>

              {/* Documents card */}
              {(() => {
                const docs = campaign.documents ?? [];
                const pendingCount = docs.filter((d) => d.verificationStatus === "pending").length;
                return (
                  <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <Heading level="h4" as="h3">Documents</Heading>
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          {docs.length === 0
                            ? "No documents uploaded"
                            : `${docs.length} total · ${pendingCount} pending review`}
                        </Text>
                      </div>
                      {pendingCount > 0 && (
                        <button
                          type="button"
                          onClick={handleVerifyAllDocuments}
                          disabled={isVerifyingAll || busyDocId !== null}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-btn font-bold text-white transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50"
                        >
                          {isVerifyingAll ? "Verifying..." : `Verify All (${pendingCount})`}
                        </button>
                      )}
                    </div>

                    {docs.length === 0 ? (
                      <Text variant="secondary">
                        The creator hasn&apos;t uploaded any patient images or medical documents yet.
                      </Text>
                    ) : (
                      <ul className="divide-y divide-surface-border">
                        {docs.map((doc) => {
                          const statusKey = doc.verificationStatus.toLowerCase();
                          const statusCfg = DOC_STATUS_CONFIG[statusKey] ?? {
                            label: doc.verificationStatus,
                            variant: "outline" as const,
                          };
                          const isPending = statusKey === "pending";
                          const isBusy = busyDocId === doc.id;
                          const isImage = doc.mimeType?.startsWith("image/");
                          const isVideo = doc.mimeType?.startsWith("video/");
                          return (
                            <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                {isImage && doc.downloadUrl ? (
                                  <a
                                    href={doc.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block size-20 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-surface-page"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={doc.downloadUrl}
                                      alt={doc.fileName}
                                      className="size-full object-cover"
                                      loading="lazy"
                                    />
                                  </a>
                                ) : isVideo && doc.downloadUrl ? (
                                  <video
                                    src={doc.downloadUrl}
                                    controls
                                    preload="metadata"
                                    className="block h-20 w-32 shrink-0 rounded-lg border border-surface-border bg-black"
                                  />
                                ) : (
                                  <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-surface-page text-2xl">
                                    📄
                                  </div>
                                )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-btn font-bold text-primary">
                                    {doc.fileName}
                                  </p>
                                  <Badge variant={statusCfg.variant} className="text-[10px]">
                                    {statusCfg.label}
                                  </Badge>
                                </div>
                                <Text variant="muted" size="label" className="normal-case tracking-normal">
                                  {doc.fileType} · {(doc.fileSize / 1024).toFixed(0)} KB
                                </Text>
                              </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.downloadUrl && (
                                  <a
                                    href={doc.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-surface-border px-3 py-1.5 text-btn font-bold text-slate-medium transition-colors hover:border-accent hover:text-accent"
                                  >
                                    View
                                  </a>
                                )}
                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleVerifyDocument(doc)}
                                      disabled={isBusy || isVerifyingAll}
                                      className="rounded-full bg-emerald-600 px-3 py-1.5 text-btn font-bold text-white transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                      {isBusy ? "..." : "Verify"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectDocument(doc)}
                                      disabled={isBusy || isVerifyingAll}
                                      className="rounded-full bg-red-600 px-3 py-1.5 text-btn font-bold text-white transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Right column - actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 rounded-2xl border border-surface-border bg-white p-6 shadow-card">
                <Heading level="h4" as="h3" className="mb-4">
                  Moderation Actions
                </Heading>

                {activeAction === null ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => openAction("approve")}
                      className="w-full rounded-full bg-emerald-600 px-6 py-2.5 text-btn font-bold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                      Approve Campaign
                    </button>
                    <button
                      type="button"
                      onClick={() => openAction("request_changes")}
                      className="w-full rounded-full bg-amber-500 px-6 py-2.5 text-btn font-bold text-white transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                    >
                      Request Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => openAction("reject")}
                      className="w-full rounded-full bg-red-600 px-6 py-2.5 text-btn font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    >
                      Reject Campaign
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Action title */}
                    <div className="flex items-center justify-between">
                      <Text className="font-black capitalize">
                        {activeAction === "approve"
                          ? "Approve Campaign"
                          : activeAction === "reject"
                            ? "Reject Campaign"
                            : "Request Changes"}
                      </Text>
                      <button
                        type="button"
                        onClick={closeAction}
                        className="text-btn font-bold text-slate-light transition-colors hover:text-slate"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Reason (required for reject and request_changes) */}
                    {(activeAction === "reject" || activeAction === "request_changes") && (
                      <Textarea
                        label="Reason"
                        placeholder={
                          activeAction === "reject"
                            ? "Explain why this campaign is being rejected..."
                            : "Describe the changes required..."
                        }
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        error={validationError ?? undefined}
                        disabled={isSubmitting}
                        className="min-h-[100px]"
                      />
                    )}

                    {/* Notes (optional for all actions) */}
                    <Textarea
                      label={activeAction === "approve" ? "Notes (optional)" : "Additional Notes (optional)"}
                      placeholder="Add any internal notes for the record..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isSubmitting}
                      className="min-h-[80px]"
                    />

                    {/* Submit action */}
                    <button
                      type="button"
                      onClick={handleSubmitAction}
                      disabled={isSubmitting}
                      className={`w-full rounded-full px-6 py-2.5 text-btn font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        activeAction === "approve"
                          ? "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
                          : activeAction === "reject"
                            ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                            : "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400"
                      }`}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : activeAction === "approve"
                          ? "Confirm Approval"
                          : activeAction === "reject"
                            ? "Confirm Rejection"
                            : "Confirm Request"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
