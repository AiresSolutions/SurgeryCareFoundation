"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CloseIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";
import { adminService } from "@/services/admin.service";
import type { PartnerHospital, BoardMember, AnnualReport } from "@/types/content";

function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
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

  if (!user || !user.roles.some((r) => allowedRoles.includes(r))) {
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

const TABS = ["Partner Hospitals", "Board Members", "Annual Reports"] as const;
type Tab = (typeof TABS)[number];

export default function AdminContentPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("Partner Hospitals");

  // ── Partner Hospitals ──────────────────────────────────────────
  const {
    data: hospitals,
    isLoading: hospitalsLoading,
    refetch: refetchHospitals,
  } = useApi<PartnerHospital[]>(
    () => publicService.getPartnerHospitals(),
    [],
  );

  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalCity, setHospitalCity] = useState("");
  const [hospitalSpecializations, setHospitalSpecializations] = useState("");
  const [hospitalSubmitting, setHospitalSubmitting] = useState(false);

  async function handleCreateHospital(e: React.FormEvent) {
    e.preventDefault();
    if (!hospitalName.trim() || !hospitalCity.trim()) {
      toast("Name and city are required.", "error");
      return;
    }
    setHospitalSubmitting(true);
    try {
      const specializations = hospitalSpecializations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await adminService.createPartnerHospital({
        name: hospitalName.trim(),
        city: hospitalCity.trim(),
        specializations,
      });
      toast("Partner hospital created successfully!");
      setHospitalName("");
      setHospitalCity("");
      setHospitalSpecializations("");
      setShowHospitalForm(false);
      refetchHospitals();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to create hospital.",
        "error",
      );
    } finally {
      setHospitalSubmitting(false);
    }
  }

  async function handleDeleteHospital(id: string) {
    try {
      await adminService.deletePartnerHospital(id);
      toast("Hospital deleted successfully!");
      refetchHospitals();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to delete hospital.",
        "error",
      );
    }
  }

  // ── Board Members ──────────────────────────────────────────────
  const {
    data: members,
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useApi<BoardMember[]>(() => publicService.getBoardMembers(), []);

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberSubmitting, setMemberSubmitting] = useState(false);

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) {
      toast("Name and role are required.", "error");
      return;
    }
    setMemberSubmitting(true);
    try {
      await adminService.createBoardMember({
        name: memberName.trim(),
        role: memberRole.trim(),
        bio: memberBio.trim(),
      });
      toast("Board member created successfully!");
      setMemberName("");
      setMemberRole("");
      setMemberBio("");
      setShowMemberForm(false);
      refetchMembers();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to create board member.",
        "error",
      );
    } finally {
      setMemberSubmitting(false);
    }
  }

  async function handleDeleteMember(id: string) {
    try {
      await adminService.deleteBoardMember(id);
      toast("Board member deleted successfully!");
      refetchMembers();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to delete board member.",
        "error",
      );
    }
  }

  // ── Annual Reports ─────────────────────────────────────────────
  const {
    data: reports,
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = useApi<AnnualReport[]>(() => publicService.getAnnualReports(), []);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportYear, setReportYear] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  async function handleCreateReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportYear.trim() || !reportTitle.trim() || !reportUrl.trim()) {
      toast("Year, title, and download URL are required.", "error");
      return;
    }
    setReportSubmitting(true);
    try {
      await adminService.createAnnualReport({
        year: Number(reportYear),
        title: reportTitle.trim(),
        downloadUrl: reportUrl.trim(),
      });
      toast("Annual report created successfully!");
      setReportYear("");
      setReportTitle("");
      setReportUrl("");
      setShowReportForm(false);
      refetchReports();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to create report.",
        "error",
      );
    } finally {
      setReportSubmitting(false);
    }
  }

  async function handleDeleteReport(id: string) {
    try {
      await adminService.deleteAnnualReport(id);
      toast("Annual report deleted successfully!");
      refetchReports();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to delete report.",
        "error",
      );
    }
  }

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <Heading level="h2" as="h1" className="mb-2">
            Content Management
          </Heading>
          <Text variant="secondary">
            Manage partner hospitals, board members, and annual reports.
          </Text>
        </div>

        {/* Tabs */}
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
                  : "bg-white text-slate border border-surface-border hover:bg-surface-page",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Partner Hospitals Tab ────────────────────────────── */}
        {activeTab === "Partner Hospitals" && (
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <Heading level="h4" as="h2">
                Partner Hospitals
                <span className="ml-2 text-body text-slate-light font-normal">
                  ({hospitals?.length ?? 0})
                </span>
              </Heading>
              <Button
                variant="secondary"
                onClick={() => setShowHospitalForm(!showHospitalForm)}
              >
                {showHospitalForm ? "Cancel" : "Add New"}
              </Button>
            </div>

            {/* Add form */}
            {showHospitalForm && (
              <div className="border-b border-surface-border bg-surface-bg p-6">
                <form onSubmit={handleCreateHospital} className="space-y-4">
                  <Input
                    label="Hospital Name"
                    placeholder="Enter hospital name"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                  <Input
                    label="City"
                    placeholder="Enter city"
                    value={hospitalCity}
                    onChange={(e) => setHospitalCity(e.target.value)}
                  />
                  <Input
                    label="Specializations (comma-separated)"
                    placeholder="Cardiology, Orthopedics, Oncology"
                    value={hospitalSpecializations}
                    onChange={(e) =>
                      setHospitalSpecializations(e.target.value)
                    }
                  />
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={hospitalSubmitting}
                    >
                      {hospitalSubmitting ? "Creating..." : "Create Hospital"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            {hospitalsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">Loading hospitals...</Text>
              </div>
            ) : !hospitals || hospitals.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">No partner hospitals yet.</Text>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="text-btn font-black text-primary">
                        {hospital.name}
                      </p>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal"
                      >
                        {hospital.city}
                        {hospital.specializations.length > 0 &&
                          ` \u2022 ${hospital.specializations.join(", ")}`}
                      </Text>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHospital(hospital.id)}
                      className="ml-4 shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                      aria-label={`Delete ${hospital.name}`}
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Board Members Tab ───────────────────────────────── */}
        {activeTab === "Board Members" && (
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <Heading level="h4" as="h2">
                Board Members
                <span className="ml-2 text-body text-slate-light font-normal">
                  ({members?.length ?? 0})
                </span>
              </Heading>
              <Button
                variant="secondary"
                onClick={() => setShowMemberForm(!showMemberForm)}
              >
                {showMemberForm ? "Cancel" : "Add New"}
              </Button>
            </div>

            {/* Add form */}
            {showMemberForm && (
              <div className="border-b border-surface-border bg-surface-bg p-6">
                <form onSubmit={handleCreateMember} className="space-y-4">
                  <Input
                    label="Name"
                    placeholder="Enter full name"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />
                  <Input
                    label="Role"
                    placeholder="e.g. Chairman, Trustee, Secretary"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                  />
                  <Textarea
                    label="Bio"
                    placeholder="Brief biography..."
                    value={memberBio}
                    onChange={(e) => setMemberBio(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={memberSubmitting}
                    >
                      {memberSubmitting ? "Creating..." : "Create Member"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            {membersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">Loading board members...</Text>
              </div>
            ) : !members || members.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">No board members yet.</Text>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="text-btn font-black text-primary">
                        {member.name}
                      </p>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal"
                      >
                        {member.role}
                      </Text>
                      {member.bio && (
                        <Text variant="secondary" className="mt-1 line-clamp-2">
                          {member.bio}
                        </Text>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member.id)}
                      className="ml-4 shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                      aria-label={`Delete ${member.name}`}
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Annual Reports Tab ──────────────────────────────── */}
        {activeTab === "Annual Reports" && (
          <div className="rounded-2xl border border-surface-border bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <Heading level="h4" as="h2">
                Annual Reports
                <span className="ml-2 text-body text-slate-light font-normal">
                  ({reports?.length ?? 0})
                </span>
              </Heading>
              <Button
                variant="secondary"
                onClick={() => setShowReportForm(!showReportForm)}
              >
                {showReportForm ? "Cancel" : "Add New"}
              </Button>
            </div>

            {/* Add form */}
            {showReportForm && (
              <div className="border-b border-surface-border bg-surface-bg p-6">
                <form onSubmit={handleCreateReport} className="space-y-4">
                  <Input
                    label="Year"
                    type="number"
                    placeholder="e.g. 2025"
                    value={reportYear}
                    onChange={(e) => setReportYear(e.target.value)}
                  />
                  <Input
                    label="Title"
                    placeholder="Enter report title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                  <Input
                    label="Download URL"
                    type="url"
                    placeholder="https://example.com/report.pdf"
                    value={reportUrl}
                    onChange={(e) => setReportUrl(e.target.value)}
                  />
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={reportSubmitting}
                    >
                      {reportSubmitting ? "Creating..." : "Create Report"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            {reportsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">Loading annual reports...</Text>
              </div>
            ) : !reports || reports.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <Text variant="secondary">No annual reports yet.</Text>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {reports.map((report, idx) => (
                  <div
                    key={`report-${report.year}-${idx}`}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="text-btn font-black text-primary">
                        {report.title}
                      </p>
                      <Text
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal"
                      >
                        Year: {report.year}
                      </Text>
                      <a
                        href={report.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label font-bold text-accent hover:text-accent-green transition-colors"
                      >
                        Download
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteReport(
                          (report as AnnualReport & { id?: string }).id ??
                            `${report.year}`,
                        )
                      }
                      className="ml-4 shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                      aria-label={`Delete ${report.title}`}
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
