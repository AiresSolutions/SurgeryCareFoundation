"use client";

import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";
import type { BlogPost } from "@/types/content";

export default function BlogPage() {
  const { data: posts, isLoading, error, refetch } = useApi<BlogPost[]>(
    () => publicService.getBlogPosts(),
    [],
  );

  return (
    <>
      <PageHero
        title="Latest"
        highlight="News & Updates"
        subtitle="Read about recent impact, medical insights, and inspiring patient stories."
      />

      <section className="py-16 md:py-24">
        <Container>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Text variant="secondary">Loading articles...</Text>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heading level="h4" as="h2" className="mb-2">
                Unable to load blog posts
              </Heading>
              <Text variant="secondary" className="mb-6 max-w-lg">
                {error}
              </Text>
              <button
                type="button"
                onClick={refetch}
                className="rounded-full bg-primary px-6 py-3 text-white"
              >
                Retry
              </button>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="flex justify-center py-16">
              <Text variant="secondary">No blog posts are published yet.</Text>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.coverImageUrl || "/images/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    />
                    {post.category && (
                      <Badge className="absolute left-4 top-4">{post.category}</Badge>
                    )}
                  </div>

                  <CardContent className="flex flex-1 flex-col">
                    <div className="mb-3 flex items-center gap-2 text-slate-light">
                      <CalendarIcon className="size-4" />
                      <Text
                        as="span"
                        variant="muted"
                        size="label"
                        className="normal-case tracking-normal"
                      >
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </div>

                    <Heading level="h4" as="h2" className="mb-3 text-accent">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-accent-green"
                      >
                        {post.title}
                      </Link>
                    </Heading>

                    <Text variant="secondary" className="mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </Text>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-label font-black uppercase tracking-wider text-primary transition-colors hover:text-accent"
                    >
                      Read Article
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
