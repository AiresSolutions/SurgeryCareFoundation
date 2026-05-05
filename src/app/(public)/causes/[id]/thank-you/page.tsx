"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { CheckCircleIcon, GridIcon, ShareIcon } from "@/components/ui/icons";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const status = searchParams.get("status");
  const amount = amountParam ? parseInt(amountParam, 10) : null;
  const { toast } = useToast();

  useEffect(() => {
    if (status !== "success") return;
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq !== "function") return;
    if (amount && amount > 0) {
      fbq("track", "Purchase", { value: amount, currency: "INR" });
    } else {
      fbq("track", "Purchase");
    }
  }, [status, amount]);

  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined" ? `${window.location.origin}/causes` : "/causes";
    const shareText = "I just donated to a life-saving surgery on Surgery Care Foundation. Join me. Every contribution helps a patient get the care they need.";
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: "Surgery Care Foundation",
          text: shareText,
          url: shareUrl,
        });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast("Link copied to clipboard", "success");
      }
    } catch (err) {
      // User dismissed the native share sheet — silent.
      if ((err as DOMException)?.name === "AbortError") return;
      toast("Could not share. Try copying the link manually.", "error");
    }
  }

  return (
    <section className="bg-surface-page py-12 md:py-32">
      <Container className="flex justify-center">
        <div className="relative w-full max-w-lg text-center">
          {/* Check icon */}
          <div className="mx-auto -mb-7 flex size-14 items-center justify-center rounded-full bg-accent shadow-lg">
            <CheckCircleIcon className="size-7 text-white" />
          </div>

          <div className="rounded-2xl border border-surface-border bg-white px-6 pb-8 pt-12 shadow-card sm:px-8 sm:pt-14">
            <Heading level="h2" as="h1" className="mb-4">
              Thank You!
            </Heading>

            <Text variant="secondary" className="mb-6">
              {status === "success" && amount && amount > 0 ? (
                <>
                  Your generous donation of{" "}
                  <span className="font-bold text-accent">
                    &#8377;{formatINR(amount)}
                  </span>{" "}
                  has been successfully processed. You have just made a massive
                  difference in someone&apos;s life.
                </>
              ) : status === "success" ? (
                <>
                  Your generous donation has been successfully processed. You have
                  just made a massive difference in someone&apos;s life.
                </>
              ) : amount && amount > 0 ? (
                <>
                  Your payment window has completed for{" "}
                  <span className="font-bold text-accent">
                    &#8377;{formatINR(amount)}
                  </span>
                  . We&apos;ll email your receipt as soon as the payment is confirmed.
                </>
              ) : (
                <>
                  Your payment was submitted. We&apos;ll email your receipt as soon as the
                  donation is confirmed.
                </>
              )}
            </Text>

            {/* Receipt notice */}
            <div className="mb-8 rounded-xl bg-surface-page px-4 py-4 sm:px-6">
              <p className="flex items-center justify-center gap-2 text-btn font-bold text-primary">
                <span className="text-red-500" aria-hidden="true">&#10084;</span>
                {status === "success"
                  ? "An email receipt has been sent to you."
                  : "We will send your email receipt once payment is confirmed."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "secondary", className: "w-full gap-2 sm:w-auto" })}
              >
                <GridIcon className="size-4" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleShare}
                className={buttonVariants({ variant: "outline", className: "w-full gap-2 sm:w-auto" })}
              >
                <ShareIcon className="size-4" />
                Share Impact
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
