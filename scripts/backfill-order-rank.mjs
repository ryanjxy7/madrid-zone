/**
 * One-time fix for Sanity Studio's "N/N documents have no order. Select
 * Reset Order..." message. That message appears because the orderRank
 * field (used by Squad/Transfer Deals/Sponsors' new drag-and-drop lists)
 * is brand new — documents created before it existed don't have a value
 * for it yet, so the Studio list locks itself until every document in
 * that list has one.
 *
 * This does exactly what clicking "Reset Order" in Studio does (same
 * field name, same lexorank library, same algorithm), just for every
 * affected type in one run instead of one list at a time. It only sets
 * the orderRank field — nothing else is read, changed, or deleted.
 *
 * Usage:
 *   node --env-file=.env.local scripts/backfill-order-rank.mjs
 *
 * Requires SANITY_API_TOKEN in .env.local with Editor (or Administrator)
 * permission — create one at https://www.sanity.io/manage under your
 * project > API > Tokens.
 */
import { createClient } from "@sanity/client";
import { LexoRank } from "lexorank";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN — check .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-06-27",
  useCdn: false,
});

const TYPES_TO_BACKFILL = ["player", "transferDeal", "sponsor"];

for (const type of TYPES_TO_BACKFILL) {
  const docs = await client.fetch(
    `*[_type == $type && !(_id in path("drafts.**")) && !defined(orderRank)] | order(_createdAt asc)._id`,
    { type }
  );

  if (docs.length === 0) {
    console.log(`${type}: nothing to backfill (all documents already have an order).`);
    continue;
  }

  let rank = LexoRank.min();
  const trx = client.transaction();
  for (const id of docs) {
    rank = rank.genNext().genNext();
    trx.patch(id, { set: { orderRank: rank.toString() } });
  }
  await trx.commit();
  console.log(`${type}: assigned an initial order to ${docs.length} document(s).`);
}

console.log("Done. Refresh Sanity Studio — every list should be editable and draggable now.");
