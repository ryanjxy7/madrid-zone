export function AdSlot({ width = 300, height = 250 }: { width?: number; height?: number }) {
  return (
    <div
      className="flex w-full items-center justify-center rounded-md border border-dashed border-border-strong font-mono text-[11px] text-muted"
      style={{
        height,
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--card) 0 12px, var(--surface) 12px 24px)",
      }}
      role="complementary"
      aria-label="Advertisement"
    >
      [ ad slot {width}×{height} ]
    </div>
  );
}
