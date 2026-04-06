"use client";

import { useState, useEffect, FormEvent } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { FormSection } from "@/components/ui/form-section";
import { CheckIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";

const VERIFICATION_ITEMS = [
  { label: "Active", status: true },
  { label: "Eligible", status: true },
  { label: "Eligible", status: false },
  { label: "Today", status: false },
] as const;

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // ── Personal fields ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // ── Financial fields (creator profile) ──
  const [panNumber, setPanNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("");

  // ── Change password fields ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ── Loading states ──
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Populate form from user on mount / user change
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  // Derive initials from user name
  const initials = user
    ? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`
    : "";

  // ── Save All Changes ──
  async function handleSaveAll(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Update core profile
      await userService.updateProfile({
        firstName,
        lastName,
        phone: phone || undefined,
      });

      // 2. If any financial field has a value, update creator profile too
      const hasFinancialData =
        panNumber || bankAccountName || bankAccountNumber || bankIfsc || bankName;

      if (hasFinancialData) {
        await userService.updateCreatorProfile({
          panNumber: panNumber || undefined,
          bankAccountName: bankAccountName || undefined,
          bankAccountNumber: bankAccountNumber || undefined,
          bankIfsc: bankIfsc || undefined,
          bankName: bankName || undefined,
        });
      }

      // 3. Sync auth context
      updateUser({ firstName, lastName, phone: phone || null });

      toast("Your changes have been saved successfully.", "success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes. Please try again.";
      toast(message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  // ── Change Password ──
  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast("Password updated successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to change password. Please try again.";
      toast(message, "error");
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <div>
      <Heading level="h2" as="h1" className="mb-1">Account &amp; Profile</Heading>
      <Text variant="secondary" className="mb-8">Manage your personal details, verification, and preferences.</Text>

      {/* Profile Completion */}
      <div className="mb-8 flex items-center gap-6 rounded-2xl border border-surface-border bg-white p-6 shadow-card">
        <Avatar
          initials={initials || "??"}
          src={user?.avatarUrl ?? undefined}
          size="lg"
        />
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <Heading level="h4" as="h2">Profile Completion</Heading>
            <Text className="font-black text-accent">89%</Text>
          </div>
          <ProgressBar value={89} className="mb-2" />
          <Text variant="muted">Complete your KYC and upload emergency contacts to reach 100%.</Text>
        </div>
      </div>

      {/* Verification badges (visual-only) */}
      <div className="mb-8 flex flex-wrap gap-3">
        {VERIFICATION_ITEMS.map(({ label, status }, i) => (
          <div key={i} className="flex items-center gap-2 rounded-2xl border border-surface-border bg-white px-4 py-3 shadow-card">
            <span className={`flex size-8 items-center justify-center rounded-full ${status ? "bg-accent/10" : "bg-surface-page"}`}>
              <CheckIcon className={`size-4 ${status ? "text-accent" : "text-slate-light"}`} />
            </span>
            <Badge variant={status ? "success" : "outline"}>{label}</Badge>
          </div>
        ))}
      </div>

      <form onSubmit={handleSaveAll}>
        {/* Personal Details */}
        <FormSection icon="👤" title="Personal Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email Address"
              placeholder="johndoe@example.com"
              value={user?.email ?? ""}
              disabled
              readOnly
            />
            <Input
              label="Primary Phone"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Alternate Phone (Optional)" placeholder="+91" disabled />
            <Input label="Date of Birth" placeholder="" disabled />
            <Input label="Preferred Language" placeholder="" disabled />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Gender" placeholder="Male" disabled />
            <Input label="Blood Group" placeholder="" disabled />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Occupation" placeholder="Software Engineer" disabled />
            <Input label="Organization Name" placeholder="TechCorp India" disabled />
          </div>
        </FormSection>

        {/* Address (no backend mapping — read-only placeholders) */}
        <FormSection icon="📍" title="Address & Location">
          <Input label="Full Residential Address" placeholder="" disabled />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="City" placeholder="Mumbai" disabled />
            <Input label="District" placeholder="Mumbai Suburban" disabled />
            <Input label="Postal Code" placeholder="400050" disabled />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="State" placeholder="Maharashtra" disabled />
            <Input label="Country" placeholder="India" disabled />
            <Input label="Nationality" placeholder="Indian" disabled />
          </div>
        </FormSection>

        {/* Identity & KYC (no backend mapping — read-only placeholders) */}
        <FormSection icon="🪪" title="Identity & KYC">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="ID Proof Type" placeholder="" disabled />
            <Input label="ID Proof Number" placeholder="XXXX-XXXX-XXXX" disabled />
          </div>
          <div className="rounded-xl bg-accent/5 border border-accent/20 px-4 py-3">
            <Text className="text-accent font-bold">
              ✓ Your identity is verified. To update your ID proof, please contact support.
            </Text>
          </div>
        </FormSection>

        {/* Financial Details */}
        <FormSection icon="🏦" title="Financial Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Linked Bank Name"
              placeholder="HDFC Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <Input
              label="Account Number"
              placeholder="Enter account number"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="PAN Card No."
              placeholder="ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
            />
            <Input
              label="Account Holder Name"
              placeholder="Add beneficiary name"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="IFSC Code"
              placeholder="HDFC0001234"
              value={bankIfsc}
              onChange={(e) => setBankIfsc(e.target.value)}
            />
          </div>
        </FormSection>

        {/* Save */}
        <div className="mt-8 flex justify-end">
          <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="mt-4">
        <FormSection icon="🔒" title="Change Password">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <div>{/* spacer for grid alignment */}</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              error={passwordError || undefined}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="lg" type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </FormSection>
      </form>
    </div>
  );
}
