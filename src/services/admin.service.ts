import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";
import type { Campaign } from "@/types/campaign";
import type { PartnerHospital, BoardMember, AnnualReport } from "@/types/content";

export interface AdminDashboard {
  totalUsers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalDonations: number;
  totalRaised: number;
  totalDonors: number;
  pendingReviews: number;
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
  createPartnerHospital(data: Omit<PartnerHospital, "id">) {
    return apiClient.post<PartnerHospital>("/admin/content/partner-hospitals", data);
  },

  deletePartnerHospital(id: string) {
    return apiClient.delete<void>(`/admin/content/partner-hospitals/${id}`);
  },

  createBoardMember(data: Omit<BoardMember, "id">) {
    return apiClient.post<BoardMember>("/admin/content/board-members", data);
  },

  deleteBoardMember(id: string) {
    return apiClient.delete<void>(`/admin/content/board-members/${id}`);
  },

  createAnnualReport(data: AnnualReport) {
    return apiClient.post<AnnualReport>("/admin/content/annual-reports", data);
  },

  deleteAnnualReport(id: string) {
    return apiClient.delete<void>(`/admin/content/annual-reports/${id}`);
  },
};
