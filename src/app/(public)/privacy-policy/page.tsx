import { PageHero } from "@/components/shared/page-hero";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { PolicySection, PolicyList, PolicyContact } from "@/components/legal/policy-section";

export const metadata = {
  title: "Privacy Policy | Surgery Care Foundation",
  description:
    "How Surgery Care Foundation collects, uses, stores and shares personal and medical information of donors and patients.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy"
        highlight="Policy"
        subtitle="How we collect, use and protect personal and medical information across donors and patients."
      />
      <TrustStrip />

      <div className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Text variant="muted" className="mb-10">
            Effective date: 9 May 2025
          </Text>

          <PolicySection title="1. Who this policy applies to">
            <Text variant="secondary">
              This Privacy Policy governs information handled by Surgery Care
              Foundation (&ldquo;the Foundation&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;) when you visit surgerycarefoundation.com,
              donate to a campaign, register as a campaigner on behalf of a
              patient, or otherwise interact with us. Two distinct sets of
              personal information are involved: information about
              <strong> donors and visitors</strong> on one hand, and
              <strong> patients and their families</strong> on the other.
              Different rules apply to each, set out below.
            </Text>
          </PolicySection>

          <PolicySection title="2. Donor and visitor information">
            <Text variant="secondary">
              When you donate or contact us we may collect:
            </Text>
            <PolicyList
              items={[
                "Identity information: full name, email address, phone number, postal address.",
                "PAN (Permanent Account Number) — collected only when you wish to claim 80G tax benefit. PAN is not stored beyond the period required by the Income Tax Act.",
                "Payment information: handled directly by our payment gateway (Razorpay). We do not store full card numbers, CVV, UPI PINs or net-banking credentials on our servers.",
                "Account information: hashed password and verification status, if you create a donor account.",
                "Device and usage information: IP address, browser type, device type, pages visited, referring URL, and cookie identifiers.",
              ]}
            />
          </PolicySection>

          <PolicySection title="3. Patient and family information">
            <Text variant="secondary">
              For every published campaign, the patient or an authorised family
              member must provide and consent in writing to the public use of
              certain personal and medical information, including: name, age,
              city, photographs, the medical condition, treating hospital,
              treating doctor (where consented), cost estimate and supporting
              medical documents. Sensitive medical records used internally for
              verification (diagnosis reports, hospital estimates, government
              ID) are stored in restricted-access storage and are
              <strong> not publicly displayed without explicit consent.</strong>
            </Text>
            <Text variant="secondary">
              For minors, written consent must be provided by a parent or
              legal guardian.
            </Text>
          </PolicySection>

          <PolicySection title="4. How we use the information">
            <PolicyList
              items={[
                "Process donations, issue payment receipts and generate 80G tax certificates.",
                "Verify campaigns, coordinate hospital admission and disburse funds directly to the treating hospital.",
                "Send transactional updates (donation receipts, campaign progress, surgery and recovery updates).",
                "Respond to donor enquiries, patient help requests and grievances.",
                "Comply with statutory obligations under the Income Tax Act, Companies Act / Societies / Trust Act (as applicable to our entity type), the Prevention of Money Laundering Act, 2002, and the Digital Personal Data Protection Act, 2023.",
                "Detect, prevent and investigate fraud or misuse of donations.",
              ]}
            />
          </PolicySection>

          <PolicySection title="5. With whom we share information">
            <PolicyList
              items={[
                "Treating hospital — patient and treatment information is shared only with the partnered hospital that performs the surgery, strictly to the extent needed for admission, billing and disbursement.",
                "Payment service providers — donor payment information is shared with Razorpay (or any successor processor) under their PCI-DSS-compliant terms.",
                "Tax and statutory authorities — when required to comply with the Income Tax Act, the Prevention of Money Laundering Act, the Foreign Contribution (Regulation) Act (where applicable) or any lawful order.",
                "Auditors and professional advisors — under written confidentiality obligations, for statutory audit and compliance review.",
                "We do not sell, rent, lease or trade donor or patient information to any third party for marketing.",
              ]}
            />
          </PolicySection>

          <PolicySection title="6. Payment and data security">
            <Text variant="secondary">
              Card, UPI and net-banking details are entered directly on the
              Razorpay-hosted payment surface. They are encrypted in transit
              over TLS, processed under PCI-DSS Level 1 controls, and never
              stored in our application database. Application-side data is
              encrypted at rest, access is restricted to authorised personnel,
              and authentication is enforced via hashed passwords and JSON Web
              Token sessions.
            </Text>
          </PolicySection>

          <PolicySection title="7. Cookies and analytics">
            <Text variant="secondary">
              We use first-party cookies for authentication and to remember
              your preferences. We use Meta (Facebook) Pixel and similar
              measurement tools to attribute donations to the campaigns and
              channels that drove them. You can disable cookies in your browser
              settings; doing so may break login and donation flows.
            </Text>
          </PolicySection>

          <PolicySection title="8. Data retention">
            <PolicyList
              items={[
                "Donation records, 80G receipts and KYC information are retained for at least 8 years from the end of the relevant financial year, as required by the Income Tax Act and audit norms.",
                "Patient medical records used for verification are retained for the life of the campaign plus 3 years, then archived or deleted.",
                "Site analytics and cookie identifiers are retained for up to 24 months.",
                "Records may be retained longer where required by law, court order, or for the establishment, exercise or defence of legal claims.",
              ]}
            />
          </PolicySection>

          <PolicySection title="9. Your rights">
            <Text variant="secondary">
              Subject to the Digital Personal Data Protection Act, 2023, you
              have the right to access the personal data we hold about you,
              request correction or completion, request erasure (where
              statutory retention does not apply), withdraw consent that you
              have previously given, and to nominate another individual to
              exercise these rights in the event of your death or incapacity.
              Requests are typically processed within 30 days. Reach us at the
              contact details below.
            </Text>
          </PolicySection>

          <PolicySection title="10. Children">
            <Text variant="secondary">
              Donor accounts are intended for individuals 18 years and older.
              For patient campaigns involving minors, all personal information,
              photographs and medical details are provided and consented to by
              a parent or legal guardian.
            </Text>
          </PolicySection>

          <PolicySection title="11. International transfers">
            <Text variant="secondary">
              Our primary servers are located in India. Some technology
              vendors (such as our hosting provider, error-monitoring and
              email-delivery services) may process limited operational data
              outside India under contractual safeguards equivalent to Indian
              law.
            </Text>
          </PolicySection>

          <PolicySection title="12. Grievance officer">
            <Text variant="secondary">
              In line with the Information Technology Act, 2000 and the Digital
              Personal Data Protection Act, 2023, the grievance officer for
              data-protection enquiries is reachable at{" "}
              <a
                href="mailto:info@surgerycarefoundation.com"
                className="font-medium text-accent underline underline-offset-2 hover:text-primary"
              >
                info@surgerycarefoundation.com
              </a>
              . We acknowledge complaints within 72 hours and aim to resolve
              them within 30 days.
            </Text>
          </PolicySection>

          <PolicySection title="13. Changes to this policy">
            <Text variant="secondary">
              We may revise this policy from time to time. The effective date
              at the top of this page reflects the most recent revision.
              Material changes will be communicated by email to registered
              donors at least 14 days before they take effect.
            </Text>
          </PolicySection>

          <PolicySection title="14. Contact">
            <Text variant="secondary">
              For any privacy-related question or to exercise your rights:
            </Text>
            <PolicyContact />
          </PolicySection>
        </Container>
      </div>
    </>
  );
}
