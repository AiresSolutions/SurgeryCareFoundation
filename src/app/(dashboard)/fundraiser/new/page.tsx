"use client";

import { useState, useRef, type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-section";
import { UploadIcon, ArrowRightIcon } from "@/components/ui/icons";
import { campaignService } from "@/services/campaign.service";
import { useToast } from "@/components/ui/toast";

const URGENCY_OPTIONS = [
  { value: "", label: "Select urgency level" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

const MAX_PROXY_UPLOAD_BYTES = 4 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StartFundraiserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const patientImagesInputRef = useRef<HTMLInputElement | null>(null);
  const medicalDocumentsInputRef = useRef<HTMLInputElement | null>(null);

  // --- Form state (fields that map to CreateCampaignRequest) ---
  const [title, setTitle] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [description, setDescription] = useState("");
  const [category] = useState("medical"); // default category for medical fundraisers

  // --- Visual-only fields (not submitted to campaign API) ---
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [patientImages, setPatientImages] = useState<File[]>([]);
  const [medicalDocuments, setMedicalDocuments] = useState<File[]>([]);

  // --- Validation errors ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Submission state ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 5) {
      next.title = "Title is required and must be at least 5 characters.";
    }
    if (!patientName.trim()) {
      next.patientName = "Patient / Cause name is required.";
    }
    const parsed = Number(goalAmount);
    if (!goalAmount || isNaN(parsed) || parsed <= 0) {
      next.goalAmount = "Target amount must be a number greater than 0.";
    }
    if (!consentChecked) {
      next.consent = "You must agree to the consent declaration.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function updateSelectedFiles(
    event: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<File[]>>,
    label: string,
  ) {
    const files = Array.from(event.target.files ?? []);
    const accepted = files.filter((file) => file.size <= MAX_PROXY_UPLOAD_BYTES);
    const rejected = files.filter((file) => file.size > MAX_PROXY_UPLOAD_BYTES);

    setter((current) => [...current, ...accepted]);

    if (rejected.length > 0) {
      toast(
        `${label}: ${rejected
          .map((file) => `${file.name} exceeds ${formatFileSize(MAX_PROXY_UPLOAD_BYTES)}`)
          .join(", ")}`,
        "error",
      );
    }

    event.target.value = "";
  }

  function removeSelectedFile(
    kind: "patientImages" | "medicalDocuments",
    fileName: string,
  ) {
    if (kind === "patientImages") {
      setPatientImages((current) => current.filter((file) => file.name !== fileName));
      return;
    }

    setMedicalDocuments((current) => current.filter((file) => file.name !== fileName));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const campaign = await campaignService.create({
        title: title.trim(),
        description: description.trim() || undefined,
        goalAmount: Number(goalAmount),
        urgencyLevel:
          urgencyLevel === ""
            ? undefined
            : (urgencyLevel as "critical" | "high" | "medium" | "low"),
        category,
        medicalDetails: {
          patientName: patientName.trim(),
          diagnosis: diagnosis.trim() || undefined,
        },
      });

      const uploads = [
        ...patientImages.map((file) => campaignService.uploadDocument(campaign.id, file, "patient_image")),
        ...medicalDocuments.map((file) => campaignService.uploadDocument(campaign.id, file, "medical_document")),
      ];

      if (uploads.length > 0) {
        await Promise.all(uploads);
      }

      toast(
        uploads.length > 0
          ? "Fundraiser created and files uploaded. It has been saved as a draft."
          : "Fundraiser created! It has been saved as a draft.",
        "success",
      );
      router.push("/dashboard/fundraisers");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Note: This page is inside the (dashboard) layout, so it gets auth header + sidebar.
          But the Figma shows it WITHOUT the sidebar. We render the hero + form in full width
          by overriding the sidebar layout constraint via the content itself. */}

      <div className="-mx-4 -mt-8 sm:-mx-6 md:-mt-12 lg:-mx-8">
        {/* Hero */}
        <section className="bg-primary py-12 text-center md:py-16">
          <Container>
            <Text variant="on-dark" size="label" className="mb-2 text-accent-mint">
              Create Campaign
            </Text>
            <Heading level="h1" as="h1" className="mb-4 text-white">
              Start a{" "}
              <span className="bg-gradient-to-b from-accent-mint to-accent-green bg-clip-text text-transparent">
                Fundraiser
              </span>
            </Heading>
            <Text variant="on-dark" className="mx-auto max-w-xl">
              Fill out the details below to submit a medical case for review. Every submission is rigorously vetted by
              our medical board to ensure authenticity.
            </Text>
          </Container>
        </section>

        <Container className="py-8 md:py-12">
          {/* Warning banner */}
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg" aria-hidden="true">⚠️</span>
            <div>
              <p className="mb-1 text-btn font-black text-amber-800">Before you start</p>
              <Text className="text-amber-700">
                You must be a registered user to create a fundraiser. Please ensure all medical documents are clear, legible, and issued
                by a certified medical professional. False or misleading applications will result in account suspension.
              </Text>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Campaign Information */}
            <FormSection icon="✏️" title="Campaign Information">
              <Input
                label="Fundraiser Title"
                placeholder="E.g., Help John Overcome Brain Tumor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                disabled={isSubmitting}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Patient / Cause Name"
                  placeholder="E.g., John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  error={errors.patientName}
                  disabled={isSubmitting}
                />
                <Input
                  label="Medical Condition"
                  placeholder="E.g., Brain Tumor Stage 2"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
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
            </FormSection>

            {/* Patient Story */}
            <FormSection icon="📖" title="Patient Story">
              <div className="mb-2">
                <Text variant="secondary">
                  Explain the patient&apos;s background, how the condition started, and exactly how the funds will be used. Be honest
                  and transparent.
                </Text>
              </div>
              <Textarea
                label="Detailed Description"
                placeholder="Describe the medical situation and why funds are needed..."
                className="min-h-[160px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </FormSection>

            {/* Media & Documents */}
            <FormSection icon="📎" title="Media & Documents">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-dashed border-surface-border bg-surface-page p-6 text-center transition-colors hover:border-accent/50">
                  <input
                    ref={patientImagesInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(event) => updateSelectedFiles(event, setPatientImages, "Patient Images")}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <UploadIcon className="size-8 text-slate-light" />
                    <Text variant="secondary" className="font-bold">Patient Images</Text>
                    <Text variant="muted" size="label" className="normal-case tracking-normal">
                      JPG, PNG, WEBP up to {formatFileSize(MAX_PROXY_UPLOAD_BYTES)} each
                    </Text>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => patientImagesInputRef.current?.click()}
                      disabled={isSubmitting}
                    >
                      Select Images
                    </Button>
                  </div>
                  {patientImages.length > 0 && (
                    <div className="mt-4 space-y-2 text-left">
                      {patientImages.map((file) => (
                        <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
                          <div>
                            <p className="text-sm font-bold text-primary">{file.name}</p>
                            <p className="text-xs text-slate-medium">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-bold text-accent"
                            onClick={() => removeSelectedFile("patientImages", file.name)}
                            disabled={isSubmitting}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border-2 border-dashed border-surface-border bg-surface-page p-6 text-center transition-colors hover:border-accent/50">
                  <input
                    ref={medicalDocumentsInputRef}
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(event) => updateSelectedFiles(event, setMedicalDocuments, "Medical Documents")}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <UploadIcon className="size-8 text-slate-light" />
                    <Text variant="secondary" className="font-bold">Medical Documents</Text>
                    <Text variant="muted" size="label" className="normal-case tracking-normal">
                      PDF, JPG, PNG, WEBP up to {formatFileSize(MAX_PROXY_UPLOAD_BYTES)} each
                    </Text>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => medicalDocumentsInputRef.current?.click()}
                      disabled={isSubmitting}
                    >
                      Select Documents
                    </Button>
                  </div>
                  {medicalDocuments.length > 0 && (
                    <div className="mt-4 space-y-2 text-left">
                      {medicalDocuments.map((file) => (
                        <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
                          <div>
                            <p className="text-sm font-bold text-primary">{file.name}</p>
                            <p className="text-xs text-slate-medium">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-bold text-accent"
                            onClick={() => removeSelectedFile("medicalDocuments", file.name)}
                            disabled={isSubmitting}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Contact & Banking */}
            <FormSection icon="💳" title="Contact & Banking Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Your Relationship to Patient"
                  placeholder="E.g., Father, Self, NGO Worker"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  disabled={isSubmitting}
                />
                <Input
                  label="Phone Number"
                  placeholder="+91"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mt-4 rounded-xl bg-accent/5 border border-accent/20 p-4">
                <p className="mb-2 text-btn font-black text-accent">Bank Details for Fund Dispersal</p>
                <Text variant="secondary" className="mb-4">
                  Funds will be transferred to this account upon withdrawal approval. Ideally, provide the hospital&apos;s account details
                  directly.
                </Text>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Account Holder Name"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Input
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mt-4">
                  <Input
                    placeholder="IFSC / Swift Code"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <Text variant="muted" size="label" className="mt-3 normal-case tracking-normal">
                  Banking details are saved separately on your account settings page and are not part of the fundraiser submission.
                </Text>
              </div>
            </FormSection>

            {/* Consent & Submit */}
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-surface-page p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 size-4 shrink-0 accent-accent"
                />
                <Text variant="secondary">
                  By submitting this form, I declare that all information and documents provided are genuine. I understand that the
                  Surgery Care Foundation medical board will verify this case with the respective hospital before approval.
                </Text>
              </label>
            </div>
            {errors.consent && (
              <p className="mb-4 text-label text-red-500 normal-case tracking-normal" role="alert">
                {errors.consent}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Fundraiser for Review"}
              {!isSubmitting && <ArrowRightIcon className="size-5" />}
            </Button>
          </form>
        </Container>
      </div>
    </>
  );
}
