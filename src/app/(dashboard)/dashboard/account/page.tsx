"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { FormSection } from "@/components/ui/form-section";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { useApi } from "@/hooks/use-api";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";

function calculateCompletion(fields: Array<string | null | undefined>) {
  const complete = fields.filter((value) => Boolean(value?.trim())).length;
  return Math.round((complete / fields.length) * 100);
}

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading } = useApi(() => userService.getProfile(), []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setPhone(profile.phone ?? "");
    setOrganizationName(profile.creatorProfile?.organizationName ?? "");
    setBio(profile.creatorProfile?.bio ?? "");
    setWebsite(profile.creatorProfile?.website ?? "");
    setPanNumber(profile.creatorProfile?.panNumber ?? "");
    setBankAccountName(profile.creatorProfile?.bankAccountName ?? "");
    setBankAccountNumber(profile.creatorProfile?.bankAccountNumber ?? "");
    setBankIfsc(profile.creatorProfile?.bankIfsc ?? "");
    setBankName(profile.creatorProfile?.bankName ?? "");
  }, [profile]);

  const initials = user
    ? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`
    : "";
  const completion = calculateCompletion([
    firstName,
    lastName,
    phone,
    organizationName,
    panNumber,
    bankAccountName,
    bankAccountNumber,
    bankIfsc,
    bankName,
  ]);

  async function handleSaveAll(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await userService.updateProfile({
        firstName,
        lastName,
        phone: phone || undefined,
      });

      await userService.updateCreatorProfile({
        organizationName: organizationName || undefined,
        bio: bio || undefined,
        website: website || undefined,
        panNumber: panNumber || undefined,
        bankAccountName: bankAccountName || undefined,
        bankAccountNumber: bankAccountNumber || undefined,
        bankIfsc: bankIfsc || undefined,
        bankName: bankName || undefined,
      });

      updateUser({ firstName, lastName, phone: phone || null });
      toast("Your profile has been updated.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save changes.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast("Please fill in all password fields.", "error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast("New password and confirmation do not match.", "error");
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast("Password updated successfully.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to change password.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <div>
      <Heading level="h2" as="h1" className="mb-1">
        Account &amp; Profile
      </Heading>
      <Text variant="secondary" className="mb-8">
        Manage the profile fields that are currently backed by the live API.
      </Text>

      <div className="mb-8 flex items-center gap-6 rounded-2xl border border-surface-border bg-white p-6 shadow-card">
        <Avatar initials={initials || "??"} src={user?.avatarUrl ?? undefined} size="lg" />
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <Heading level="h4" as="h2">
              Profile Completion
            </Heading>
            <Text className="font-black text-accent">{completion}%</Text>
          </div>
          <ProgressBar value={completion} className="mb-2" />
          <Text variant="muted">
            Personal details and creator banking fields are now connected. Extra KYC and address
            placeholders have been removed until backend support exists.
          </Text>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-surface-border bg-white p-10 shadow-card">
          <Text variant="secondary">Loading your profile...</Text>
        </div>
      ) : (
        <>
          <form onSubmit={handleSaveAll}>
            <FormSection icon="👤" title="Personal Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Email Address" value={profile?.email ?? ""} disabled readOnly />
                <Input
                  label="Primary Phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </FormSection>

            <FormSection icon="🏢" title="Creator Profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Organization Name"
                  value={organizationName}
                  onChange={(event) => setOrganizationName(event.target.value)}
                />
                <Input
                  label="Website"
                  type="url"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>
              <Input
                label="Bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
            </FormSection>

            <FormSection icon="🏦" title="Financial Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="PAN Number"
                  value={panNumber}
                  onChange={(event) => setPanNumber(event.target.value)}
                />
                <Input
                  label="Bank Name"
                  value={bankName}
                  onChange={(event) => setBankName(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Account Holder Name"
                  value={bankAccountName}
                  onChange={(event) => setBankAccountName(event.target.value)}
                />
                <Input
                  label="Account Number"
                  value={bankAccountNumber}
                  onChange={(event) => setBankAccountNumber(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="IFSC"
                  value={bankIfsc}
                  onChange={(event) => setBankIfsc(event.target.value)}
                />
                <Input
                  label="KYC Status"
                  value={profile?.creatorProfile?.kycStatus ?? "pending"}
                  disabled
                  readOnly
                />
              </div>
            </FormSection>

            <div className="mt-6">
              <Button type="submit" variant="secondary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          <form onSubmit={handleChangePassword} className="mt-10">
            <FormSection icon="🔒" title="Change Password">
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <Input
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                />
              </div>
            </FormSection>

            <div className="mt-6">
              <Button type="submit" variant="outline" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
