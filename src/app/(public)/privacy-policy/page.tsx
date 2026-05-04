import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export const metadata = {
  title: "Privacy Policy | Surgery Care Foundation",
  description:
    "Learn how Surgery Care Foundation collects, uses, and protects your personal information.",
};

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <Heading level="h4" as="h2" className="mb-4">
        {title}
      </Heading>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy"
        highlight="Policy"
        subtitle="Your privacy matters to us. This policy explains how we handle your personal information."
      />

      <div className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Text variant="muted" className="mb-10">
            Last updated: March 18, 2026
          </Text>

          <PolicySection title="1. Information We Collect">
            <Text variant="secondary">
              We collect information you provide directly when you make a
              donation, create an account, contact us, or sign up for our
              newsletter. This may include your name, email address, phone
              number, postal address, and payment information.
            </Text>
            <Text variant="secondary">
              We also automatically collect certain technical information when
              you visit our website, such as your IP address, browser type,
              device information, and pages visited, through cookies and similar
              technologies.
            </Text>
          </PolicySection>

          <PolicySection title="2. How We Use Your Information">
            <Text variant="secondary">
              We use the information we collect to:
            </Text>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <Text variant="secondary" as="span">
                  Process your donations and send receipts
                </Text>
              </li>
              <li>
                <Text variant="secondary" as="span">
                  Create and manage your account
                </Text>
              </li>
              <li>
                <Text variant="secondary" as="span">
                  Send you updates about campaigns you have supported
                </Text>
              </li>
              <li>
                <Text variant="secondary" as="span">
                  Respond to your enquiries and provide support
                </Text>
              </li>
              <li>
                <Text variant="secondary" as="span">
                  Improve our website and services
                </Text>
              </li>
              <li>
                <Text variant="secondary" as="span">
                  Comply with legal obligations
                </Text>
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Payment Security">
            <Text variant="secondary">
              All payment transactions are processed through secure,
              PCI-compliant payment gateways. We do not store your full credit
              card or bank account details on our servers. Your financial data is
              encrypted during transmission using industry-standard SSL/TLS
              protocols.
            </Text>
          </PolicySection>

          <PolicySection title="4. Information Sharing">
            <Text variant="secondary">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information only in the following
              circumstances:
            </Text>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <Text variant="secondary" as="span">
                  With trusted service providers who assist us in operating our
                  website and processing donations
                </Text>
              </li>
              <li>
                <Text variant="secondary" as="span">
                  When required by law, regulation, or legal process
                </Text>
              </li>
              <li>
                <Text variant="secondary" as="span">
                  To protect the rights, safety, or property of Surgery Care
                  Foundation, our users, or the public
                </Text>
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Cookies">
            <Text variant="secondary">
              Our website uses cookies to enhance your browsing experience,
              analyse site traffic, and understand where our visitors come from.
              You can control cookies through your browser settings. Disabling
              cookies may affect certain features of the website.
            </Text>
          </PolicySection>

          <PolicySection title="6. Data Retention">
            <Text variant="secondary">
              We retain your personal information for as long as necessary to
              fulfil the purposes outlined in this policy, or as required by
              law. Donation records are retained as required under applicable tax
              and charitable regulations.
            </Text>
          </PolicySection>

          <PolicySection title="7. Your Rights">
            <Text variant="secondary">
              You have the right to access, correct, or delete your personal
              information. You may also opt out of receiving promotional
              communications at any time. To exercise these rights, contact us
              at{" "}
              <a
                href="mailto:info@surgerycare.in"
                className="font-medium text-accent underline underline-offset-2 hover:text-primary"
              >
                info@surgerycare.in
              </a>
              .
            </Text>
          </PolicySection>

          <PolicySection title="8. Children&rsquo;s Privacy">
            <Text variant="secondary">
              Our website is not intended for children under the age of 18. We
              do not knowingly collect personal information from children. If you
              believe we have inadvertently collected such information, please
              contact us so we can promptly remove it.
            </Text>
          </PolicySection>

          <PolicySection title="9. Changes to This Policy">
            <Text variant="secondary">
              We may update this privacy policy from time to time. Any changes
              will be posted on this page with an updated revision date. We
              encourage you to review this policy periodically.
            </Text>
          </PolicySection>

          <PolicySection title="10. Contact Us">
            <Text variant="secondary">
              If you have any questions or concerns about this privacy policy,
              please contact us:
            </Text>
            <div className="rounded-2xl border border-surface-subtle bg-surface-bg p-6">
              <Text variant="secondary">
                <strong className="text-primary">
                  Surgery Care Foundation
                </strong>
                <br />
                1st Floor, Plot No. 06, Katol Road,
                <br />
                Falke Layout, Kolbaswami Nagar,
                <br />
                Akar Nagar, Nagpur, Maharashtra 440013
                <br />
                Email:{" "}
                <a
                  href="mailto:info@surgerycare.in"
                  className="font-medium text-accent underline underline-offset-2 hover:text-primary"
                >
                  info@surgerycare.in
                </a>
                <br />
                Phone:{" "}
                <a
                  href="tel:+919960513453"
                  className="font-medium text-accent underline underline-offset-2 hover:text-primary"
                >
                  +91 9960513453
                </a>
              </Text>
            </div>
          </PolicySection>
        </Container>
      </div>
    </>
  );
}
