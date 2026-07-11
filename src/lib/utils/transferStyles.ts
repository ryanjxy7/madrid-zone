import type { TransferDirection, TransferStatus } from "@/types/football";

/**
 * Tailwind's compiler needs literal class strings — it can't see classes
 * built from runtime template interpolation — so each tone is spelled out
 * in full rather than composed from a template.
 */
const statusToneClasses: Record<TransferStatus, string> = {
  CONFIRMED: "bg-positive/15 text-positive",
  ADVANCED: "bg-warning/15 text-warning",
  MEDICAL: "bg-warning/15 text-warning",
  TALKS: "bg-negative/15 text-negative",
  AGREED: "bg-negative/15 text-negative",
  RUMOUR: "bg-neutral/15 text-neutral",
};

const directionToneClasses: Record<TransferDirection, string> = {
  IN: "text-positive",
  OUT: "text-negative",
  LOAN: "text-neutral",
};

export function statusClasses(status: TransferStatus): string {
  return statusToneClasses[status];
}

export function directionClasses(direction: TransferDirection): string {
  return directionToneClasses[direction];
}
