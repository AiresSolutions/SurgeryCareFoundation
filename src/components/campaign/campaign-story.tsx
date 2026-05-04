"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Text } from "@/components/ui/text";

const IMAGE_MARKDOWN_RE = /!\[[^\]]*\]\([^)]+\)/;

export function descriptionHasInlineMedia(description: string | null | undefined) {
  return Boolean(description && IMAGE_MARKDOWN_RE.test(description));
}

interface CampaignStoryProps {
  description: string;
}

// Renders the campaign description as Markdown when it contains inline images,
// so authors can interleave paragraphs with full-width photos and captions
// (using the standard `![alt](url)` syntax, plus optional `*caption*` lines
// underneath). Falls back to plain paragraph rendering otherwise.
export function CampaignStory({ description }: CampaignStoryProps) {
  if (!descriptionHasInlineMedia(description)) {
    return (
      <div className="space-y-4">
        {description
          .split(/\n{2,}/)
          .filter((p) => p.trim().length > 0)
          .map((p, i) => (
            <Text key={i} variant="secondary">
              {p}
            </Text>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 text-body text-slate-medium">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) =>
            src ? (
              <span className="my-6 block overflow-hidden rounded-2xl border border-surface-border bg-surface-page">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || ""}
                  className="block w-full object-contain"
                  loading="lazy"
                />
                {alt ? (
                  <span className="block bg-surface-page px-4 py-3 text-caption text-slate-medium">
                    {alt}
                  </span>
                ) : null}
              </span>
            ) : null,
          h1: ({ children }) => <h2 className="mt-8 text-h4 font-bold text-primary">{children}</h2>,
          h2: ({ children }) => <h2 className="mt-8 text-h4 font-bold text-primary">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 text-btn font-bold text-primary">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent bg-surface-page px-4 py-2 italic text-slate-deep">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="ml-6 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="ml-6 list-decimal space-y-1">{children}</ol>,
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
}
