"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { campaignService } from "@/services/campaign.service";
import { useToast } from "@/components/ui/toast";
import type {
  Campaign,
  CampaignUpdate,
  CampaignUpdateKind,
} from "@/types/campaign";

const KINDS: { value: CampaignUpdateKind; label: string; help: string }[] = [
  { value: "ANNOUNCEMENT", label: "Announcement", help: "General update or fundraising milestone" },
  { value: "PRE_SURGERY", label: "Pre-Surgery", help: "Admission, pre-op preparation, surgery scheduled" },
  { value: "SURGERY_DONE", label: "Surgery Done", help: "Surgery has been completed" },
  { value: "RECOVERY", label: "Recovery", help: "Post-op progress, ICU updates, family notes" },
  { value: "DISCHARGE", label: "Discharge", help: "Patient discharged from hospital" },
  { value: "BILL_POSTED", label: "Bill Posted", help: "Final hospital invoice attached (redacted)" },
];

const KIND_LABEL: Record<CampaignUpdateKind, string> = Object.fromEntries(
  KINDS.map((k) => [k.value, k.label]),
) as Record<CampaignUpdateKind, string>;

function RoleGuard({ children }: { children: React.ReactNode }) {
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
  if (!user || !user.roles.includes("super_admin")) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Heading level="h3">Access Denied</Heading>
          <Text variant="secondary">You do not have permission to view this page.</Text>
          <Link href="/admin" className={buttonVariants({ variant: "secondary" })}>
            Back to Dashboard
          </Link>
        </div>
      </Container>
    );
  }
  return <>{children}</>;
}

export default function AdminCampaignDetailPage() {
  return (
    <RoleGuard>
      <Inner />
    </RoleGuard>
  );
}

function Inner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id;

  const { data: campaign, isLoading: campaignLoading } = useApi<Campaign>(
    () => campaignService.getById(id),
    [id],
  );

  const {
    data: updates,
    refetch: refetchUpdates,
    isLoading: updatesLoading,
  } = useApi<CampaignUpdate[]>(() => campaignService.listUpdatesAdmin(id), [id]);

  const [kind, setKind] = useState<CampaignUpdateKind>("ANNOUNCEMENT");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const helpText = useMemo(() => KINDS.find((k) => k.value === kind)?.help ?? "", [kind]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast("Title and content are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      await campaignService.postUpdate(id, {
        kind,
        title: title.trim(),
        content: content.trim(),
        attachment: attachment ?? undefined,
      });
      toast("Update posted", "success");
      setKind("ANNOUNCEMENT");
      setTitle("");
      setContent("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refetchUpdates();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to post update";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(updateId: string) {
    if (!confirm("Delete this update? This cannot be undone.")) return;
    try {
      await campaignService.deleteUpdate(updateId);
      toast("Update deleted", "success");
      await refetchUpdates();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete update";
      toast(msg, "error");
    }
  }

  if (campaignLoading) {
    return (
      <Container className="py-16">
        <Text variant="secondary">Loading campaign...</Text>
      </Container>
    );
  }
  if (!campaign) {
    return (
      <Container className="py-16">
        <Heading level="h3" className="mb-2">Campaign not found</Heading>
        <Link
          href="/admin/campaigns"
          className={buttonVariants({ variant: "secondary" })}
        >
          Back to campaigns
        </Link>
      </Container>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 text-btn font-bold text-accent hover:underline"
      >
        &larr; Back
      </button>

      <div className="mb-8">
        <Text size="label" className="mb-2 tracking-[1.2px] text-accent">
          CAMPAIGN
        </Text>
        <Heading level="h3" as="h1" className="mb-2">
          {campaign.title}
        </Heading>
        <Text variant="secondary">
          Slug: <code className="rounded bg-surface-page px-1.5 py-0.5">{campaign.slug}</code> &middot;{" "}
          Status: {campaign.status}
        </Text>
        <div className="mt-3">
          <Link
            href={`/causes/${campaign.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-btn font-bold text-accent hover:underline"
          >
            View public page &rarr;
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Post new update */}
        <section className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
          <Heading level="h4" as="h2" className="mb-4">
            Post a new update
          </Heading>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-btn font-bold text-primary">Kind</label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as CampaignUpdateKind)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
              <Text variant="muted" size="label" className="mt-1 normal-case tracking-normal">
                {helpText}
              </Text>
            </div>

            <div>
              <label className="mb-1 block text-btn font-bold text-primary">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Surgery completed successfully"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-btn font-bold text-primary">Body</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What should donors know? Plain text, line breaks supported."
                rows={6}
                maxLength={5000}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-btn font-bold text-primary">
                Attachment (optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                className="block w-full text-body file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-btn file:font-bold file:text-white"
              />
              <Text variant="muted" size="label" className="mt-1 normal-case tracking-normal">
                Image (JPG/PNG/WebP/GIF) or PDF. Use this for the redacted bill copy on a Bill Posted update.
              </Text>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post update"}
            </Button>
          </form>
        </section>

        {/* Existing updates */}
        <section className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
          <Heading level="h4" as="h2" className="mb-4">
            Posted updates {updates ? `(${updates.length})` : ""}
          </Heading>
          {updatesLoading ? (
            <Text variant="secondary">Loading updates...</Text>
          ) : updates && updates.length === 0 ? (
            <Text variant="secondary">
              No updates yet. The form on the left posts the first one.
            </Text>
          ) : (
            <ul className="space-y-4">
              {(updates ?? []).map((u) => (
                <li
                  key={u.id}
                  className="rounded-xl border border-surface-border bg-surface-page p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-caption font-bold uppercase tracking-[1px] text-primary">
                      {KIND_LABEL[u.kind] ?? u.kind}
                    </span>
                    <Text variant="muted" size="label" className="ml-auto">
                      {new Date(u.createdAt).toLocaleString("en-IN")}
                    </Text>
                  </div>
                  <p className="mb-1 text-btn-lg font-black text-primary">{u.title}</p>
                  <Text variant="secondary" className="whitespace-pre-line">
                    {u.content}
                  </Text>
                  {u.attachmentUrl && (
                    <a
                      href={u.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-btn font-bold text-accent hover:underline"
                    >
                      Open attachment &rarr;
                    </a>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id)}
                      className="text-caption font-bold uppercase tracking-[1px] text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
