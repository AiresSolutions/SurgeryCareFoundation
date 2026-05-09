import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export interface PageHeroProps {
  title: string;
  highlight?: string;
  subtitle?: string;
}

export function PageHero({ title, highlight, subtitle }: PageHeroProps) {
  return (
    <section className="bg-primary py-16 text-center md:py-20">
      <Container>
        <Heading level="h1" as="h1" className="mb-4 text-white">
          {title}{" "}
          {highlight && (
            <span className="bg-gradient-to-b from-accent-mint to-accent-green bg-clip-text text-transparent">
              {highlight}
            </span>
          )}
        </Heading>
        {subtitle && (
          <Text variant="on-dark" size="body-lg" className="mx-auto max-w-2xl">
            {subtitle}
          </Text>
        )}
      </Container>
    </section>
  );
}
