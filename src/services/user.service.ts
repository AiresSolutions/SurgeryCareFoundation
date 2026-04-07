import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/auth";
import type { PaginatedData, PaginationParams } from "@/types/api";
import type { Donation } from "@/types/donation";
import type { Campaign } from "@/types/campaign";

export interface UpdateCreatorProfile {
  organizationName?: string;
  bio?: string;
  website?: string;
  panNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
}

export interface UpdateDonorProfile {
  displayName?: string;
  isAnonymous?: boolean;
  languagePreference?: string;
  contactPreference?: "email" | "phone" | "none";
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  accountStatus: string;
  roles: string[];
  donorProfile?: {
    displayName?: string | null;
    isAnonymous?: boolean;
    languagePreference?: string;
    contactPreference?: string;
  } | null;
  creatorProfile?: {
    organizationName?: string | null;
    bio?: string | null;
    website?: string | null;
    panNumber?: string | null;
    bankAccountName?: string | null;
    bankAccountNumber?: string | null;
    bankIfsc?: string | null;
    bankName?: string | null;
    kycStatus?: string | null;
  } | null;
}

export interface SavedCauseEntry {
  id: string;
  savedAt: string;
  campaign: Campaign;
}

export const userService = {
  getProfile() {
    return apiClient.get<UserProfile>("/users/me");
  },

  updateProfile(data: Partial<Pick<User, "firstName" | "lastName" | "phone" | "avatarUrl">>) {
    return apiClient.patch<User>("/users/me", data);
  },

  updateCreatorProfile(data: UpdateCreatorProfile) {
    return apiClient.patch<void>("/users/me/creator-profile", data);
  },

  updateDonorProfile(data: UpdateDonorProfile) {
    return apiClient.patch<void>("/users/me/donor-profile", data);
  },

  getDonations(params?: PaginationParams & { status?: string; campaignId?: string }) {
    return apiClient.get<PaginatedData<Donation>>("/donations/me", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getSavedCauses() {
    return apiClient.get<SavedCauseEntry[]>("/users/me/saved-causes");
  },

  saveCause(campaignId: string) {
    return apiClient.post<SavedCauseEntry>("/users/me/saved-causes", { campaignId });
  },

  removeSavedCause(campaignId: string) {
    return apiClient.delete<void>(`/users/me/saved-causes/${campaignId}`);
  },
};
