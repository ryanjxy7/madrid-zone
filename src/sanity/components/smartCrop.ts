import smartcrop from "smartcrop";
import type { ImageHotspot } from "sanity";

/**
 * Analyses an already-loaded image element with smartcrop.js — saliency
 * (edge/contrast) + skin-tone detection, which in practice gravitates
 * toward faces in portrait photos without a heavyweight ML model — and
 * converts its best square crop into a Sanity hotspot (focal point +
 * size, normalised 0-1 against the *original* image). Hotspot is
 * aspect-ratio-agnostic, so the same detected focal point centers the
 * subject correctly whether the site later renders it as a circle
 * avatar or a taller portrait card.
 */
export async function detectAutoHotspot(image: HTMLImageElement): Promise<ImageHotspot> {
  const { naturalWidth: width, naturalHeight: height } = image;
  const targetSize = Math.round(Math.min(width, height));
  const { topCrop } = await smartcrop.crop(image, {
    width: targetSize,
    height: targetSize,
  });

  return {
    _type: "sanity.imageHotspot",
    x: (topCrop.x + topCrop.width / 2) / width,
    y: (topCrop.y + topCrop.height / 2) / height,
    width: topCrop.width / width,
    height: topCrop.height / height,
  };
}

/** Loads a CORS-enabled image element from a URL, resolving once it's ready to analyse. */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image for auto-crop: ${url}`));
    image.src = url;
  });
}
