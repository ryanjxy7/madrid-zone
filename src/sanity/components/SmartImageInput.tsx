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

/**
 * Wraps Sanity Studio's default image input with two things editors asked
 * for: the crop auto-adjusts the moment a new photo finishes uploading
 * (smartcrop.js saliency + skin-tone detection — a heuristic, not a true
 * ML face detector, but it reliably gravitates to faces/subjects in
 * portrait photos with no external API calls or model downloads), and a
 * live preview of exactly how that crop will render on the live site —
 * a circle avatar and a card-frame — so there's no more "upload, check
 * the site, re-upload" cycle.
 */
export function SmartImageInput(props: SmartImageInputProps) {
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
  const avatarSrc = previewSource ? builder.image(previewSource).width(240).fit("max").url() : null;
  const focus = hotspot ? { x: hotspot.x, y: hotspot.y } : { x: 0.5, y: 0.5 };

  return (
    <div className="flex flex-col gap-3">
      {props.renderDefault(props)}

      {status === "detecting" ? (
        <p style={{ font: "600 12px sans-serif", color: "#8b90a0" }}>Auto-framing the photo…</p>
      ) : null}

      {previewSource && avatarSrc ? (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end", padding: "8px 0", flexWrap: "wrap" }}>
          <PreviewFrame label="Circle avatar" src={avatarSrc} focus={focus} size={64} round />
          <PreviewFrame label="Card frame" src={avatarSrc} focus={focus} width={140} height={72} />
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
              padding: "6px 12px",
              cursor: status === "detecting" ? "default" : "pointer",
              alignSelf: "center",
            }}
          >
            Re-detect crop
          </button>
        </div>
      ) : null}
    </div>
  );
}

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
  size,
  width,
  height,
  round = false,
}: {
  label: string;
  src: string;
  focus: { x: number; y: number };
  size?: number;
  width?: number;
  height?: number;
  round?: boolean;
}) {
  const w = width ?? size ?? 64;
  const h = height ?? size ?? 64;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: w,
          height: h,
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
      <span style={{ font: "600 10.5px sans-serif", color: "#8b90a0", letterSpacing: ".02em" }}>{label}</span>
    </div>
  );
}
