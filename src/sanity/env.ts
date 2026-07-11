/**
 * Sanity project connection details. Project ID and dataset are not
 * secret (they're baked into the client bundle for the embedded Studio at
 * /studio), so they use NEXT_PUBLIC_ vars. Only the write token
 * (SANITY_API_TOKEN) and webhook secret stay server-only.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// A syntactically valid placeholder so `sanity.config.ts` never crashes the
// build before a real project exists — see design/../README for setup.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder-project";

export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

export const studioUrl = "/studio";
