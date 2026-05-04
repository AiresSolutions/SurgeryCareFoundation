export type CampaignStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "active"
  | "paused"
  | "rejected"
  | "completed"
  | "closed";

export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  condition?: string | null;
  urgencyLevel: UrgencyLevel;
  status: CampaignStatus;
  creatorId: string;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  coverImageUrl: string | null;
  videoUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  publishedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; firstName: string; lastName: string };
  documents?: CampaignDocument[];
  _count?: { donations: number };
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CampaignDocument {
  id: string;
  campaignId: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
}

export interface CampaignMilestone {
  id: string;
  campaignId: string;
  title: string;
  targetAmount: number;
  description?: string;
  isReached: boolean;
  reachedAt?: string;
}

export interface MedicalDetails {
  patientName: string;
  patientAge?: number;
  patientGender?: "male" | "female" | "other";
  diagnosis?: string;
  treatmentType?: string;
  treatmentCost?: number;
  doctorName?: string;
}

export interface HospitalDetails {
  hospitalName: string;
  hospitalCity?: string;
  hospitalState?: string;
  hospitalPhone?: string;
  hospitalEmail?: string;
}

export interface CreateCampaignRequest {
  title: string;
  summary?: string;
  description?: string;
  category?: string;
  condition?: string;
  urgencyLevel?: UrgencyLevel;
  goalAmount: number;
  coverImageUrl?: string;
  videoUrl?: string;
  startDate?: string;
  endDate?: string;
  medicalDetails?: MedicalDetails;
  hospitalDetails?: HospitalDetails;
}

export interface CampaignFilters {
  category?: string;
  status?: CampaignStatus;
  urgency?: UrgencyLevel;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export type CampaignDocumentUploadType = "patient_image" | "medical_document";
