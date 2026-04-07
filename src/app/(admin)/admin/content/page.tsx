"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CloseIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";
import { adminService } from "@/services/admin.service";
import type {
  PartnerHospital,
  BoardMember,
  AnnualReport,
  BlogPost,
} from "@/types/content";

function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="flex items-center justify-center">
          <Text variant="secondary">Loading...</Text>
        </div>
      </Container>
    );
  }

  if (!user || !user.roles.some((role) => allowedRoles.includes(role))) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Heading level="h3">Access Denied</Heading>
          <Text variant="secondary">
            You do not have permission to view this page.
          </Text>
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            Go Home
          </Link>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}

const TABS = [
  "Partner Hospitals",
  "Board Members",
  "Annual Reports",
  "Blog Posts",
] as const;
type Tab = (typeof TABS)[number];

export default function AdminContentPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("Partner Hospitals");

  const { data: hospitals, isLoading: hospitalsLoading, refetch: refetchHospitals } = useApi<
    PartnerHospital[]
  >(() => publicService.getPartnerHospitals(), []);
  const { data: members, isLoading: membersLoading, refetch: refetchMembers } = useApi<
    BoardMember[]
  >(() => publicService.getBoardMembers(), []);
  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = useApi<
    AnnualReport[]
  >(() => publicService.getAnnualReports(), []);
  const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = useApi<BlogPost[]>(
    () => adminService.listBlogPosts(),
    [],
  );

  const [hospitalFormOpen, setHospitalFormOpen] = useState(false);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalCity, setHospitalCity] = useState("");
  const [hospitalWebsite, setHospitalWebsite] = useState("");

  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberTitle, setMemberTitle] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberPhotoUrl, setMemberPhotoUrl] = useState("");

  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [reportYear, setReportYear] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportUrl, setReportUrl] = useState("");

  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogAuthorName, setBlogAuthorName] = useState("");
  const [blogCoverImageUrl, setBlogCoverImageUrl] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const blogPosts = useMemo(
    () => (posts ?? []).slice().sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt)),
    [posts],
  );

  function resetBlogForm() {
    setEditingPostId(null);
    setBlogTitle("");
    setBlogSlug("");
    setBlogCategory("");
    setBlogAuthorName("");
    setBlogCoverImageUrl("");
    setBlogExcerpt("");
    setBlogContent("");
  }

  async function handleCreateHospital(event: React.FormEvent) {
    event.preventDefault();
    try {
      await adminService.createPartnerHospital({
        name: hospitalName.trim(),
        city: hospitalCity.trim() || undefined,
        website: hospitalWebsite.trim() || undefined,
      });
      toast("Partner hospital created successfully.");
      setHospitalName("");
      setHospitalCity("");
      setHospitalWebsite("");
      setHospitalFormOpen(false);
      refetchHospitals();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create hospital.", "error");
    }
  }

  async function handleCreateMember(event: React.FormEvent) {
    event.preventDefault();
    try {
      await adminService.createBoardMember({
        name: memberName.trim(),
        title: memberTitle.trim() || undefined,
        bio: memberBio.trim() || undefined,
        photoUrl: memberPhotoUrl.trim() || undefined,
      });
      toast("Board member created successfully.");
      setMemberName("");
      setMemberTitle("");
      setMemberBio("");
      setMemberPhotoUrl("");
      setMemberFormOpen(false);
      refetchMembers();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create board member.", "error");
    }
  }

  async function handleCreateReport(event: React.FormEvent) {
    event.preventDefault();
    try {
      await adminService.createAnnualReport({
        year: Number(reportYear),
        title: reportTitle.trim(),
        fileUrl: reportUrl.trim(),
        storageKey: reportUrl.trim(),
      });
      toast("Annual report created successfully.");
      setReportYear("");
      setReportTitle("");
      setReportUrl("");
      setReportFormOpen(false);
      refetchReports();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create report.", "error");
    }
  }

  async function handleUpsertBlogPost(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      title: blogTitle.trim(),
      slug: blogSlug.trim() || undefined,
      category: blogCategory.trim() || undefined,
      authorName: blogAuthorName.trim() || undefined,
      coverImageUrl: blogCoverImageUrl.trim() || undefined,
      excerpt: blogExcerpt.trim(),
      content: blogContent.trim(),
      isPublished: true,
    };

    try {
      if (editingPostId) {
        await adminService.updateBlogPost(editingPostId, payload);
        toast("Blog post updated successfully.");
      } else {
        await adminService.createBlogPost(payload);
        toast("Blog post created successfully.");
      }
      resetBlogForm();
      setBlogFormOpen(false);
      refetchPosts();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save blog post.", "error");
    }
  }

  async function handleDelete(
    action: () => Promise<void>,
    successMessage: string,
    refetch: () => void,
  ) {
    try {
      await action();
      toast(successMessage);
      refetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
    }
  }

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Content Management
          </Heading>
          <Text variant="secondary">
            Manage trust content, annual reports, and public blog posts.
          </Text>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-4 py-1.5 text-btn font-bold transition-colors",
                activeTab === tab
                  ? "bg-primary text-white"
                  : "border border-surface-border bg-white text-slate hover:bg-surface-page",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Partner Hospitals" && (
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <Header
              title="Partner Hospitals"
              count={hospitals?.length ?? 0}
              actionLabel={hospitalFormOpen ? "Cancel" : "Add New"}
              onAction={() => setHospitalFormOpen((value) => !value)}
            />

            {hospitalFormOpen && (
              <FormShell onSubmit={handleCreateHospital}>
                <Input label="Hospital Name" value={hospitalName} onChange={(event) => setHospitalName(event.target.value)} />
                <Input label="City" value={hospitalCity} onChange={(event) => setHospitalCity(event.target.value)} />
                <Input label="Website" type="url" value={hospitalWebsite} onChange={(event) => setHospitalWebsite(event.target.value)} />
                <Button type="submit" variant="secondary">
                  Create Hospital
                </Button>
              </FormShell>
            )}

            <ListState
              isLoading={hospitalsLoading}
              isEmpty={!hospitals || hospitals.length === 0}
              loadingText="Loading hospitals..."
              emptyText="No partner hospitals yet."
            >
              <div className="divide-y divide-surface-border">
                {hospitals?.map((hospital) => (
                  <ListRow
                    key={hospital.id}
                    title={hospital.name}
                    subtitle={[hospital.city, hospital.website].filter(Boolean).join(" • ")}
                    description={hospital.description ?? undefined}
                    onDelete={() =>
                      handleDelete(
                        () => adminService.deletePartnerHospital(hospital.id),
                        "Hospital deleted successfully.",
                        refetchHospitals,
                      )
                    }
                  />
                ))}
              </div>
            </ListState>
          </div>
        )}

        {activeTab === "Board Members" && (
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <Header
              title="Board Members"
              count={members?.length ?? 0}
              actionLabel={memberFormOpen ? "Cancel" : "Add New"}
              onAction={() => setMemberFormOpen((value) => !value)}
            />

            {memberFormOpen && (
              <FormShell onSubmit={handleCreateMember}>
                <Input label="Name" value={memberName} onChange={(event) => setMemberName(event.target.value)} />
                <Input label="Title" value={memberTitle} onChange={(event) => setMemberTitle(event.target.value)} />
                <Input label="Photo URL" type="url" value={memberPhotoUrl} onChange={(event) => setMemberPhotoUrl(event.target.value)} />
                <Textarea label="Bio" value={memberBio} onChange={(event) => setMemberBio(event.target.value)} className="min-h-[100px]" />
                <Button type="submit" variant="secondary">
                  Create Member
                </Button>
              </FormShell>
            )}

            <ListState
              isLoading={membersLoading}
              isEmpty={!members || members.length === 0}
              loadingText="Loading board members..."
              emptyText="No board members yet."
            >
              <div className="divide-y divide-surface-border">
                {members?.map((member) => (
                  <ListRow
                    key={member.id}
                    title={member.name}
                    subtitle={member.title ?? ""}
                    description={member.bio ?? undefined}
                    onDelete={() =>
                      handleDelete(
                        () => adminService.deleteBoardMember(member.id),
                        "Board member deleted successfully.",
                        refetchMembers,
                      )
                    }
                  />
                ))}
              </div>
            </ListState>
          </div>
        )}

        {activeTab === "Annual Reports" && (
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <Header
              title="Annual Reports"
              count={reports?.length ?? 0}
              actionLabel={reportFormOpen ? "Cancel" : "Add New"}
              onAction={() => setReportFormOpen((value) => !value)}
            />

            {reportFormOpen && (
              <FormShell onSubmit={handleCreateReport}>
                <Input label="Year" type="number" value={reportYear} onChange={(event) => setReportYear(event.target.value)} />
                <Input label="Title" value={reportTitle} onChange={(event) => setReportTitle(event.target.value)} />
                <Input label="File URL" type="url" value={reportUrl} onChange={(event) => setReportUrl(event.target.value)} />
                <Button type="submit" variant="secondary">
                  Create Report
                </Button>
              </FormShell>
            )}

            <ListState
              isLoading={reportsLoading}
              isEmpty={!reports || reports.length === 0}
              loadingText="Loading annual reports..."
              emptyText="No annual reports yet."
            >
              <div className="divide-y divide-surface-border">
                {reports?.map((report) => (
                  <ListRow
                    key={report.id}
                    title={report.title}
                    subtitle={`Year: ${report.year}`}
                    description={report.fileUrl}
                    actionLink={report.fileUrl}
                    actionLabel="Open Report"
                    onDelete={() =>
                      handleDelete(
                        () => adminService.deleteAnnualReport(report.id),
                        "Annual report deleted successfully.",
                        refetchReports,
                      )
                    }
                  />
                ))}
              </div>
            </ListState>
          </div>
        )}

        {activeTab === "Blog Posts" && (
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <Header
              title="Blog Posts"
              count={blogPosts.length}
              actionLabel={blogFormOpen ? "Cancel" : "Add New"}
              onAction={() => {
                if (blogFormOpen) {
                  resetBlogForm();
                }
                setBlogFormOpen((value) => !value);
              }}
            />

            {blogFormOpen && (
              <FormShell onSubmit={handleUpsertBlogPost}>
                <Input label="Title" value={blogTitle} onChange={(event) => setBlogTitle(event.target.value)} />
                <Input label="Slug (optional)" value={blogSlug} onChange={(event) => setBlogSlug(event.target.value)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Category" value={blogCategory} onChange={(event) => setBlogCategory(event.target.value)} />
                  <Input label="Author Name" value={blogAuthorName} onChange={(event) => setBlogAuthorName(event.target.value)} />
                </div>
                <Input
                  label="Cover Image URL"
                  type="url"
                  value={blogCoverImageUrl}
                  onChange={(event) => setBlogCoverImageUrl(event.target.value)}
                />
                <Textarea label="Excerpt" value={blogExcerpt} onChange={(event) => setBlogExcerpt(event.target.value)} className="min-h-[100px]" />
                <Textarea label="Content" value={blogContent} onChange={(event) => setBlogContent(event.target.value)} className="min-h-[220px]" />
                <Button type="submit" variant="secondary">
                  {editingPostId ? "Update Post" : "Create Post"}
                </Button>
              </FormShell>
            )}

            <ListState
              isLoading={postsLoading}
              isEmpty={blogPosts.length === 0}
              loadingText="Loading blog posts..."
              emptyText="No blog posts yet."
            >
              <div className="divide-y divide-surface-border">
                {blogPosts.map((post) => (
                  <div key={post.id} className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-btn font-black text-primary">{post.title}</p>
                      <Text variant="muted" size="label" className="normal-case tracking-normal">
                        {[post.category, post.authorName].filter(Boolean).join(" • ") || "Published Post"}
                      </Text>
                      <Text variant="secondary" className="mt-1 line-clamp-2">
                        {post.excerpt}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPostId(post.id);
                          setBlogTitle(post.title);
                          setBlogSlug(post.slug);
                          setBlogCategory(post.category ?? "");
                          setBlogAuthorName(post.authorName ?? "");
                          setBlogCoverImageUrl(post.coverImageUrl ?? "");
                          setBlogExcerpt(post.excerpt);
                          setBlogContent(post.content);
                          setBlogFormOpen(true);
                        }}
                        className={buttonVariants({ variant: "outline", className: "h-9 px-4" })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            () => adminService.deleteBlogPost(post.id),
                            "Blog post deleted successfully.",
                            refetchPosts,
                          )
                        }
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                        aria-label={`Delete ${post.title}`}
                      >
                        <CloseIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ListState>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

function Header({
  title,
  count,
  actionLabel,
  onAction,
}: {
  title: string;
  count: number;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
      <Heading level="h4" as="h2">
        {title}
        <span className="ml-2 text-body font-normal text-slate-light">({count})</span>
      </Heading>
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

function FormShell({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <div className="border-b border-surface-border bg-surface-bg p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  );
}

function ListState({
  isLoading,
  isEmpty,
  loadingText,
  emptyText,
  children,
}: {
  isLoading: boolean;
  isEmpty: boolean;
  loadingText: string;
  emptyText: string;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Text variant="secondary">{loadingText}</Text>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center py-16">
        <Text variant="secondary">{emptyText}</Text>
      </div>
    );
  }

  return <>{children}</>;
}

function ListRow({
  title,
  subtitle,
  description,
  actionLink,
  actionLabel,
  onDelete,
}: {
  title: string;
  subtitle: string;
  description?: string;
  actionLink?: string;
  actionLabel?: string;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-btn font-black text-primary">{title}</p>
        {subtitle && (
          <Text variant="muted" size="label" className="normal-case tracking-normal">
            {subtitle}
          </Text>
        )}
        {description && <Text variant="secondary" className="mt-1 line-clamp-2">{description}</Text>}
        {actionLink && actionLabel && (
          <a
            href={actionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-label font-bold text-accent transition-colors hover:text-accent-green"
          >
            {actionLabel}
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  );
}
