import { createImageUrlBuilder } from "@sanity/image-url";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageValue, ObjectInputProps } from "sanity";
import { set } from "sanity";
import { dataset, projectId } from "@/sanity/env";
import { detectAutoHotspot, loadImage } from "./smartCrop";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * The schema's `components.input` slot is typed against the generic
 * `ObjectInputProps<ImageValue>`, but Studio actually renders image
 * inputs with the richer `ImageInputProps` at runtime (which adds
 * `isUploading`) — this local type bridges the two so we can rely on
 * `isUploading` without fighting the schema field's declared type.
 */
type SmartImageInputProps = ObjectInputProps<ImageValue> & { isUploading?: boolean };

export interface CropPreviewSpec {
  /** What the preview represents, e.g. "Squad card (mobile)". */
  label: string;
  width: number;
  height: number;
  round?: boolean;
}

/**
 * Builds a Studio image input for one specific field, previewing the
 * exact shapes THAT field renders as on the live site — a byline is
 * always a circle, an article hero is always 16:9, a squad card is a
 * short wide strip, and so on. One generic circle+rectangle pair doesn't
 * actually tell an editor anything reliable about a field it wasn't
 * built for, so every image field on the site gets its own accurate set
 * of preview shapes here rather than sharing one approximation.
 *
 * Every instance shares the same underlying behaviour: the crop
 * auto-adjusts the moment a new photo finishes uploading (smartcrop.js
 * saliency + skin-tone detection — a heuristic, not a true ML face
 * detector, but it reliably gravitates to faces/subjects in portrait
 * photos with no external API calls or model downloads), self-heals any
 * photo that ended up with no hotspot at all, and always shows a
 * "Re-detect crop" button plus Sanity's own drag-to-adjust hotspot
 * handle for manual fine-tuning — auto-detect is a starting point, not a
 * replacement for editorial judgement.
 */
export function createSmartImageInput(previews: CropPreviewSpec[]) {
  return function SmartImageInput(props: SmartImageInputProps) {
    const { value, onChange, isUploading } = props;
    const wasUploading = useRef(isUploading);
    const [status, setStatus] = useState<"idle" | "detecting" | "done" | "error">("idle");

    const assetRef = value?.asset?._ref;
    const hotspot = value?.hotspot;

    const runAutoDetect = useCallback(
      (ref: string) => {
        let cancelled = false;
        setStatus("detecting");
        const previewUrl = builder.image(ref).width(1000).url();

        loadImage(previewUrl)
          .then(detectAutoHotspot)
          .then((detected) => {
            if (cancelled) return;
            onChange(set(detected, ["hotspot"]));
            setStatus("done");
          })
          .catch(() => {
            if (!cancelled) setStatus("error");
          });

        return () => {
          cancelled = true;
        };
      },
      [onChange]
    );

    useEffect(() => {
      const justFinishedUploading = wasUploading.current && !isUploading;
      wasUploading.current = isUploading;

      // Fires right after a fresh upload, but also self-heals any photo that
      // somehow ended up with no hotspot at all (uploaded before this shipped,
      // added outside Studio, etc.) — either way, "no hotspot yet" auto-detects.
      if (!assetRef || hotspot) return;
      if (!justFinishedUploading && status !== "idle") return;

      return runAutoDetect(assetRef);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading, assetRef, hotspot]);

    const previewSource = assetRef ? { ...value, asset: { _ref: assetRef, _type: "reference" as const } } : null;
    const avatarSrc = previewSource ? builder.image(previewSource).width(480).fit("max").url() : null;
    const focus = hotspot ? { x: hotspot.x, y: hotspot.y } : { x: 0.5, y: 0.5 };
    const hasManualHotspot = Boolean(hotspot);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {props.renderDefault(props)}

        {previewSource && avatarSrc ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "12px 14px",
              border: "1px solid rgba(0,0,0,.08)",
              borderRadius: 8,
              background: "rgba(0,0,0,.015)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ font: "600 11px sans-serif", color: "#525a6b", letterSpacing: ".02em" }}>
                {status === "detecting"
                  ? "Auto-framing the photo…"
                  : hasManualHotspot
                    ? "Crop set — drag the circle on the photo above to fine-tune it."
                    : "No crop set yet."}
              </span>
              <button
                type="button"
                onClick={() => assetRef && runAutoDetect(assetRef)}
                disabled={status === "detecting"}
                style={{
                  font: "600 11px sans-serif",
                  color: "#c8102e",
                  background: "transparent",
                  border: "1px solid rgba(200,16,46,.4)",
                  borderRadius: 6,
                  padding: "5px 11px",
                  cursor: status === "detecting" ? "default" : "pointer",
                  flex: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {hasManualHotspot ? "Re-detect crop" : "Auto-detect crop"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
              {previews.map((preview) => (
                <PreviewFrame key={preview.label} {...preview} src={avatarSrc} focus={focus} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  };
}

/** The Squad card's photo (see PlayerCard.tsx) — a circle avatar elsewhere, and the card's own short wide strip at both breakpoints. */
export const SquadPhotoInput = createSmartImageInput([
  { label: "Circle avatar", width: 64, height: 64, round: true },
  { label: "Squad card (desktop)", width: 150, height: 108 },
  { label: "Squad card (mobile)", width: 110, height: 82 },
]);

/** Any photo that only ever renders as a small circle — transfer deal photos, author bylines. */
export const CirclePhotoInput = createSmartImageInput([{ label: "Circle avatar", width: 76, height: 76, round: true }]);

/** Article cover photos and inline story images — always a 16:9 crop (see articleImageUrl). */
export const HeroPhotoInput = createSmartImageInput([{ label: "Article hero (16:9)", width: 220, height: 124 }]);

/**
 * Renders the SAME crop the live site will — an uncropped source image
 * with CSS object-fit:cover + object-position from the hotspot fraction
 * (see PlayerCard.tsx) — rather than asking Sanity's image API for a
 * separately-cropped preview, so what an editor sees here is exactly
 * what ships, not a close approximation of it.
 */
function PreviewFrame({
  label,
  src,
  focus,
  width,
  height,
  round = false,
}: CropPreviewSpec & { src: string; focus: { x: number; y: number } }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width,
          height,
          borderRadius: round ? "50%" : 6,
          border: "1.5px solid rgba(0,0,0,.15)",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${focus.x * 100}% ${focus.y * 100}%`,
            display: "block",
          }}
        />
      </div>
      <span style={{ font: "600 10px sans-serif", color: "#8b90a0", letterSpacing: ".02em", textAlign: "center" }}>{label}</span>
    </div>
  );
}
