"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-section";
import { ArrowRightIcon } from "@/components/ui/icons";
import { campaignService } from "@/services/campaign.service";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import type { CreateCampaignRequest, UrgencyLevel } from "@/types/campaign";

const URGENCY_OPTIONS = [
  { value: "", label: "Select urgency level" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export default function EditFundraiserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const campaignId = params.id;

  // --- Fetch campaign data ---
  const {
    data: campaign,
    error: fetchError,
    isLoading,
  } = useApi(() => campaignService.getById(campaignId), [campaignId]);

  // --- Form state ---
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [category, setCategory] = useState("");

  // Track the original values so we only submit changed fields
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});

  // --- Validation errors ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Submission state ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Populate form when campaign data arrives ---
  useEffect(() => {
    if (campaign) {
      const values = {
        title: campaign.title ?? "",
        summary: campaign.summary ?? "",
        description: campaign.description ?? "",
        goalAmount: campaign.goalAmount ? String(campaign.goalAmount) : "",
        urgencyLevel: campaign.urgencyLevel ?? "",
        category: campaign.category ?? "",
      };

      setTitle(values.title);
      setSummary(values.summary);
      setDescription(values.description);
      setGoalAmount(values.goalAmount);
      setUrgencyLevel(values.urgencyLevel);
      setCategory(values.category);
      setOriginalValues(values);
    }
  }, [campaign]);

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 5) {
      next.title = "Title is required and must be at least 5 characters.";
    }
    const parsed = Number(goalAmount);
    if (!goalAmount || isNaN(parsed) || parsed <= 0) {
      next.goalAmount = "Target amount must be a number greater than 0.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Build payload with only the changed fields
      const data: Partial<CreateCampaignRequest> = {};

      if (title.trim() !== originalValues.title) {
        data.title = title.trim();
      }
      if (summary.trim() !== originalValues.summary) {
        data.summary = summary.trim() || undefined;
      }
      if (description.trim() !== originalValues.description) {
        data.description = description.trim() || undefined;
      }
      if (goalAmount !== originalValues.goalAmount) {
        data.goalAmount = Number(goalAmount);
      }
      if (urgencyLevel !== originalValues.urgencyLevel) {
        data.urgencyLevel =
          urgencyLevel === "" ? undefined : (urgencyLevel as UrgencyLevel);
      }
      if (category.trim() !== originalValues.category) {
        data.category = category.trim() || undefined;
      }

      await campaignService.update(campaignId, data);

      toast("Campaign updated successfully", "success");
      router.push("/dashboard/fundraisers");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Loading state ---
  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-surface-border border-t-accent" />
            <Text variant="secondary">Loading campaign...</Text>
          </div>
        </div>
      </Container>
    );
  }

  // --- Error state ---
  if (fetchError || !campaign) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <Heading level="h3" as="h1" className="mb-2 text-red-800">
            Campaign Not Found
          </Heading>
          <Text className="mb-6 text-red-600">
            {fetchError ?? "The campaign you are looking for does not exist or could not be loaded."}
          </Text>
          <Link
            href="/dashboard/fundraisers"
            className="inline-flex items-center gap-2 text-btn font-bold text-accent hover:underline"
          >
            &larr; Back to Fundraisers
          </Link>
        </div>
      </Container>
    );
  }

  // --- Non-draft campaigns cannot be edited ---
  if (campaign.status !== "draft") {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-amber-100 text-2xl" aria-hidden="true">
            &#9888;
          </span>
          <Heading level="h3" as="h1" className="mb-2 text-amber-800">
            Editing Not Allowed
          </Heading>
          <Text className="mb-6 text-amber-700">
            Only draft campaigns can be edited.
          </Text>
          <Link
            href="/dashboard/fundraisers"
            className="inline-flex items-center gap-2 text-btn font-bold text-accent hover:underline"
          >
            &larr; Back to Fundraisers
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      {/* Back link */}
      <Link
        href="/dashboard/fundraisers"
        className="mb-6 inline-flex items-center gap-2 text-btn font-bold text-accent hover:underline"
      >
        &larr; Back to Fundraisers
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <Heading level="h2" as="h1">
          Edit Fundraiser
        </Heading>
        <Text variant="secondary" className="mt-1">
          Update the details for &ldquo;{campaign.title}&rdquo;
        </Text>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Campaign Information */}
        <FormSection icon="&#9998;" title="Campaign Information">
          <Input
            label="Fundraiser Title"
            placeholder="E.g., Help John Overcome Brain Tumor"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            disabled={isSubmitting}
          />
          <Input
            label="Summary"
            placeholder="A brief one-line summary of the campaign"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Target Amount (₹)"
              placeholder="500000"
              type="number"
              min="1"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              error={errors.goalAmount}
              disabled={isSubmitting}
            />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="urgency-level"
                className="text-[14px] font-bold uppercase leading-[20px] tracking-[0.35px] text-[#314158]"
              >
                Urgency Level
              </label>
              <select
                id="urgency-level"
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-[14px] border border-surface-border bg-surface-bg px-4 py-[14px] text-body text-slate transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {URGENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Category"
            placeholder="E.g., medical, education"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          />
        </FormSection>

        {/* Description */}
        <FormSection icon="&#128221;" title="Campaign Description">
          <Textarea
            label="Detailed Description"
            placeholder="Describe the campaign and why funds are needed..."
            className="min-h-[160px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </FormSection>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
            {!isSubmitting && <ArrowRightIcon className="size-5" />}
          </Button>
          <Link
            href="/dashboard/fundraisers"
            className="text-btn font-bold text-slate-light hover:text-slate"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Container>
  );
}
