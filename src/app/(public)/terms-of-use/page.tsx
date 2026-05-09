import { PageHero } from "@/components/shared/page-hero";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { PolicySection, PolicyList, PolicyContact } from "@/components/legal/policy-section";

export const metadata = {
  title: "Terms of Use | Surgery Care Foundation",
  description:
    "Terms governing the use of Surgery Care Foundation's website, donations, and patient campaigns.",
};

export default function TermsOfUsePage() {
  return (
    <>
      <PageHero
        title="Terms of"
        highlight="Use"
        subtitle="The rules that govern donating, listing a patient case, and using surgerycarefoundation.com."
      />
      <TrustStrip />

      <div className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Text variant="muted" className="mb-10">
            Effective date: 9 May 2025
          </Text>

          <PolicySection title="1. Acceptance of these terms">
            <Text variant="secondary">
              By accessing or using surgerycarefoundation.com (the
              &ldquo;Site&rdquo;), donating to a campaign, or listing a patient
              case, you agree to be bound by these Terms of Use, our Privacy
              Policy, Donation Policy, Refund Policy, Disclaimer and AML
              Policy. If you do not agree, please do not use the Site.
            </Text>
          </PolicySection>

          <PolicySection title="2. Who may use the Site">
            <PolicyList
              items={[
                "You must be 18 years or older and competent to enter into a binding contract under Indian law.",
                "If you are donating, the funds you contribute must be lawfully obtained and not the proceeds of any criminal activity.",
                "If you are listing a patient case, you must either be the patient or have written authorisation from the patient or their legal guardian.",
              ]}
            />
          </PolicySection>

          <PolicySection title="3. Role of the Foundation">
            <Text variant="secondary">
              Surgery Care Foundation is a registered non-profit organisation
              that raises funds for verified medical surgeries on behalf of
              patients who cannot afford treatment. The Foundation is
              <strong> not a hospital, not a medical practitioner, and does
              not itself provide medical care.</strong> Surgical care is
              delivered by independent partner hospitals. The Foundation acts
              as the bridge between donors and the treating hospital and
              releases donated funds directly to the hospital&rsquo;s account
              against an invoice.
            </Text>
          </PolicySection>

          <PolicySection title="4. Donor obligations">
            <PolicyList
              items={[
                "Provide accurate name, contact details and PAN (where required for 80G).",
                "Make donations only through the payment options offered on the Site.",
                "Not attempt to circumvent payment authentication, gateway controls, or to use stolen or unauthorised payment instruments.",
                "Acknowledge that donations are voluntary contributions and, except for the narrow refund window described in our Refund Policy, are non-refundable.",
              ]}
            />
          </PolicySection>

          <PolicySection title="5. Patient and campaigner obligations">
            <PolicyList
              items={[
                "All medical information, photographs and supporting documents submitted must be true, current, and submitted with the patient's (or guardian's) written consent.",
                "Submission of forged documents, inflated cost estimates or misrepresentation of the patient's circumstances is strictly prohibited and may be reported to the police.",
                "The campaigner authorises the Foundation to disburse raised funds directly to the treating hospital, and not to any personal or family bank account.",
                "The campaigner authorises the Foundation to publish update information (pre-surgery, surgery completed, recovery, discharge) for the benefit of donors who have supported the campaign.",
              ]}
            />
          </PolicySection>

          <PolicySection title="6. Verification and listing">
            <Text variant="secondary">
              Every campaign undergoes review by the Foundation&rsquo;s team
              before going live. Verification typically covers identity,
              medical diagnosis, hospital cost estimate, hospital
              accreditation, and the family&rsquo;s financial situation. The
              Foundation reserves the right to decline, pause, modify or
              remove any campaign without notice if information is incomplete,
              suspect, or in breach of these Terms.
            </Text>
          </PolicySection>

          <PolicySection title="7. Use of funds">
            <PolicyList
              items={[
                "Donations earmarked for a specific patient are first applied to the surgical bill of that patient at the partner hospital.",
                "If a campaign closes before reaching its goal and the patient's surgery does not proceed, the Foundation will offer the donor the option to reallocate the contribution to a similar critical case or to the general patient-care fund.",
                "If raised funds exceed the final hospital invoice, the surplus is applied to the next critical case in the same category, with disclosure on the campaign page.",
                "The Foundation does not deduct any platform fee or commission from donor contributions.",
              ]}
            />
          </PolicySection>

          <PolicySection title="8. Acceptable use of the Site">
            <Text variant="secondary">You agree not to:</Text>
            <PolicyList
              items={[
                "Use the Site for any unlawful, fraudulent or harmful purpose.",
                "Impersonate any person, patient or family, or misrepresent your affiliation with any individual or entity.",
                "Upload viruses, malicious code, scrapers or attempt to gain unauthorised access to any part of the Site or back-end systems.",
                "Reproduce, distribute or commercially exploit content (text, photographs, medical documents, donor data) from the Site without prior written permission.",
              ]}
            />
          </PolicySection>

          <PolicySection title="9. Intellectual property">
            <Text variant="secondary">
              All content on the Site that is not user-submitted (the
              Foundation&rsquo;s name, logo, written content, design, source
              code, and graphics) is the property of Surgery Care Foundation
              or its licensors and is protected by Indian copyright and
              trademark law. User-submitted patient content remains the
              property of the patient/guardian, who grants the Foundation a
              limited licence to publish it for the campaign&rsquo;s purpose.
            </Text>
          </PolicySection>

          <PolicySection title="10. Reporting fraud or abuse">
            <Text variant="secondary">
              If you believe a campaign on the Site is fraudulent,
              misleading, or in breach of these Terms, write to{" "}
              <a
                href="mailto:info@surgerycarefoundation.com"
                className="font-medium text-accent underline underline-offset-2 hover:text-primary"
              >
                info@surgerycarefoundation.com
              </a>{" "}
              with the campaign URL and the reason for your concern. We aim to
              acknowledge such reports within 5 business days and to complete
              an investigation within 15 business days.
            </Text>
          </PolicySection>

          <PolicySection title="11. Disclaimer and limitation of liability">
            <Text variant="secondary">
              The Site and the Foundation&rsquo;s services are provided on an
              &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. The
              Foundation makes no warranty as to surgical outcomes, any
              hospital&rsquo;s clinical decisions, or third-party services. To
              the fullest extent permitted by law, the Foundation&rsquo;s
              total liability arising from your use of the Site shall not
              exceed the amount you have donated in the preceding twelve
              months. See our Disclaimer for further details.
            </Text>
          </PolicySection>

          <PolicySection title="12. Termination">
            <Text variant="secondary">
              We may suspend or terminate your account or your access to the
              Site at our discretion if you breach these Terms. You may close
              your donor account at any time by writing to us; statutory
              records (donations, 80G receipts) will be retained as required
              by law.
            </Text>
          </PolicySection>

          <PolicySection title="13. Governing law and jurisdiction">
            <Text variant="secondary">
              These Terms are governed by the laws of India. Any dispute
              arising out of or in connection with these Terms shall be
              subject to the exclusive jurisdiction of the courts at Nagpur,
              Maharashtra.
            </Text>
          </PolicySection>

          <PolicySection title="14. Changes">
            <Text variant="secondary">
              We may update these Terms from time to time. The effective date
              at the top reflects the most recent revision. Material changes
              that affect donor or campaigner rights will be communicated by
              email to registered users.
            </Text>
          </PolicySection>

          <PolicySection title="15. Contact">
            <PolicyContact />
          </PolicySection>
        </Container>
      </div>
    </>
  );
}
