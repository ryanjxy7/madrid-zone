import Image from "next/image";
import type { AdSlotContent } from "@/lib/data/adSlot";

export function AdSlot({ content }: { content: AdSlotContent }) {
  const { width, height } = content;

  if (content.mode === "code" && content.adNetworkCode) {
    return (
      <iframe
        title="Advertisement"
        srcDoc={content.adNetworkCode}
        width={width}
        height={height}
        style={{ border: 0, width: "100%", maxWidth: width, height }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        loading="lazy"
      />
    );
  }

  if (content.mode === "image" && content.imageUrl) {
    const image = (
      <div className="relative w-full" style={{ maxWidth: width, aspectRatio: `${width} / ${height}` }}>
        <Image
          src={content.imageUrl}
          alt={content.imageAlt ?? "Advertisement"}
          fill
          sizes={`${width}px`}
          className="rounded-md object-cover"
        />
      </div>
    );
    return content.linkUrl ? (
      <a
        href={content.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={content.imageAlt ?? "Advertisement"}
      >
        {image}
      </a>
    ) : (
      image
    );
  }

  return (
    <div
      className="flex w-full items-center justify-center rounded-md border border-dashed border-border-strong font-mono text-[11px] text-muted"
      style={{
        height,
        backgroundImage: "repeating-linear-gradient(45deg, var(--card) 0 12px, var(--surface) 12px 24px)",
      }}
      role="complementary"
      aria-label="Advertisement"
    >
      [ ad slot {width}×{height} ]
    </div>
  );
}
