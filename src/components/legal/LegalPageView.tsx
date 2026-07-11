import { siteConfig } from "@/lib/seo/constants";
import { formatDate } from "@/lib/utils/format";
import type { LegalPage } from "@/types/content";

export function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <div className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-[760px] flex-col gap-4">
        <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">
          {page.title.toUpperCase()}
        </h1>
        <p className="font-body text-xs text-muted">Last updated: {formatDate(page.updatedAt)}</p>

        {page.sections.map((section) => (
          <div key={section.heading} className="flex flex-col gap-2 border-t border-border pt-4">
            <h2 className="font-display text-[17px] font-bold tracking-[0.04em] text-heading">{section.heading}</h2>
            <p className="font-body text-sm leading-relaxed text-subtle">{section.body}</p>
          </div>
        ))}

        <div className="rounded-md border border-border bg-card p-4 font-body text-[12.5px] leading-relaxed text-muted">
          Questions about this policy? Contact <span className="text-heading">{siteConfig.emails.press}</span>.
        </div>
      </div>
    </div>
  );
}
