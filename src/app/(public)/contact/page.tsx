"use client";

import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/shared/page-hero";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhoneIcon, MapPinIcon, SendIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { contactService } from "@/services/contact.service";

export default function ContactPage() {
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const name = `${firstName} ${lastName}`.trim();
      await contactService.send({ name, email, subject, message });
      toast("Message sent! We'll get back to you soon.", "success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        title="Get in"
        highlight="Touch"
        subtitle="We are here to help. Reach out to us for any queries regarding donations, fundraisers, or partnerships."
      />
      <TrustStrip />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
            {/* Contact Form */}
            <div className="rounded-[40px] border border-surface-subtle bg-white p-8 shadow-[0px_20px_60px_0px_rgba(1,74,98,0.08)] md:p-[50px]">
              <Heading level="h3" as="h2" className="mb-8 text-[30px] leading-[36px]">
                Send us a message
              </Heading>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
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
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Subject"
                  placeholder="E.g., Donation Query"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <Textarea
                  label="Message"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  variant="secondary"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 rounded-[14px] text-[16px] font-black"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <SendIcon className="size-4" />}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 lg:w-[400px]">
              {/* Phone */}
              <div className="flex items-start gap-6 rounded-[32px] border border-surface-subtle bg-white p-8 shadow-[0px_10px_40px_0px_rgba(0,0,0,0.04)]">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-surface-green">
                  <PhoneIcon className="size-7 text-accent" />
                </span>
                <div>
                  <Heading level="h4" as="h3" className="mb-1 text-[20px]">
                    Call Us
                  </Heading>
                  <Text variant="secondary" className="mb-2 text-[16px]">
                    Mon-Fri from 9am to 6pm.
                  </Text>
                  <a
                    href="tel:+918815935091"
                    className="text-[18px] font-bold text-accent transition-colors hover:text-accent-green"
                  >
                    +91 88159 35091
                  </a>
                </div>
              </div>

              {/* Corporate Office */}
              <div className="rounded-[32px] bg-primary p-8 shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]">
                <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-white/10">
                  <MapPinIcon className="size-7 text-white" />
                </span>
                <Heading level="h4" as="h3" className="mb-4 text-[24px] leading-[32px] text-white">
                  Corporate Office
                </Heading>
                <Text className="text-[16px] leading-[26px] text-[rgba(236,253,245,0.85)]">
                  1st Floor, Plot No. 06, Katol Road,<br />
                  Falke Layout, Kolbaswami Nagar,<br />
                  Akar Nagar, Nagpur,<br />
                  Maharashtra 440013, India
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
