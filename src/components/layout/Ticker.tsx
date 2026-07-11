import { getWireItems } from "@/lib/data/articles";

export async function Ticker() {
  const items = await getWireItems();

  return (
    <div className="flex h-9 items-center overflow-hidden bg-ink-900 sm:h-[38px]">
      <div className="flex h-full flex-none items-center bg-brand px-3 font-display text-[10px] font-bold tracking-[0.1em] text-white sm:px-3.5 sm:text-[11px]">
        LIVE NEWS
      </div>
      <div className="flex items-center gap-6 overflow-hidden whitespace-nowrap px-3 font-body text-[11px] font-medium text-muted sm:gap-8 sm:px-5 sm:text-xs">
        {items.map((item) => (
          <span key={item.time} className="flex-none">
            <b className="mr-2 text-heading">{item.time}</b>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
