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
import {
  CampaignStory,
  descriptionHasInlineMedia,
} from "@/components/campaign/campaign-story";
import {
  YouTubeEmbed,
  extractYouTubeId,
} from "@/components/campaign/youtube-embed";
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

  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : `/causes/${slug}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers / non-HTTPS contexts where the
        // Clipboard API is unavailable.
        const ta = document.createElement("textarea");
        ta.value = shareUrl;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast("Link copied to clipboard", "success");
    } catch {
      toast("Couldn't copy link, please copy from the address bar.", "error");
      return;
    }
    try {
      await campaignService.recordShare(slug);
    } catch {
      // Silently swallow — the user already got their copied link;
      // a failed counter update isn't worth a second toast.
    }
  }

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
          {/* Hero — cover, badges, title */}
          <div className="lg:col-span-3 lg:col-start-1 lg:row-start-1">
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
              {/[.!?]/.test(campaign.title) ? campaign.title : `Help ${campaign.title}`}
            </Heading>
          </div>

          {/* Donation Sidebar — second in DOM so it appears between title and
              story on mobile, while desktop pins it to the right column with
              row-span-2 sticky behavior. */}
          <aside className="lg:col-span-2 lg:col-start-4 lg:row-span-2 lg:row-start-1">
            <div className="sticky top-32 rounded-2xl border border-surface-border bg-white p-6 shadow-card">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <p className="text-h3 text-primary">
                  &#8377; {formatINR(campaign.raisedAmount)}
                </p>
                <p className="text-btn font-black text-accent">
                  {campaign.goalAmount > 0
                    ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
                    : 0}
                  % funded
                </p>
              </div>
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
                onClick={handleShare}
                className={buttonVariants({ variant: "outline", size: "default", className: "w-full gap-2" })}
                aria-label="Copy share link to clipboard"
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

          {/* Body — story, media, updates */}
          <div className="lg:col-span-3 lg:col-start-1 lg:row-start-2">
            {campaign.videoUrl && extractYouTubeId(campaign.videoUrl) && (
              <div className="mb-6">
                <Heading level="h4" as="h2" className="mb-3">
                  Watch the Story
                </Heading>
                <YouTubeEmbed url={campaign.videoUrl} title={campaign.title} />
              </div>
            )}

            <div className="space-y-4">
              {campaign.summary && <Text>{campaign.summary}</Text>}
              {campaign.description && (
                <CampaignStory description={campaign.description} />
              )}
            </div>

            {/* Patient Photos, Videos & Medical Reports — group by the
                creator-chosen fileType, not MIME, so a JPEG of a hospital
                report scan stays in Medical Reports instead of showing
                up as a "patient photo". */}
            {documents && documents.length > 0 && (() => {
              // When the description already weaves images into the story
              // (markdown ![](...) syntax), we suppress the auto photo and
              // medical-report galleries so the same images don't appear
              // twice. Videos still render — they don't fit inline well.
              const inlineMedia = descriptionHasInlineMedia(campaign.description);
              const photos = inlineMedia
                ? []
                : documents.filter((d) => d.fileType === "patient_image");
              const videos = documents.filter((d) => d.fileType === "video");
              const reports = inlineMedia
                ? []
                : documents.filter((d) => d.fileType === "medical_document");
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
                          <div
                            key={vid.id}
                            className="flex items-center justify-center overflow-hidden rounded-xl border border-surface-border bg-surface-page"
                          >
                            <video
                              src={vid.downloadUrl}
                              controls
                              preload="metadata"
                              className="mx-auto block max-h-[500px] max-w-full"
                            >
                              Your browser does not support embedded video.
                            </video>
                          </div>
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
                          if (isImage && doc.downloadUrl) {
                            return (
                              <a
                                key={doc.id}
                                href={doc.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-xl bg-surface-page"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={doc.downloadUrl}
                                  alt=""
                                  className="w-full object-contain"
                                  loading="lazy"
                                />
                              </a>
                            );
                          }
                          // Non-image report (PDF etc) — fall back to a download card
                          return (
                            <a
                              key={doc.id}
                              href={doc.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block truncate rounded-xl border border-surface-border bg-white px-4 py-3 text-btn font-bold text-primary transition-colors hover:border-accent"
                            >
                              {doc.fileName}
                            </a>
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
        </div>
      </Container>
    </section>
  );
}
