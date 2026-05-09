import { PageHero } from "@/components/shared/page-hero";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { PolicySection, PolicyList, PolicyContact } from "@/components/legal/policy-section";

export const metadata = {
  title: "Anti-Money Laundering Policy | Surgery Care Foundation",
  description:
    "How Surgery Care Foundation prevents the misuse of charitable donations under the Prevention of Money Laundering Act and related Indian regulations.",
};

export default function AmlPolicyPage() {
  return (
    <>
      <PageHero
        title="Anti-Money"
        highlight="Laundering Policy"
        subtitle="How we prevent the misuse of charitable donations and comply with Indian AML and counter-terrorism financing law."
      />
      <TrustStrip />

      <div className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Text variant="muted" className="mb-10">
            Effective date: 9 May 2025
          </Text>

          <PolicySection title="1. Purpose">
            <Text variant="secondary">
              Surgery Care Foundation is committed to ensuring that donations
              received through the Site are not used to launder money,
              finance terrorism, or fund any other illegal activity. This
              Anti-Money Laundering (AML) Policy sets out the standards we
              follow in line with the Prevention of Money Laundering Act,
              2002 (PMLA), the Unlawful Activities (Prevention) Act, 1967, the
              Foreign Contribution (Regulation) Act, 2010 (FCRA, where
              applicable), and the Reserve Bank of India&rsquo;s
              KYC/AML directions applicable to payment aggregators.
            </Text>
          </PolicySection>

          <PolicySection title="2. Scope">
            <Text variant="secondary">
              This policy applies to every donation received through the
              Site, every donor, every campaigner, and every employee,
              volunteer or contractor of the Foundation who handles donor or
              patient information.
            </Text>
          </PolicySection>

          <PolicySection title="3. Donor identification (KYC)">
            <PolicyList
              items={[
                "All digital donations are processed through Razorpay, which performs KYC of the underlying payment instrument under RBI directions.",
                "For donations of Rs. 50,000 or more in a single transaction, the gateway may require additional KYC (PAN, address proof) before completing the transaction.",
                "We collect PAN at donation time when the donor wishes to claim 80G tax benefit; PAN is verified against the IT Department's portal where required.",
                "Cash donations are not accepted through the Site, in any amount.",
              ]}
            />
          </PolicySection>

          <PolicySection title="4. Campaigner due diligence">
            <PolicyList
              items={[
                "Patient identity is verified using a government-issued photo ID (Aadhaar, PAN, voter ID or passport).",
                "Hospital identity, accreditation status and bank account details (for disbursement) are independently verified before any disbursement.",
                "Medical documents (diagnosis report, hospital cost estimate, prescription) are reviewed by our team and, where needed, confirmed directly with the hospital.",
                "Repeat campaigns or unusually large estimates are escalated for senior review before listing.",
              ]}
            />
          </PolicySection>

          <PolicySection title="5. Suspicious-transaction monitoring">
            <Text variant="secondary">
              Our team and our payment gateway monitor donation patterns for
              indicators of potential abuse, including:
            </Text>
            <PolicyList
              items={[
                "A single donor making structured donations just below KYC thresholds.",
                "Donations from sanctioned individuals or entities, or from politically exposed persons (PEPs) without supporting context.",
                "Donor and campaigner banking details that match in suspicious ways.",
                "Sudden, unexplained spikes in donation volume from a single source.",
                "Requests to refund a recent donation to a different account from the one that originated the donation.",
              ]}
            />
          </PolicySection>

          <PolicySection title="6. Reporting obligations">
            <Text variant="secondary">
              Where we have reasonable grounds to suspect money laundering or
              terrorism financing, we will, in coordination with our payment
              gateway and after legal advice where required, file a Suspicious
              Transaction Report (STR) with the Financial Intelligence
              Unit&nbsp;&ndash;&nbsp;India (FIU-IND) under the PMLA framework.
              The Foundation will also cooperate with any lawful enquiry from
              Indian regulators, the Income Tax Department, the Enforcement
              Directorate or other competent authorities.
            </Text>
          </PolicySection>

          <PolicySection title="7. Sanctions and PEP screening">
            <Text variant="secondary">
              Donor names flagged by the payment gateway against Indian
              sanctions lists, the United Nations Security Council Consolidated
              Sanctions List, or politically-exposed-person (PEP) databases
              are escalated for review. Where required, the donation will be
              held, returned to source, or reported as set out in Section 6.
            </Text>
          </PolicySection>

          <PolicySection title="8. Record retention">
            <Text variant="secondary">
              In line with Section 12 of the PMLA, records relating to
              donations, KYC, campaigner due diligence, disbursement to
              hospitals and any STR filings are retained for a minimum of
              five (5) years from the date of the transaction or the date of
              completion of the relevant client relationship, whichever is
              later. Records are stored in restricted-access systems with
              appropriate audit logging.
            </Text>
          </PolicySection>

          <PolicySection title="9. Foreign donations">
            <Text variant="secondary">
              The Foundation accepts foreign-source donations only if and
              when it holds a valid FCRA registration. Until then, any
              foreign contribution received in error is returned to the
              source. Where the Foundation is FCRA-registered in the future,
              foreign contributions will be received only into the designated
              FCRA bank account at the State Bank of India, New Delhi Main
              Branch, in line with the FCRA, 2010.
            </Text>
          </PolicySection>

          <PolicySection title="10. Training and accountability">
            <Text variant="secondary">
              All employees and volunteers handling donor information receive
              periodic training on this policy. The compliance owner for
              AML matters is the Foundation&rsquo;s designated Compliance
              Officer, reachable at{" "}
              <a
                href="mailto:info@surgerycarefoundation.com"
                className="font-medium text-accent underline underline-offset-2 hover:text-primary"
              >
                info@surgerycarefoundation.com
              </a>
              .
            </Text>
          </PolicySection>

          <PolicySection title="11. Reporting concerns">
            <Text variant="secondary">
              If you have reason to believe that a donor or campaigner is
              misusing the Site, you may report your concern confidentially
              to the Compliance Officer at the address above. Reports made in
              good faith are protected and will be acted on promptly.
            </Text>
          </PolicySection>

          <PolicySection title="12. Contact">
            <PolicyContact />
          </PolicySection>
        </Container>
      </div>
    </>
  );
}
