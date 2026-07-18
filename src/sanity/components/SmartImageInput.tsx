import { createImageUrlBuilder } from "@sanity/image-url";
import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const justFinishedUploading = wasUploading.current && !isUploading;
    wasUploading.current = isUploading;

    if (!justFinishedUploading || !assetRef || value?.hotspot) return;

    let cancelled = false;
    setStatus("detecting");
    const previewUrl = builder.image(assetRef).width(1000).url();

    loadImage(previewUrl)
      .then(detectAutoHotspot)
      .then((hotspot) => {
        if (cancelled) return;
        onChange(set(hotspot, ["hotspot"]));
        setStatus("done");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading, assetRef]);

  const previewSource = assetRef ? { ...value, asset: { _ref: assetRef, _type: "reference" as const } } : null;

  return (
    <div className="flex flex-col gap-3">
      {props.renderDefault(props)}

      {status === "detecting" ? (
        <p style={{ font: "600 12px sans-serif", color: "#8b90a0" }}>Auto-framing the photo…</p>
      ) : null}

      {previewSource ? (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end", padding: "8px 0" }}>
          <PreviewFrame
            label="Circle avatar"
            src={builder.image(previewSource).width(160).height(160).fit("crop").url()}
            size={64}
            round
          />
          <PreviewFrame
            label="Card frame"
            src={builder.image(previewSource).width(240).height(320).fit("crop").url()}
            width={90}
            height={120}
          />
        </div>
      ) : null}
    </div>
  );
}

function PreviewFrame({
  label,
  src,
  size,
  width,
  height,
  round = false,
}: {
  label: string;
  src: string;
  size?: number;
  width?: number;
  height?: number;
  round?: boolean;
}) {
  const w = width ?? size ?? 64;
  const h = height ?? size ?? 64;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={w}
        height={h}
        style={{
          width: w,
          height: h,
          objectFit: "cover",
          borderRadius: round ? "50%" : 6,
          border: "1.5px solid rgba(0,0,0,.15)",
          display: "block",
        }}
      />
      <span style={{ font: "600 10.5px sans-serif", color: "#8b90a0", letterSpacing: ".02em" }}>{label}</span>
    </div>
  );
}
