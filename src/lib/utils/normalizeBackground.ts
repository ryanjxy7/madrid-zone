import sharp from "sharp";

type Rgb = [number, number, number];

function colorDistance(a: Rgb, b: Rgb): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function average(colors: Rgb[]): Rgb {
  const sum = colors.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]] as Rgb, [0, 0, 0] as Rgb);
  return [sum[0] / colors.length, sum[1] / colors.length, sum[2] / colors.length];
}

/** A flat studio-cutout background (not a real photographic scene) — all four corners land within a tight color distance of each other. */
function looksLikeFlatBackground(corners: Rgb[]): boolean {
  const bg = average(corners);
  return corners.every((corner) => colorDistance(corner, bg) < 18);
}

const BACKGROUND_MATCH_THRESHOLD = 40;

/**
 * Player photos are often flat-cutout PNGs with a plain white or black
 * backdrop (occasionally left transparent). The site always wants a
 * clean white backdrop behind the subject regardless of theme, so this:
 * 1. flattens any transparency straight to white (the common case, and
 *    fully reliable — no detection needed), then
 * 2. samples the four corners, and if they're a flat single colour
 *    (a real photographed background varies too much to pass this
 *    check, so this only ever fires on plain studio cutouts), chroma-keys
 *    anything close to that corner colour to solid white.
 * This is a colour-distance heuristic, not real subject segmentation —
 * it's designed for flat-backdrop player cutouts, not arbitrary photos.
 */
export async function normalizeToWhiteBackground(input: Buffer): Promise<Buffer> {
  const flattened = await sharp(input).flatten({ background: "#ffffff" }).toBuffer();

  const image = sharp(flattened);
  const { width, height } = await image.metadata();
  if (!width || !height) return image.png().toBuffer();

  const { data, info } = await image.clone().raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const pixelAt = (x: number, y: number): Rgb => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const corners: Rgb[] = [pixelAt(0, 0), pixelAt(width - 1, 0), pixelAt(0, height - 1), pixelAt(width - 1, height - 1)];
  if (!looksLikeFlatBackground(corners)) {
    return flattened;
  }

  const bg = average(corners);
  if (colorDistance(bg, [255, 255, 255]) < 8) {
    // Already a white backdrop — nothing to key out.
    return flattened;
  }

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const pixel: Rgb = [out[i], out[i + 1], out[i + 2]];
    if (colorDistance(pixel, bg) < BACKGROUND_MATCH_THRESHOLD) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
    }
  }

  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}
