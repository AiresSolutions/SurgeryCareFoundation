"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircleIcon, ShareIcon, HeartFilledIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { campaignService } from "@/services/campaign.service";
import { userService, type SavedCauseEntry } from "@/services/user.service";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
import { CoverSlideshow } from "@/components/campaign/cover-slideshow";
import type { CampaignDocument, CampaignUpdate } from "@/types/campaign";

export default function CauseDetailPage({ params }: { params: { id: string } }) {
  const slug = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: campaign,
    error: campaignError,
    isLoading: campaignLoading,
  } = useApi(() => campaignService.getBySlug(slug), [slug]);

  const {
    data: updatesData,
    error: updatesError,
    isLoading: updatesLoading,
  } = useApi(() => campaignService.getUpdates(slug), [slug]);

  const { data: documents } = useApi<CampaignDocument[]>(
    () => campaignService.getPublicDocuments(slug),
    [slug],
  );
  const { data: savedCauses, refetch: refetchSavedCauses } = useApi<SavedCauseEntry[]>(
    () => (user ? userService.getSavedCauses() : Promise.resolve([])),
    [user?.id],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(Boolean(campaign && savedCauses?.some((entry) => entry.campaign.id === campaign.id)));
  }, [campaign, savedCauses]);

  if (campaignLoading) {
    return (
      <section className="py-8 md:py-12">
        <Container>
          <div className="flex min-h-[400px] items-center justify-center">
            <Text variant="secondary">Loading campaign details...</Text>
          </div>
        </Container>
      </section>
    );
  }

  if (campaignError || !campaign) {
    return (
      <section className="py-8 md:py-12">
        <Container>
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <Heading level="h3">Unable to load campaign</Heading>
            <Text variant="secondary">
              {campaignError || "Campaign not found. It may have been removed or the link is incorrect."}
            </Text>
            <Link
              href="/causes"
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              &larr; Back to Causes
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const updates = updatesData?.items ?? [];
  const backers = campaign._count?.donations || 0;

  async function handleSaveCause() {
    if (!campaign) return;

    if (!user) {
      router.push(`/login?redirect=/causes/${slug}`);
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await userService.removeSavedCause(campaign.id);
        toast("Cause removed from your saved list.");
      } else {
        await userService.saveCause(campaign.id);
        toast("Cause saved for later.");
      }
      await refetchSavedCauses();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Unable to update saved causes.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="py-8 md:py-12">
      <Container>
        {/* Back link */}
        <Link
          href="/causes"
          className="mb-6 inline-flex items-center gap-1 text-btn font-bold text-slate-medium transition-colors hover:text-primary"
        >
          <span aria-hidden="true">&larr;</span> Back to Causes
        </Link>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left — Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <CoverSlideshow
                slides={(documents ?? []).filter((d) => d.fileType === "patient_image")}
                fallbackSrc={campaign.coverImageUrl || "/images/placeholder.jpg"}
                alt={campaign.title}
              />
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="accent">{categoryLabel(campaign.category)}</Badge>
              {campaign.condition && (
                <Text variant="secondary" className="font-bold">
                  {campaign.condition}
                </Text>
              )}
            </div>

            <Heading level="h2" as="h1" className="mb-6">
              Help {campaign.title}
            </Heading>

            <div className="space-y-4">
              <Text>{campaign.summary}</Text>
              {campaign.description && (
                <>
                  <Heading level="h4" as="h2">Details</Heading>
                  <Text variant="secondary">{campaign.description}</Text>
                </>
              )}
            </div>

            {/* Patient Photos, Videos & Medical Reports — group by the
                creator-chosen fileType, not MIME, so a JPEG of a hospital
                report scan stays in Medical Reports instead of showing
                up as a "patient photo". */}
            {documents && documents.length > 0 && (() => {
              const photos = documents.filter((d) => d.fileType === "patient_image");
              const videos = documents.filter((d) => d.fileType === "video");
              const reports = documents.filter((d) => d.fileType === "medical_document");
              return (
                <div className="mt-8 space-y-6">
                  {photos.length > 0 && (
                    <div>
                      <Heading level="h4" as="h2" className="mb-3">Patient Photos</Heading>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {photos.map((img) => (
                          <a
                            key={img.id}
                            href={img.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative block aspect-square overflow-hidden rounded-xl border border-surface-border bg-surface-page transition-transform hover:scale-[1.02]"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.downloadUrl}
                              alt={img.fileName}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {videos.length > 0 && (
                    <div>
                      <Heading level="h4" as="h2" className="mb-3">Patient Videos</Heading>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {videos.map((vid) => (
                          <video
                            key={vid.id}
                            src={vid.downloadUrl}
                            controls
                            preload="metadata"
                            className="aspect-video w-full overflow-hidden rounded-xl border border-surface-border bg-black"
                          >
                            Your browser does not support embedded video.
                          </video>
                        ))}
                      </div>
                    </div>
                  )}

                  {reports.length > 0 && (
                    <div>
                      <Heading level="h4" as="h2" className="mb-3">Medical Reports</Heading>
                      <div className="space-y-4">
                        {reports.map((doc) => {
                          const isImage = doc.mimeType?.startsWith("image/");
                          return (
                            <div
                              key={doc.id}
                              className="overflow-hidden rounded-xl border border-surface-border bg-white"
                            >
                              {isImage && doc.downloadUrl && (
                                <a
                                  href={doc.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block bg-surface-page"
                                  aria-label={`Open ${doc.fileName} full size`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={doc.downloadUrl}
                                    alt={doc.fileName}
                                    className="max-h-[600px] w-full object-contain"
                                    loading="lazy"
                                  />
                                </a>
                              )}
                              <a
                                href={doc.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-page"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-btn font-bold text-primary">{doc.fileName}</p>
                                  <Text variant="muted" size="label" className="normal-case tracking-normal">
                                    {(doc.fileSize / 1024).toFixed(0)} KB
                                    {doc.verificationStatus === "verified" && " • Verified"}
                                  </Text>
                                </div>
                                <CheckCircleIcon className="size-5 shrink-0 text-accent" />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Campaign Updates */}
            {!updatesLoading && !updatesError && updates.length > 0 && (
              <div className="mt-8 space-y-4">
                <Heading level="h4" as="h2">Updates</Heading>
                {updates.map((update: CampaignUpdate) => (
                  <div
                    key={update.id}
                    className="rounded-xl border border-surface-border bg-white p-4"
                  >
                    <div className="mb-1 flex items-baseline justify-between gap-4">
                      <Text className="font-semibold">{update.title}</Text>
                      <Text variant="muted" size="label" className="shrink-0">
                        {new Date(update.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </div>
                    <Text variant="secondary">{update.content}</Text>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Donation Sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-32 rounded-2xl border border-surface-border bg-white p-6 shadow-card">
              <p className="mb-1 text-h3 text-primary">
                &#8377; {formatINR(campaign.raisedAmount)}
              </p>
              <Text variant="muted" size="label" className="mb-4">
                Raised of &#8377;{formatINR(campaign.goalAmount)} Goal
              </Text>
              <ProgressBar value={campaign.raisedAmount} max={campaign.goalAmount} className="mb-4" />

              <div className="mb-6 flex items-center gap-2">
                <HeartFilledIcon className="size-4 text-red-500" />
                <Text variant="secondary">{backers} generous {backers === 1 ? "backer" : "backers"}</Text>
              </div>

              <Link
                href={`/causes/${params.id}/checkout`}
                className={buttonVariants({ variant: "primary", size: "lg", className: "mb-3 w-full" })}
              >
                Donate Now
              </Link>
              <button
                type="button"
                className={buttonVariants({ variant: "outline", size: "default", className: "w-full gap-2" })}
                aria-label="Share this cause"
              >
                <ShareIcon className="size-4" />
                Share this cause
              </button>
              <button
                type="button"
                onClick={handleSaveCause}
                disabled={isSaving}
                className={buttonVariants({
                  variant: "outline",
                  size: "default",
                  className: "mt-3 w-full gap-2",
                })}
              >
                <HeartFilledIcon className={`size-4 ${isSaved ? "text-red-500" : "text-slate-light"}`} />
                {isSaving ? "Updating..." : isSaved ? "Saved for Later" : "Save Cause"}
              </button>

              <div className="mt-6 space-y-3 border-t border-surface-border pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-accent" />
                  <Text variant="secondary">
                    Funds are securely processed and sent directly to the partnered medical facility.
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-accent" />
                  <Text variant="secondary">
                    All cases are 100% verified by our expert medical board.
                  </Text>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
