export function Tag({ children, variant = "solid" }: { children: React.ReactNode; variant?: "solid" | "soft" }) {
  if (variant === "soft") {
    return (
      <span className="w-fit rounded-[3px] bg-negative/15 px-2 py-[3px] font-display text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
        {children}
      </span>
    );
  }
  return (
    <span className="w-fit rounded-sm bg-brand px-2 py-[3px] font-display text-[10px] font-bold uppercase tracking-[0.1em] text-white">
      {children}
    </span>
  );
}
