import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "\u201CSonam was born with a meningocele between her nose and head. The surgery cost lakhs we could never have raised on a daily wage. Surgery Care arranged the funds and the operation \u2014 today she is back at school, healthy and happy.\u201D",
    name: "Sonam\u2019s Family",
    role: "Meningocele \u00B7 Cranial Surgery",
    image: "/images/testimonial-1.png",
  },
  {
    quote:
      "\u201CMy son Raubi had a fast-growing cancerous tumour on his chin and could barely eat or speak. As a daily-wage labourer I had no way to pay for the urgent surgery. Surgery Care made it happen \u2014 he is now playing and eating without pain.\u201D",
    name: "Raubi\u2019s Father",
    role: "Paediatric Oncology",
    image: "/images/testimonial-2.png",
  },
  {
    quote:
      "\u201COur newborn was diagnosed with spina bifida myelomeningocele. The surgery cost \u20B92.5 lakh \u2014 impossible on \u20B9300 a day. Surgery Care\u2019s team handled everything. The operation was a success and our baby is growing well.\u201D",
    name: "Priya & Pawan",
    role: "Parents \u00B7 Spina Bifida Surgery",
    image: "/images/testimonial-3.png",
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <div className="relative pt-6">
      {/* Card */}
      <div className="relative rounded-tl-[32px] rounded-tr-[64px] rounded-bl-[64px] rounded-br-[32px] border border-surface-subtle bg-white p-10 pb-12 shadow-[0px_15px_40px_0px_rgba(0,0,0,0.04)]">
        {/* Quote */}
        <p className="mb-8 text-[18px] italic leading-[29px] text-slate">
          {testimonial.quote}
        </p>

        {/* Author */}
        <div>
          <Heading level="h4" className="text-[20px]">
            {testimonial.name}
          </Heading>
          <Text
            as="span"
            size="label"
            className="font-bold uppercase tracking-[0.7px] text-accent"
          >
            {testimonial.role}
          </Text>
        </div>
      </div>

      {/* Number badge — top-left, overlapping card */}
      <div className="absolute left-10 top-0 z-10 flex size-12 items-center justify-center rounded-full border-4 border-white bg-cta-gradient text-[20px] font-black text-white shadow-secondary">
        {index + 1}
      </div>

      {/* Avatar — bottom-right, overlapping card edge */}
      <div className="absolute -bottom-6 right-4 z-10 flex size-[112px] items-center justify-center rounded-full bg-white/50 p-2 shadow-secondary">
        <div className="relative size-24 overflow-hidden rounded-full border-[2.667px] border-accent">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        {/* Heading */}
        <Heading level="h2" className="mx-auto mb-16 max-w-lg text-center">
          What People Say About{" "}
          <span className="text-accent">Surgery Care</span>
        </Heading>

        {/* Cards */}
        <div className="grid gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
