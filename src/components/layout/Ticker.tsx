import Link from "next/link";
import { getSchedule } from "@/lib/data/articles";

export async function Ticker() {
  const items = await getSchedule();

  return (
    <div className="flex h-9 items-center overflow-hidden bg-ink-900 sm:h-[38px]">
      <div className="flex h-full flex-none items-center bg-brand px-3 font-display text-[10px] font-bold tracking-[0.1em] text-white sm:px-3.5 sm:text-[11px]">
        LIVE
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          className="flex w-max gap-8 whitespace-nowrap px-4 font-body text-[11px] font-medium text-muted sm:gap-10 sm:px-5 sm:text-xs"
          style={{ animation: "mz-ticker 36s linear infinite" }}
        >
          {[0, 1].map((pass) => (
            <div key={pass} className="flex gap-8 sm:gap-10" aria-hidden={pass === 1}>
              {items.map((item, index) => (
                <Link key={`${pass}-${index}`} href="/matches" className="flex flex-none items-center gap-2">
                  <b className="text-heading">{item.time}</b>
                  {item.text}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
