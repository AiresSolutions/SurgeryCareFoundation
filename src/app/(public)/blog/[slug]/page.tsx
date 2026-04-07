"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowRightIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { data: post, isLoading, error } = useApi(
    () => publicService.getBlogPost(params.slug),
    [params.slug],
  );

  if (isLoading) {
    return (
      <section className="py-20">
        <Container>
          <Text variant="secondary">Loading article...</Text>
        </Container>
      </section>
    );
  }

  if (!post || error) {
    return (
      <section className="py-20">
        <Container className="max-w-3xl">
          <Text variant="secondary">{error || "Blog post not found."}</Text>
        </Container>
      </section>
    );
  }

  return (
    <>
      <PageHero title={post.title} subtitle={post.excerpt} />

      <article className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            {post.category && <Badge>{post.category}</Badge>}
            <div className="flex items-center gap-2 text-slate-light">
              <CalendarIcon className="size-4" />
              <Text as="span" variant="muted" size="label" className="normal-case tracking-normal">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </div>
            {post.authorName && (
              <Text as="span" variant="muted" size="label" className="normal-case tracking-normal">
                By {post.authorName}
              </Text>
            )}
          </div>

          <div className="relative mb-10 h-64 overflow-hidden rounded-2xl md:h-96">
            <Image
              src={post.coverImageUrl || "/images/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
          </div>

          <div className="max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => (
              <Text key={index} variant="secondary" size="body-lg" className="mb-6">
                {paragraph}
              </Text>
            ))}
          </div>

          <div className="mt-12 border-t border-surface-border pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-btn font-bold text-primary transition-colors hover:text-accent"
            >
              <ArrowRightIcon className="size-4 rotate-180" />
              Back to All Articles
            </Link>
          </div>
        </Container>
      </article>
    </>
  );
}
