import { PageHero } from "@/components/shared/page-hero";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { PolicySection, PolicyList, PolicyContact } from "@/components/legal/policy-section";

export const metadata = {
  title: "Refund & Cancellation Policy | Surgery Care Foundation",
  description:
    "When and how Surgery Care Foundation processes refunds for donations to medical surgery campaigns.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        title="Refund &"
        highlight="Cancellation"
        subtitle="When refunds are possible, the window to request one, and how we handle gateway and bank failures."
      />
      <TrustStrip />

      <div className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Text variant="muted" className="mb-10">
            Effective date: 9 May 2025
          </Text>

          <PolicySection title="1. Donations are voluntary contributions">
            <Text variant="secondary">
              Donations made to Surgery Care Foundation are voluntary
              charitable contributions intended to fund the surgical treatment
              of patients in need. Once a donation is successfully processed
              and applied to a patient&rsquo;s campaign, it is generally
              non-refundable. The exceptions below describe the limited
              circumstances under which a refund may be granted.
            </Text>
          </PolicySection>

          <PolicySection title="2. Failed or duplicate transactions">
            <Text variant="secondary">
              If your bank or UPI app debits an amount but the donation does
              not reflect on the Site, the transaction is considered failed.
              Such amounts are typically auto-reversed by the payment gateway
              within 5 to 10 working days without any action required on your
              part. If a duplicate charge appears for the same intended
              donation, write to us within 7 days of the transaction with the
              transaction reference and we will arrange a refund of the
              duplicate amount to the original payment method.
            </Text>
          </PolicySection>

          <PolicySection title="3. Refund window for genuine errors">
            <Text variant="secondary">
              If you have donated by mistake (for example, an incorrect amount
              or to the wrong campaign), you may request a refund within
              <strong> 7 calendar days</strong> of the donation. Refund
              requests received after this window will be considered only at
              the Foundation&rsquo;s discretion and only if the funds have not
              already been disbursed to the partnered hospital.
            </Text>
          </PolicySection>

          <PolicySection title="4. Once funds are released to the hospital">
            <Text variant="secondary">
              Surgery Care Foundation releases collected funds directly to the
              partnered hospital&rsquo;s bank account against the
              hospital&rsquo;s invoice for the patient&rsquo;s surgery. After
              the funds have been released, the donation cannot be refunded.
              At that stage your contribution has already been applied to the
              clinical care of the patient.
            </Text>
          </PolicySection>

          <PolicySection title="5. If a campaign closes without surgery">
            <Text variant="secondary">
              In the rare situation that a campaign closes before the funds
              are disbursed (for example, the patient passes away, the family
              withdraws the request, or the campaign is removed for breach of
              our Terms of Use), the Foundation will contact contributing
              donors and offer one of the following options:
            </Text>
            <PolicyList
              items={[
                "Reallocate the contribution to a similar critical patient case selected by you, or",
                "Reallocate the contribution to the Foundation's general patient-care fund (used for the next critical case in queue), or",
                "Refund the contribution to the original payment method.",
              ]}
            />
          </PolicySection>

          <PolicySection title="6. How to request a refund">
            <Text variant="secondary">
              Send the following to{" "}
              <a
                href="mailto:info@surgerycarefoundation.com"
                className="font-medium text-accent underline underline-offset-2 hover:text-primary"
              >
                info@surgerycarefoundation.com
              </a>{" "}
              within the applicable window:
            </Text>
            <PolicyList
              items={[
                "Donor name and registered email or phone number.",
                "Donation amount and date.",
                "Razorpay or UPI reference number from the receipt email.",
                "Reason for the refund request.",
              ]}
            />
          </PolicySection>

          <PolicySection title="7. Processing timeline">
            <Text variant="secondary">
              Approved refunds are initiated within 5 working days of receiving
              a complete request. Once initiated, the refund typically reflects
              in the original payment method within an additional 5 to 10
              working days, depending on your card issuer or bank. The
              Foundation has no control over the bank&rsquo;s internal
              processing time.
            </Text>
          </PolicySection>

          <PolicySection title="8. 80G receipt and refunds">
            <Text variant="secondary">
              If an 80G tax-benefit receipt has already been issued for a
              donation that is later refunded, the corresponding receipt is
              automatically void. You should not claim a deduction under
              Section 80G for a refunded donation. Re-claiming a refunded
              donation is a violation of the Income Tax Act.
            </Text>
          </PolicySection>

          <PolicySection title="9. Contact">
            <Text variant="secondary">
              For any refund-related question:
            </Text>
            <PolicyContact />
          </PolicySection>
        </Container>
      </div>
    </>
  );
}
