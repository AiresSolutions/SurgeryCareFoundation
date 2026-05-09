import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ImpactStats } from "@/components/home/impact-stats";
import { VolunteerTeam } from "@/components/home/volunteer-team";
import {
  TargetIcon,
  ShieldIcon,
  HeartHandshakeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  HeartIcon,
  ClipboardCheckIcon,
  DollarSignIcon,
  PhoneIcon,
} from "@/components/ui/icons";

const CONDITIONS = [
  {
    group: "Paediatric Surgery",
    items: [
      "Burns (children & adults)",
      "Cleft lip & palate",
      "Cystic hygroma (lymphangioma)",
      "Spina bifida & meningomyelocele",
      "Encephalocele",
      "Hydrocephalus",
      "Omphalocele",
      "Bladder exstrophy",
      "Ectopia cordis",
      "Conjoined twins",
      "Torticollis & neck abnormalities",
      "Achalasia",
    ],
  },
  {
    group: "Oncology & Tumors",
    items: [
      "Neuroblastoma",
      "Neuroectodermal tumour",
      "Visible oncology cases",
      "Visible tumours",
      "Huge abdominal tumours",
      "Von Recklinghausen’s disease (Neurofibromatosis 1)",
    ],
  },
] as const;

const VISION_POINTS = [
  "Dedicated to advancing the health and transforming the lives of the people we serve.",
  "Working with top hospitals across India to ensure good-quality treatment.",
  "Providing the best quality of healthcare to every class of patient.",
  "Operating as a team that puts patient benefit above individual contribution.",
  "Enhancing community health in cooperation with other organisations, locally and globally.",
] as const;

const HOW_WE_WORK = [
  {
    step: "01",
    title: "Pan-India hospital network",
    description:
      "We operate in almost every state of India through partnerships with top hospitals.",
  },
  {
    step: "02",
    title: "End-to-end patient care",
    description:
      "We connect each patient to the right hospital and stay with them through every stage of treatment until full recovery.",
  },
  {
    step: "03",
    title: "Funded care for non-affordable patients",
    description:
      "Where families cannot afford treatment, we raise the required funds and complete high-quality surgery at no cost to them.",
  },
  {
    step: "04",
    title: "Packages for affordable patients",
    description:
      "For insurance holders and cash payers we offer curated treatment packages and on-call hospital coordination.",
  },
] as const;

const VALUES = [
  {
    icon: TargetIcon,
    title: "Direct Impact",
    description:
      "Every donation funds a verified surgical case at a partnered hospital.",
  },
  {
    icon: ShieldIcon,
    title: "Verified Cases",
    description:
      "Each medical case is reviewed by our team and admitted to a NABH-accredited hospital.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "End-to-End Support",
    description:
      "From counselling and admission to post-operative recovery, our team stays with every patient.",
  },
] as const;

const PATIENT_BENEFITS = [
  {
    icon: HeartIcon,
    title: "High-quality healthcare",
    description: "Treated by expert surgeons with advanced medical facilities.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Counselling & end-to-end support",
    description:
      "Proper counselling and complete handholding from our team through every step.",
  },
  {
    icon: PhoneIcon,
    title: "On-call hospital coordination",
    description:
      "Dedicated assistance for internal hospital coordination whenever you need it.",
  },
  {
    icon: DollarSignIcon,
    title: "Free treatment for non-affordable patients",
    description:
      "We raise the required funds and complete the entire treatment at no cost.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Exclusive packages",
    description:
      "Curated packages for insurance holders and cash-paying patients.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Safety & confidentiality",
    description:
      "Honest, open communication with strict confidentiality and privacy throughout.",
  },
] as const;

const DONATION_FLOW = [
  {
    step: "01",
    title: "Case verified",
    description:
      "Our team reviews medical records, hospital estimates and the family's situation before any campaign goes live.",
  },
  {
    step: "02",
    title: "Donation collected",
    description:
      "Donors contribute through verified payment gateways. Every contribution is tracked against the patient's goal in real time.",
  },
  {
    step: "03",
    title: "Paid to the hospital",
    description:
      "Funds are released directly to the hospital that performs the surgery. They never enter a patient or family bank account.",
  },
] as const;

const NEVER_DO = [
  "We do not charge patients.",
  "We do not charge hospitals.",
  "We do not take commission from any party.",
  "We do not sell treatment packages.",
] as const;

const REGISTRATIONS = [
  {
    label: "NGO Registration",
    status: "Registered",
    description: "Surgery Care Foundation is a registered non-profit entity under Indian law.",
  },
  {
    label: "12A Certificate",
    status: "Held",
    description: "Income-tax exemption status under Section 12A of the Income Tax Act.",
  },
  {
    label: "80G Certificate",
    status: "Held",
    description: "Donors receive tax-deduction benefit under Section 80G on every donation.",
  },
  {
    label: "PAN",
    status: "On File",
    description: "Permanent Account Number available for compliance verification.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="More Care."
        highlight="Less Cost."
        subtitle="Surgery Care connects patients to top hospitals across India and ensures every patient, affordable or not, receives high-quality surgical treatment."
      />

      <ImpactStats />

      {/* About the Company */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative mx-auto h-[400px] w-full max-w-lg overflow-hidden rounded-[48px] shadow-elevated lg:h-[480px]">
              <Image
                src="/images/mission.jpg"
                alt="Surgery Care team supporting a young patient"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 530px, 512px"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[3px] w-8 rounded-full bg-accent-green" />
                <Text as="span" size="label" className="font-black tracking-[1.4px] text-accent-green">
                  About the Company
                </Text>
              </div>

              <Heading level="h2" className="mb-6">
                Healthcare for{" "}
                <span className="bg-gradient-to-b from-accent-green to-accent-mint bg-clip-text text-transparent">
                  every class of patient
                </span>
              </Heading>

              <Text variant="secondary" size="body-lg" className="mb-10">
                As a healthcare-focused organisation, our main focus is to improve the
                health of every patient by consulting and treating them at top hospitals
                with strong team coordination, for both affordable and
                non-affordable patients alike.
              </Text>

              <div className="space-y-6">
                {VALUES.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-green">
                      <Icon className="size-5 text-accent" />
                    </span>
                    <div>
                      <p className="mb-1 text-btn font-black text-primary">{title}</p>
                      <Text variant="secondary">{description}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Conditions We Treat */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="rounded-[32px] border border-surface-border bg-white p-8 shadow-card md:p-10">
            <div className="mb-6 max-w-2xl">
              <Text size="label" className="mb-3 text-accent">
                CONDITIONS WE TREAT
              </Text>
              <Heading level="h2" as="h2" className="mb-3">
                Surgical care across paediatric, oncology and complex cases
              </Heading>
              <Text variant="secondary">
                Surgery Care supports patients with a wide range of surgical needs.
                Below are the conditions our network of partner hospitals regularly treats.
              </Text>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {CONDITIONS.map((group) => (
                <div key={group.group}>
                  <p className="mb-3 text-btn font-black uppercase tracking-[0.7px] text-primary">
                    {group.group}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-surface-green px-4 py-2 text-caption font-bold text-accent"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Vision */}
      <section className="bg-surface-page py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Text size="label" className="mb-3 tracking-[1.4px] font-black text-accent">
              OUR VISION
            </Text>
            <Heading level="h2" className="mb-4">
              Transforming lives through{" "}
              <span className="text-accent">quality care</span>
            </Heading>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {VISION_POINTS.map((point) => (
              <div
                key={point}
                className="flex items-start gap-4 rounded-2xl border border-surface-border bg-white p-6 shadow-card"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-green">
                  <CheckCircleIcon className="size-5 text-accent" />
                </span>
                <p
                  className="text-[16px] leading-relaxed text-slate"
                  dangerouslySetInnerHTML={{ __html: point }}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How We Work */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Text size="label" className="mb-3 tracking-[1.4px] font-black text-accent">
              HOW WE WORK
            </Text>
            <Heading level="h2" className="mb-4">
              Care that follows the patient,{" "}
              <span className="text-accent">end to end</span>
            </Heading>
            <Text variant="secondary" size="body-lg">
              Whether a patient can afford treatment or not, our work is to bring
              them to the right hospital and stay with them until their treatment
              is complete.
            </Text>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_WE_WORK.map(({ step, title, description }) => (
              <div
                key={step}
                className="rounded-3xl border border-surface-border bg-white p-8 shadow-card"
              >
                <span className="mb-6 inline-flex h-10 items-center rounded-full bg-cta-gradient px-4 text-[14px] font-black text-white">
                  {step}
                </span>
                <p className="mb-2 text-btn-lg font-black text-primary">{title}</p>
                <Text variant="secondary">{description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits to Patients */}
      <section className="bg-surface-page py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Text size="label" className="mb-3 tracking-[1.4px] font-black text-accent">
              BENEFITS TO PATIENTS
            </Text>
            <Heading level="h2">
              What every patient gets with{" "}
              <span className="text-accent">Surgery Care</span>
            </Heading>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PATIENT_BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-surface-border bg-white p-7 shadow-card"
              >
                <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-surface-green">
                  <Icon className="size-6 text-accent" />
                </span>
                <p className="mb-2 text-btn-lg font-black text-primary">{title}</p>
                <Text variant="secondary">{description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How Your Donation Works */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Text size="label" className="mb-3 tracking-[1.4px] font-black text-accent">
              HOW YOUR DONATION WORKS
            </Text>
            <Heading level="h2" className="mb-4">
              From you to the patient,{" "}
              <span className="text-accent">in three steps</span>
            </Heading>
            <Text variant="secondary" size="body-lg">
              Every rupee follows the same path: a verified case, a public
              collection, and direct settlement to the hospital that performs
              the surgery.
            </Text>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {DONATION_FLOW.map(({ step, title, description }) => (
              <div
                key={step}
                className="rounded-3xl border border-surface-border bg-white p-8 shadow-card"
              >
                <span className="mb-6 inline-flex h-10 items-center rounded-full bg-cta-gradient px-4 text-[14px] font-black text-white">
                  {step}
                </span>
                <p className="mb-2 text-btn-lg font-black text-primary">{title}</p>
                <Text variant="secondary">{description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Promises (What we never do) */}
      <section className="bg-surface-page py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Text size="label" className="mb-3 tracking-[1.4px] font-black text-accent">
              OUR PROMISES
            </Text>
            <Heading level="h2" className="mb-4">
              What we will{" "}
              <span className="text-accent">never do</span>
            </Heading>
            <Text variant="secondary" size="body-lg">
              Trust starts with what we refuse. These are non-negotiable rules
              that govern every campaign listed on Surgery Care Foundation.
            </Text>
          </div>

          <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {NEVER_DO.map((promise) => (
              <li
                key={promise}
                className="flex items-start gap-4 rounded-2xl border border-surface-border bg-white p-6 shadow-card"
              >
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-green">
                  <ShieldCheckIcon className="size-4 text-accent" />
                </span>
                <span className="text-[16px] leading-relaxed text-slate">{promise}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Registrations & Compliance */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Text size="label" className="mb-3 tracking-[1.4px] font-black text-accent">
              REGISTRATIONS & COMPLIANCE
            </Text>
            <Heading level="h2" className="mb-4">
              A registered, compliant{" "}
              <span className="text-accent">non-profit organisation</span>
            </Heading>
            <Text variant="secondary" size="body-lg">
              Surgery Care Foundation is registered under Indian non-profit law
              and holds the certifications below. Documents are available on
              written request.
            </Text>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REGISTRATIONS.map(({ label, status, description }) => (
              <div
                key={label}
                className="rounded-2xl border border-surface-border bg-white p-6 shadow-card"
              >
                <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-surface-green">
                  <ShieldCheckIcon className="size-5 text-accent" />
                </span>
                <p className="mb-1 text-btn font-black text-primary">{label}</p>
                <p className="mb-2 text-caption font-bold uppercase tracking-[1px] text-accent-green">
                  {status}
                </p>
                <p className="text-caption leading-relaxed text-slate-light">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Goals */}
      <section className="bg-surface-page py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Text size="label" className="mb-3 tracking-[1.4px] font-black text-accent">
              OUR GOALS
            </Text>
            <Heading level="h2">
              The patient always{" "}
              <span className="text-accent">comes first</span>
            </Heading>
            <Text variant="secondary" size="body-lg" className="mt-4">
              We believe patients deserve timely access to healthcare, and our
              systems are built to reflect that value at every step.
            </Text>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-surface-border bg-white p-8 shadow-card">
              <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-surface-green">
                <HeartHandshakeIcon className="size-6 text-accent" />
              </span>
              <Heading level="h4" as="h3" className="mb-2">
                Values and Trust
              </Heading>
              <Text variant="secondary">
                Honest and open communication with patients and partner hospitals
                at every stage of treatment.
              </Text>
            </div>
            <div className="rounded-3xl border border-surface-border bg-white p-8 shadow-card">
              <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-surface-green">
                <ShieldCheckIcon className="size-6 text-accent" />
              </span>
              <Heading level="h4" as="h3" className="mb-2">
                Integrity
              </Heading>
              <Text variant="secondary">
                Fairness and self-scrutiny in everything we do. The ideal
                way to protect patient safety, confidentiality and privacy.
              </Text>
            </div>
          </div>
        </Container>
      </section>

      <VolunteerTeam />
    </>
  );
}

