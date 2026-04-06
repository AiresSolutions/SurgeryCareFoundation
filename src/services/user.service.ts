import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/auth";
import type { PaginatedData, PaginationParams } from "@/types/api";
import type { Donation } from "@/types/donation";

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

export const userService = {
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
};
