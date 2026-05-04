"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailIcon, LockIcon, ArrowRightIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api-error";
import { useToast } from "@/components/ui/toast";
import { getDefaultAppRoute } from "@/lib/get-default-app-route";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await register({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        password,
      });
      const greetName = session.firstName?.trim() || session.email;
      toast(`Welcome, ${greetName}! Your account has been created.`, "success");
      router.push(getDefaultAppRoute(session.roles));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-112px)] lg:grid-cols-2">
      {/* Left — Hero Image */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/mission.jpg"
          alt="Child patient receiving care at Surgery Care Foundation"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      {/* Right — Register Form */}
      <div className="flex items-center justify-center bg-surface-page px-4 py-16">
        <div className="w-full max-w-md">
          <Heading level="h2" as="h1" className="mb-3">
            Create Account
          </Heading>
          <Text variant="secondary" size="body-lg" className="mb-10">
            Join us and start making an impact today.
          </Text>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-body text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<MailIcon className="size-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Phone (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<LockIcon className="size-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<LockIcon className="size-5" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />

            <Button
              variant="secondary"
              size="lg"
              type="submit"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
              {!isSubmitting && <ArrowRightIcon className="size-5" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-body text-slate-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-accent transition-colors hover:text-accent-green"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
