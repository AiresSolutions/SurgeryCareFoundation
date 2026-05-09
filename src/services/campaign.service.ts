import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";
import type {
  Campaign,
  CampaignDocument,
  CampaignDocumentUploadType,
  CampaignUpdate,
  CampaignUpdateKind,
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

  getUpdates(slug: string) {
    return apiClient.get<CampaignUpdate[]>(`/public/campaigns/${slug}/updates`);
  },

  // Admin (mounted under /admin/campaigns to avoid clashing with the
  // existing creator-only POST /campaigns/:id/updates JSON endpoint).
  listUpdatesAdmin(campaignId: string) {
    return apiClient.get<CampaignUpdate[]>(`/admin/campaigns/${campaignId}/updates`);
  },

  postUpdate(
    campaignId: string,
    data: { kind: CampaignUpdateKind; title: string; content: string; attachment?: File },
  ) {
    const fd = new FormData();
    fd.append("kind", data.kind);
    fd.append("title", data.title);
    fd.append("content", data.content);
    if (data.attachment) fd.append("attachment", data.attachment);
    return apiClient.post<CampaignUpdate>(`/admin/campaigns/${campaignId}/updates`, fd);
  },

  patchUpdate(
    updateId: string,
    data: {
      kind?: CampaignUpdateKind;
      title?: string;
      content?: string;
      attachment?: File;
      removeAttachment?: boolean;
    },
  ) {
    const fd = new FormData();
    if (data.kind) fd.append("kind", data.kind);
    if (data.title !== undefined) fd.append("title", data.title);
    if (data.content !== undefined) fd.append("content", data.content);
    if (data.removeAttachment) fd.append("removeAttachment", "true");
    if (data.attachment) fd.append("attachment", data.attachment);
    return apiClient.patch<CampaignUpdate>(`/admin/campaigns/updates/${updateId}`, fd);
  },

  deleteUpdate(updateId: string) {
    return apiClient.delete<void>(`/admin/campaigns/updates/${updateId}`);
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

  requestWithdrawal(data: { campaignId: string; amount: number; reason?: string }) {
    return apiClient.post<void>("/withdrawals", data);
  },
};
