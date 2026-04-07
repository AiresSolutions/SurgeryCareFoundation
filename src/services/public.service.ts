import { apiClient } from "@/lib/api-client";
import type {
  PartnerHospital,
  BoardMember,
  AnnualReport,
  BlogPost,
  SiteStats,
} from "@/types/content";

export const publicService = {
  getPartnerHospitals() {
    return apiClient.get<PartnerHospital[]>("/public/trust/partner-hospitals");
  },

  getBoardMembers() {
    return apiClient.get<BoardMember[]>("/public/trust/board-members");
  },

  getAnnualReports() {
    return apiClient.get<AnnualReport[]>("/public/trust/reports/annual");
  },

  getContent(slug: string) {
    return apiClient.get<{ slug: string; title?: string | null; body: string }>(
      `/public/content/${slug}`,
    );
  },

  getStats() {
    return apiClient.get<SiteStats>("/public/stats");
  },

  getBlogPosts() {
    return apiClient.get<BlogPost[]>("/public/blog-posts");
  },

  getBlogPost(slug: string) {
    return apiClient.get<BlogPost>(`/public/blog-posts/${slug}`);
  },
};
