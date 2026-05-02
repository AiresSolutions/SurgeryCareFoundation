import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";
import type { Campaign } from "@/types/campaign";
import type { PartnerHospital, BoardMember, AnnualReport, BlogPost } from "@/types/content";

interface PartnerHospitalPayload {
  name: string;
  city?: string;
  state?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

interface BoardMemberPayload {
  name: string;
  title?: string;
  bio?: string;
  photoUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

interface BlogPostPayload {
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  coverImageUrl?: string;
  authorName?: string;
  isPublished?: boolean;
}

export interface AdminDashboard {
  totalFundsRaised: number;
  totalPatients: number;
  activeCampaigns: number;
  urgentCampaigns: number;
  totalDonors: number;
  pendingWithdrawals: number;
}

export interface AdminDonor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  roles: string[];
  accountStatus: string;
  totalDonated: number;
  donationCount: number;
  createdAt: string;
  _count?: { donations: number };
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorRole: string;
  actorName: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  actor?: { firstName: string; lastName: string; email: string };
}

interface DonorFilters {
  page?: number;
  limit?: number;
  search?: string;
}

interface CampaignFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface AuditLogFilters {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
  actorId?: string;
}

interface ExportRequest {
  format?: string;
}

interface ExportResponse {
  url: string;
  expiresAt: string;
}

export const adminService = {
  getDashboard() {
    return apiClient.get<AdminDashboard>("/admin/dashboard");
  },

  listDonors(filters?: DonorFilters) {
    return apiClient.get<PaginatedData<AdminDonor>>("/admin/donors", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  listCampaigns(filters?: CampaignFilters) {
    return apiClient.get<PaginatedData<Campaign>>("/admin/campaigns", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  listAuditLogs(filters?: AuditLogFilters) {
    return apiClient.get<PaginatedData<AuditLog>>("/admin/audit-logs", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  exportDonors(data?: ExportRequest) {
    return apiClient.post<ExportResponse>("/admin/exports/donors", data);
  },

  exportCampaigns(data?: ExportRequest) {
    return apiClient.post<ExportResponse>("/admin/exports/campaigns", data);
  },

  // Content management
  createPartnerHospital(data: PartnerHospitalPayload) {
    return apiClient.post<PartnerHospital>("/content/partner-hospitals", data);
  },

  deletePartnerHospital(id: string) {
    return apiClient.delete<void>(`/content/partner-hospitals/${id}`);
  },

  createBoardMember(data: BoardMemberPayload) {
    return apiClient.post<BoardMember>("/content/board-members", data);
  },

  deleteBoardMember(id: string) {
    return apiClient.delete<void>(`/content/board-members/${id}`);
  },

  createAnnualReport(data: Pick<AnnualReport, "year" | "title" | "fileUrl"> & { storageKey?: string }) {
    return apiClient.post<AnnualReport>("/content/annual-reports", data);
  },

  deleteAnnualReport(id: string) {
    return apiClient.delete<void>(`/content/annual-reports/${id}`);
  },

  listBlogPosts() {
    return apiClient.get<BlogPost[]>("/content/blog-posts");
  },

  createBlogPost(data: BlogPostPayload) {
    return apiClient.post<BlogPost>("/content/blog-posts", data);
  },

  updateBlogPost(id: string, data: Partial<BlogPostPayload>) {
    return apiClient.patch<BlogPost>(`/content/blog-posts/${id}`, data);
  },

  deleteBlogPost(id: string) {
    return apiClient.delete<void>(`/content/blog-posts/${id}`);
  },
};
