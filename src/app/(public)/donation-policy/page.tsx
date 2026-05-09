import { PageHero } from "@/components/shared/page-hero";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { PolicySection, PolicyList, PolicyContact } from "@/components/legal/policy-section";

export const metadata = {
  title: "Donation Policy | Surgery Care Foundation",
  description:
    "How donations to Surgery Care Foundation are accepted, attributed to patients, disbursed to hospitals and acknowledged.",
};

export default function DonationPolicyPage() {
  return (
    <>
      <PageHero
        title="Donation"
        highlight="Policy"
        subtitle="How we accept funds, attribute them to a patient, disburse them to the hospital, and issue your 80G receipt."
      />
      <TrustStrip />

      <div className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Text variant="muted" className="mb-10">
            Effective date: 9 May 2025
          </Text>

          <PolicySection title="1. What this policy covers">
            <Text variant="secondary">
              This Donation Policy explains how Surgery Care Foundation accepts
              contributions, how those contributions are tied to a specific
              patient&rsquo;s surgery, how funds reach the hospital, and how
              you receive your 80G tax-benefit receipt.
            </Text>
          </PolicySection>

          <PolicySection title="2. Accepted donation methods">
            <Text variant="secondary">
              All donations are processed through the Razorpay payment
              gateway. Supported instruments include:
            </Text>
            <PolicyList
              items={[
                "UPI (Google Pay, PhonePe, Paytm, BHIM and any other UPI-compliant app).",
                "Debit and credit cards (Visa, MasterCard, RuPay, American Express).",
                "Net banking from major Indian banks.",
                "Wallets supported by the gateway.",
              ]}
            />
            <Text variant="secondary">
              We do not accept cash donations through the Site. As per the
              Income Tax Act, cash donations above &#8377; 2,000 are not
              eligible for 80G deduction in any case; we therefore restrict
              all donations to digital channels.
            </Text>
          </PolicySection>

          <PolicySection title="3. Donation amounts">
            <Text variant="secondary">
              The minimum donation is &#8377; 100. There is no maximum cap on
              the Site, however donations of &#8377; 50,000 or more in a
              single transaction may trigger Know-Your-Customer (KYC)
              verification by the payment gateway in line with the Prevention
              of Money Laundering Act, 2002. See our AML Policy for details.
            </Text>
          </PolicySection>

          <PolicySection title="4. How donations are applied">
            <PolicyList
              items={[
                "Donations selected against a specific campaign are credited to that campaign's running total in real time.",
                "Funds collected for a campaign are released directly to the partnered hospital that performs the surgery, against the hospital's invoice. Funds are never transferred to the patient's or family's personal bank account.",
                "If raised funds exceed the final hospital invoice, the surplus is applied to the next critical case in the same care category, with disclosure on the campaign page.",
                "If a campaign does not proceed, donor consent is sought before reallocating to another case (see our Refund Policy).",
              ]}
            />
          </PolicySection>

          <PolicySection title="5. Anonymous donations">
            <Text variant="secondary">
              You may choose to donate anonymously, in which case your name
              will not appear in the public donor list on the campaign page.
              Anonymity does not exempt you from providing PAN if you wish to
              claim 80G tax benefit, nor from KYC if your donation triggers
              the threshold under Section 4 above.
            </Text>
          </PolicySection>

          <PolicySection title="6. 80G tax benefit and receipts">
            <Text variant="secondary">
              Surgery Care Foundation holds a Section 80G certificate, which
              entitles eligible donors to claim a deduction in their income-tax
              return for donations made to the Foundation. To enable this:
            </Text>
            <PolicyList
              items={[
                "Provide your full legal name (matching your PAN), valid PAN, and postal address at the time of donation.",
                "An e-receipt confirming the donation is sent to your registered email immediately after a successful transaction.",
                "An 80G-compliant tax certificate is issued for the financial year in which the donation was made and is e-mailed in the format prescribed by the Income Tax Department.",
                "Re-issue requests for lost certificates can be raised by writing to us with the donation reference and PAN.",
              ]}
            />
            <Text variant="secondary">
              Eligibility to claim the deduction depends on your individual
              tax position; please consult a tax advisor.
            </Text>
          </PolicySection>

          <PolicySection title="7. Foreign contributions">
            <Text variant="secondary">
              Donations from foreign sources can only be accepted if and when
              the Foundation holds a valid registration under the Foreign
              Contribution (Regulation) Act, 2010 (FCRA). Until such
              registration is in place, please do not send foreign-currency
              contributions through the Site. Any inadvertent foreign
              contribution will be returned to the source.
            </Text>
          </PolicySection>

          <PolicySection title="8. Recurring and corporate giving">
            <Text variant="secondary">
              We support one-time and recurring donations through the
              gateway. Companies wishing to contribute under their Corporate
              Social Responsibility (CSR) obligation may write to us for a
              tailored memorandum of understanding setting out the project,
              utilisation reporting and audit access.
            </Text>
          </PolicySection>

          <PolicySection title="9. No commission, no platform fee">
            <Text variant="secondary">
              The Foundation does not deduct any platform fee or commission
              from donor contributions. Payment-gateway charges (typically
              under 2%) are absorbed by the Foundation&rsquo;s operations
              budget so that the maximum possible amount reaches the patient.
            </Text>
          </PolicySection>

          <PolicySection title="10. Acknowledgement and updates">
            <Text variant="secondary">
              Every successful donor receives an immediate e-receipt and is
              subscribed to update e-mails for the campaign(s) they have
              supported, including pre-surgery, surgery completion and
              recovery updates. You may unsubscribe from update e-mails at any
              time without affecting the Foundation&rsquo;s ability to
              continue funding the patient&rsquo;s care.
            </Text>
          </PolicySection>

          <PolicySection title="11. Contact">
            <PolicyContact />
          </PolicySection>
        </Container>
      </div>
    </>
  );
}
