import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

export { isSanityConfigured };

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: false,
});

/**
 * Runs a GROQ query against Sanity. Returns `null` when Sanity isn't
 * configured, or if the request fails, so every caller in
 * src/lib/data/*.ts can fall back to placeholder data uniformly.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  { revalidate = 60, tags = ["sanity"] }: { revalidate?: number | false; tags?: string[] } = {}
): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: revalidate === false ? { tags } : { revalidate, tags },
    });
  } catch (error) {
    console.error("[sanity] query failed, falling back to placeholder data:", error);
    return null;
  }
}
