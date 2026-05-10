import type { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
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

export function PolicyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item, i) => (
        <li key={i}>
          <Text variant="secondary" as="span">
            {item}
          </Text>
        </li>
      ))}
    </ul>
  );
}

export function PolicyContact() {
  return (
    <div className="rounded-2xl border border-surface-subtle bg-surface-bg p-6">
      <Text variant="secondary">
        <strong className="text-primary">Surgery Care Foundation</strong>
        <br />
        1st Floor, Plot No. 06, Katol Road,
        <br />
        Falke Layout, Kolbaswami Nagar,
        <br />
        Akar Nagar, Nagpur, Maharashtra 440013
        <br />
        Email:{" "}
        <a
          href="mailto:info@surgerycarefoundation.com"
          className="font-medium text-accent underline underline-offset-2 hover:text-primary"
        >
          info@surgerycarefoundation.com
        </a>
        <br />
        Phone:{" "}
        <a
          href="tel:+918815935091"
          className="font-medium text-accent underline underline-offset-2 hover:text-primary"
        >
          +91 8815935091
        </a>
      </Text>
    </div>
  );
}
