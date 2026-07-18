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
 * backdrop (occasionally left transparent). Samples the four corners, and
 * if they're a flat single colour (a real photographed background varies
 * too much to pass this check, so this only ever fires on plain studio
 * cutouts), chroma-keys anything close to that corner colour to the given
 * replacement. This is a colour-distance heuristic, not real subject
 * segmentation — designed for flat-backdrop player cutouts, not arbitrary
 * photos.
 *
 * `replacement: "white"` bakes an opaque white backdrop everywhere (also
 * flattening any transparency to white first) — used for the small photo
 * circles (scorers, assists, stat leaders, player profile) where nothing
 * else needs to show through.
 *
 * `replacement: "transparent"` keys the flat background out to alpha 0
 * instead, and leaves existing transparency alone rather than flattening
 * it — used for the Squad card's avatar, whose photo sits over a design
 * element (the big number watermark) that's meant to show through the
 * cutout's negative space. The card's own white backdrop still shows
 * through the transparency, so the visible result is the same "always
 * white" backdrop — it just doesn't destroy the alpha channel to get there.
 */
export async function normalizeBackground(input: Buffer, replacement: "white" | "transparent" = "white"): Promise<Buffer> {
  const base = replacement === "white" ? await sharp(input).flatten({ background: "#ffffff" }).toBuffer() : await sharp(input).ensureAlpha().toBuffer();

  const image = sharp(base);
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
    return base;
  }

  const bg = average(corners);
  if (replacement === "white" && colorDistance(bg, [255, 255, 255]) < 8) {
    // Already a white backdrop — nothing to key out.
    return base;
  }

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const pixel: Rgb = [out[i], out[i + 1], out[i + 2]];
    if (colorDistance(pixel, bg) < BACKGROUND_MATCH_THRESHOLD) {
      if (replacement === "white") {
        out[i] = 255;
        out[i + 1] = 255;
        out[i + 2] = 255;
      } else if (channels === 4) {
        out[i + 3] = 0;
      }
    }
  }

  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}
