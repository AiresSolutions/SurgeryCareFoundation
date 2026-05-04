// Canonical broad-bucket categories. Keep in sync with
// backend/src/modules/campaigns/campaign-categories.ts — same values.
export const CAMPAIGN_CATEGORIES = [
  { value: "paediatric", label: "Paediatric" },
  { value: "oncology", label: "Oncology" },
  { value: "cardiac", label: "Cardiac" },
  { value: "neurological", label: "Neurological" },
  { value: "orthopaedic", label: "Orthopaedic" },
  { value: "transplant", label: "Transplant" },
  { value: "other", label: "Other" },
] as const;

export type CampaignCategoryValue = (typeof CAMPAIGN_CATEGORIES)[number]["value"];

const LABEL_BY_VALUE: Record<string, string> = Object.fromEntries(
  CAMPAIGN_CATEGORIES.map((c) => [c.value, c.label]),
);

export function categoryLabel(value: string | null | undefined): string {
  if (!value) return "Other";
  return LABEL_BY_VALUE[value] ?? value;
}
