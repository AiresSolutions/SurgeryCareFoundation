import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";
import type {
  Campaign,
  CampaignDocument,
  CampaignDocumentUploadType,
  CampaignUpdate,
  CreateCampaignRequest,
  CampaignFilters,
} from "@/types/campaign";

export const campaignService = {
  list(filters?: CampaignFilters) {
    return apiClient.get<PaginatedData<Campaign>>("/public/campaigns", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  getBySlug(slug: string) {
    return apiClient.get<Campaign>(`/public/campaigns/${slug}`);
  },

  getUpdates(slug: string, params?: { page?: number; limit?: number }) {
    return apiClient.get<PaginatedData<CampaignUpdate>>(`/public/campaigns/${slug}/updates`, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getPublicDocuments(slug: string) {
    return apiClient.get<CampaignDocument[]>(`/public/campaigns/${slug}/documents`);
  },

  recordShare(slug: string) {
    return apiClient.post<{ shareCount: number }>(`/public/campaigns/${slug}/share`);
  },

  create(data: CreateCampaignRequest) {
    return apiClient.post<Campaign>("/campaigns", data);
  },

  getMyCampaigns(params?: { page?: number; limit?: number }) {
    return apiClient.get<PaginatedData<Campaign>>("/campaigns/me", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getById(id: string) {
    return apiClient.get<Campaign>(`/campaigns/${id}`);
  },

  update(id: string, data: Partial<CreateCampaignRequest>) {
    return apiClient.patch<Campaign>(`/campaigns/${id}`, data);
  },

  submit(id: string) {
    return apiClient.post<Campaign>(`/campaigns/${id}/submit`);
  },

  uploadDocument(id: string, file: File, fileType: CampaignDocumentUploadType) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    return apiClient.post<{ document: CampaignDocument }>(`/campaigns/${id}/documents`, formData);
  },

  getDocuments(id: string) {
    return apiClient.get<CampaignDocument[]>(`/campaigns/${id}/documents`);
  },

  addUpdate(id: string, data: { title: string; content: string }) {
    return apiClient.post<CampaignUpdate>(`/campaigns/${id}/updates`, data);
  },

  requestWithdrawal(data: { campaignId: string; amount: number; reason?: string }) {
    return apiClient.post<void>("/withdrawals", data);
  },
};
