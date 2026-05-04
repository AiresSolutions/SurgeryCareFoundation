export type DonationStatus =
  | "INITIATED"
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface Donation {
  id: string;
  campaignId: string;
  donorId: string | null;
  donorName: string | null;
  donorEmail: string | null;
  amount: number;
  currency: string;
  isAnonymous: boolean;
  message: string | null;
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
  campaign: {
    id: string;
    title: string;
    slug: string;
  };
  receipt: {
    id: string;
    receiptNumber: string;
    issuedAt: string;
  } | null;
}

export type WithdrawalStatus =
  | "requested"
  | "under_review"
  | "approved"
  | "rejected"
  | "partially_disbursed"
  | "fully_disbursed"
  | "cancelled";
