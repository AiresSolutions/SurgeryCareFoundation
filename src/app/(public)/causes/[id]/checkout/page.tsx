"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";
import { campaignService } from "@/services/campaign.service";
import { paymentService } from "@/services/payment.service";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockIcon } from "@/components/ui/icons";

const AMOUNTS = [1000, 5000, 10000] as const;

async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if ((window as Window & { Razorpay?: unknown }).Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: campaign, isLoading: campaignLoading } = useApi(
    () => campaignService.getBySlug(params.id),
    [params.id],
  );

  // Honour ?amount= deep-link from the mobile QuickDonateBar. Fall back
  // to the standard 5000 default if absent or non-positive. Custom amount
  // wins over preset, matching how the form already disambiguates.
  const initialAmount = (() => {
    const raw = searchParams.get("amount");
    const n = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : 5000;
  })();
  const isPresetAmount = (AMOUNTS as readonly number[]).includes(initialAmount);
  const [selectedAmount, setSelectedAmount] = useState<number>(
    isPresetAmount ? initialAmount : 5000,
  );
  const [customAmount, setCustomAmount] = useState(
    isPresetAmount ? "" : String(initialAmount === 5000 ? "" : initialAmount),
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const donationAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;

  async function handleSubmit() {
    if (!firstName.trim()) {
      toast("First name is required.", "error");
      return;
    }
    if (!email.trim()) {
      toast("Email address is required.", "error");
      return;
    }
    if (donationAmount <= 0) {
      toast("Please select or enter a donation amount.", "error");
      return;
    }
    if (!campaign) {
      toast("Campaign details are not loaded yet.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const donationPayload = {
        campaignId: campaign.id,
        amount: donationAmount,
        donorName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        donorEmail: email.trim(),
        isAnonymous,
      };

      let donation;
      let paymentIntent;
      if (user) {
        const initiation = await paymentService.createDonation(donationPayload);
        donation = initiation.donation;
        paymentIntent = initiation.paymentIntent;
      } else {
        donation = await paymentService.createGuestDonation(donationPayload);
        paymentIntent = await paymentService.createGuestIntent({
          donationId: donation.id,
          amount: donationAmount,
        });
      }

      if (!paymentIntent.clientData.key || !paymentIntent.clientData.order_id) {
        throw new Error("Payment gateway is not configured yet. Please try again later.");
      }

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error("Unable to load the payment gateway. Please try again.");
      }

      const Razorpay = (window as Window & {
        Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
      }).Razorpay;

      if (!Razorpay) {
        throw new Error("Payment gateway is unavailable right now.");
      }

      const razorpay = new Razorpay({
        key: paymentIntent.clientData.key,
        order_id: paymentIntent.clientData.order_id,
        amount: paymentIntent.clientData.amount,
        currency: paymentIntent.clientData.currency,
        name: paymentIntent.clientData.name,
        description: paymentIntent.clientData.description,
        prefill: {
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim(),
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await paymentService.verifyGuestPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            router.push(
              `/causes/${params.id}/thank-you?donationId=${donation.id}&amount=${donationAmount}&status=success`,
            );
          } catch (err) {
            toast(
              err instanceof Error
                ? err.message
                : "Payment was captured, but confirmation failed. Please contact support.",
              "error",
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        theme: {
          color: "#014A62",
        },
      });

      razorpay.open();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
        "error",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-8 md:py-12">
      <Container>
        <Link
          href={`/causes/${params.id}`}
          className="mb-2 inline-flex items-center gap-1 text-btn font-bold text-slate-medium transition-colors hover:text-primary"
        >
          <span aria-hidden="true">&larr;</span> Back to Cause
        </Link>
        <Heading level="h2" as="h1" className="mb-8">
          Secure Checkout
        </Heading>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
              <fieldset className="mb-8">
                <legend className="mb-4 text-label uppercase text-slate-light">
                  Select Donation Amount
                </legend>
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                      }}
                      className={cn(
                        "rounded-full border py-3 text-btn font-bold transition-colors",
                        selectedAmount === amt && !customAmount
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-surface-border text-primary hover:border-accent",
                      )}
                    >
                      &#8377; {formatINR(amt)}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="&#8377; Other Amount"
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                />
              </fieldset>

              <Heading level="h4" as="h2" className="mb-4">
                Personal Details
              </Heading>
              <div className="mb-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(event) => setIsAnonymous(event.target.checked)}
                    className="size-4 rounded border-surface-border accent-accent"
                  />
                  <Text variant="secondary" as="span">
                    Make my donation anonymous
                  </Text>
                </label>
              </div>

              <div className="mb-6 rounded-xl bg-surface-page px-6 py-4">
                <Text variant="secondary" className="text-center">
                  You&apos;ll be taken to Razorpay to complete your payment securely.
                </Text>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Opening Payment..."
                  : `Complete Donation of \u20B9${formatINR(donationAmount)}`}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-slate-light">
                <LockIcon className="size-4" />
                <Text as="span" variant="muted" size="label" className="normal-case tracking-normal">
                  256-bit Secure Encryption
                </Text>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-32 rounded-2xl border border-surface-border bg-white p-6 shadow-card">
              <Heading level="h4" as="h2" className="mb-4">
                Donation Summary
              </Heading>

              <div className="mb-6 flex items-center gap-3 border-b border-surface-border pb-6">
                {campaignLoading ? (
                  <div className="flex-1 animate-pulse space-y-2">
                    <div className="h-3 w-16 rounded bg-surface-border" />
                    <div className="h-4 w-32 rounded bg-surface-border" />
                    <div className="h-3 w-20 rounded bg-surface-border" />
                  </div>
                ) : campaign ? (
                  <>
                    {campaign.coverImageUrl ? (
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={campaign.coverImageUrl}
                          alt={campaign.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-surface-page">
                        <Text variant="muted" className="text-h4 font-black">
                          {campaign.title.charAt(0)}
                        </Text>
                      </div>
                    )}
                    <div>
                      <Text variant="muted" size="label" className="normal-case tracking-normal">
                        Supporting
                      </Text>
                      <p className="text-btn font-black text-primary">{campaign.title}</p>
                      <Text variant="muted" size="label" className="normal-case tracking-normal">
                        {campaign.category}
                      </Text>
                    </div>
                  </>
                ) : (
                  <Text variant="secondary">Campaign not found</Text>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text variant="secondary">Donation Amount</Text>
                  <Text className="font-bold">&#8377; {formatINR(donationAmount)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="secondary">Platform Fee (0%)</Text>
                  <Text className="font-bold">&#8377; 0</Text>
                </div>
                <div className="flex justify-between border-t border-surface-border pt-3">
                  <p className="text-btn-lg font-black text-primary">Total</p>
                  <p className="text-btn-lg font-black text-accent">
                    &#8377; {formatINR(donationAmount)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
