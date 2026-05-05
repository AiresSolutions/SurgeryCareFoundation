// Extracts the YouTube video ID from any of the common URL shapes:
//   https://youtu.be/VIDEO_ID
//   https://www.youtube.com/watch?v=VIDEO_ID
//   https://www.youtube.com/embed/VIDEO_ID
//   https://www.youtube.com/shorts/VIDEO_ID
// Returns null if the URL is not a recognisable YouTube link.
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.replace(/^\/+/, "").split("/")[0];
    return /^[\w-]{6,}$/.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const v = parsed.searchParams.get("v");
    if (v && /^[\w-]{6,}$/.test(v)) return v;
    const match = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
    if (match) return match[1];
  }

  return null;
}

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ url, title = "YouTube video", className }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div
      className={
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-surface-border bg-black shadow-card" +
        (className ? ` ${className}` : "")
      }
    >
      <iframe
        src={embedSrc}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    </div>
  );
}
