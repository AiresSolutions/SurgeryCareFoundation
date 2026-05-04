import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";
import type { Campaign } from "@/types/campaign";

interface ModerationFilters {
  page?: number;
  limit?: number;
  status?: string;
}

interface ApproveRequest {
  notes?: string;
}

interface RejectRequest {
  reason: string;
  notes?: string;
}

interface RequestChangesRequest {
  reason: string;
  notes?: string;
}

interface DocumentVerifyRequest {
  notes?: string;
}

interface DocumentRejectRequest {
  reason: string;
  notes?: string;
}

export const moderationService = {
  listCampaigns(filters?: ModerationFilters) {
    return apiClient.get<PaginatedData<Campaign>>("/moderation/campaigns", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  listPendingCampaigns(params?: ModerationFilters) {
    return apiClient.get<PaginatedData<Campaign>>("/moderation/campaigns", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getCampaign(id: string) {
    return apiClient.get<Campaign>(`/moderation/campaigns/${id}`);
  },

  getCampaignForReview(id: string) {
    return apiClient.get<Campaign>(`/moderation/campaigns/${id}`);
  },

  approveCampaign(id: string, data?: ApproveRequest) {
    return apiClient.post<Campaign>(`/moderation/campaigns/${id}/approve`, data);
  },

  rejectCampaign(id: string, data: RejectRequest) {
    return apiClient.post<Campaign>(`/moderation/campaigns/${id}/reject`, data);
  },

  requestChanges(id: string, data: RequestChangesRequest) {
    return apiClient.post<Campaign>(`/moderation/campaigns/${id}/request-changes`, data);
  },

  verifyDocument(id: string, data?: DocumentVerifyRequest) {
    return apiClient.post<void>(`/moderation/documents/${id}/verify`, data);
  },

  rejectDocument(id: string, data: DocumentRejectRequest) {
    return apiClient.post<void>(`/moderation/documents/${id}/reject`, data);
  },

  verifyAllDocuments(campaignId: string, data?: DocumentVerifyRequest) {
    return apiClient.post<{ verifiedCount: number }>(
      `/moderation/campaigns/${campaignId}/documents/verify-all`,
      data,
    );
  },
};
