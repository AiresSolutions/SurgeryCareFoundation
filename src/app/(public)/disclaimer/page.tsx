import { PageHero } from "@/components/shared/page-hero";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { PolicySection, PolicyContact } from "@/components/legal/policy-section";

export const metadata = {
  title: "Disclaimer | Surgery Care Foundation",
  description:
    "Important disclosures about Surgery Care Foundation's role, the medical content on this site, tax benefits and third-party services.",
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        title="Disclaimer"
        subtitle="What we are, what we are not, and the limits of the information published on this site."
      />
      <TrustStrip />

      <div className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Text variant="muted" className="mb-10">
            Effective date: 9 May 2025
          </Text>

          <PolicySection title="1. We are not a medical service provider">
            <Text variant="secondary">
              Surgery Care Foundation is a registered non-profit organisation
              that funds surgical care for patients who cannot afford
              treatment. The Foundation is not a hospital, clinic, diagnostic
              centre or healthcare provider, and does not employ any medical
              practitioner. All clinical decisions, surgical procedures,
              admission, anaesthesia, post-operative care and prescriptions
              are the sole responsibility of the partnered hospital and the
              treating doctor selected for the patient.
            </Text>
          </PolicySection>

          <PolicySection title="2. No guarantee of medical outcome">
            <Text variant="secondary">
              The Foundation makes every effort to fund surgeries promptly and
              to coordinate care with reputed hospitals. However, surgical
              outcomes depend on a wide range of clinical and individual
              factors that are outside the Foundation&rsquo;s control. We do
              not warrant or guarantee any particular medical outcome,
              recovery timeline, or success rate for any patient listed on
              the Site.
            </Text>
          </PolicySection>

          <PolicySection title="3. Information accuracy">
            <Text variant="secondary">
              Patient stories, medical conditions, photographs, hospital
              estimates and other information published on a campaign page
              are submitted by the patient or an authorised family member and
              are verified by the Foundation&rsquo;s team to the best of our
              ability. We rely on the documents and information provided by
              the campaigner; we cannot guarantee absolute accuracy or
              completeness of every detail. If you believe a campaign
              contains inaccurate or misleading information, please report it
              using the contact below.
            </Text>
          </PolicySection>

          <PolicySection title="4. Tax benefit eligibility">
            <Text variant="secondary">
              Donations to Surgery Care Foundation are eligible for deduction
              under Section 80G of the Income Tax Act, 1961, subject to the
              terms of our 80G certificate. Whether you can actually claim
              the deduction in your return depends on your individual tax
              position, the regime you have chosen and changes in tax law.
              The Foundation does not provide tax advice; please consult a
              qualified tax advisor.
            </Text>
          </PolicySection>

          <PolicySection title="5. Third-party services and links">
            <Text variant="secondary">
              The Site relies on third-party services (payment gateway,
              hosting, analytics, email, social-media platforms). Where the
              Site links to a third-party website, the Foundation does not
              control and is not responsible for the content, privacy
              practices or terms of those external sites. Use of such third
              parties is at your own discretion.
            </Text>
          </PolicySection>

          <PolicySection title="6. No solicitation in restricted jurisdictions">
            <Text variant="secondary">
              The Site is operated from India and is intended for donors
              within India. Nothing on the Site constitutes a solicitation of
              donations in any jurisdiction in which such solicitation would
              be unlawful or in which the Foundation is not authorised to
              receive donations. Foreign-currency donations are subject to
              FCRA registration and are not currently accepted through the
              Site (see our Donation Policy).
            </Text>
          </PolicySection>

          <PolicySection title="7. Force majeure">
            <Text variant="secondary">
              The Foundation is not liable for any delay or failure in
              processing donations, disbursing funds, or coordinating medical
              care that arises from circumstances outside its reasonable
              control, including natural disasters, pandemics, payment-gateway
              outages, government action, civil unrest, or breakdown of
              essential infrastructure.
            </Text>
          </PolicySection>

          <PolicySection title="8. Limitation of liability">
            <Text variant="secondary">
              To the fullest extent permitted by law, the Foundation, its
              trustees, officers and volunteers shall not be liable for any
              indirect, incidental, consequential or punitive damages arising
              out of or in connection with your use of the Site or any
              donation made through it. The Foundation&rsquo;s aggregate
              liability shall not exceed the amount of the donation in
              question.
            </Text>
          </PolicySection>

          <PolicySection title="9. Reporting concerns">
            <Text variant="secondary">
              To report suspected fraud, inaccurate information, or any
              concern regarding a campaign or donor experience, write to{" "}
              <a
                href="mailto:info@surgerycarefoundation.com"
                className="font-medium text-accent underline underline-offset-2 hover:text-primary"
              >
                info@surgerycarefoundation.com
              </a>
              .
            </Text>
          </PolicySection>

          <PolicySection title="10. Contact">
            <PolicyContact />
          </PolicySection>
        </Container>
      </div>
    </>
  );
}
