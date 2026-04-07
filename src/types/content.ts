export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string | null;
  coverImageUrl: string | null;
  authorName?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerHospital {
  id: string;
  name: string;
  city: string | null;
  state?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface BoardMember {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  photoUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AnnualReport {
  id: string;
  year: number;
  title: string;
  fileUrl: string;
  storageKey: string;
  publishedAt: string | null;
  createdAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SiteStats {
  totalRaised: number;
  totalDonors: number;
  totalCampaigns: number;
}
