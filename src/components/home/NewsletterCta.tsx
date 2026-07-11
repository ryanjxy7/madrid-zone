"use client";

import { useState, type FormEvent } from "react";

export function NewsletterCta({
  heading = "THE MZ BRIEFING",
  body = "Daily email. Every Madrid story that matters.",
}: {
  heading?: string;
  body?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to a newsletter provider (Beehiiv, Buttondown, etc.).
    setStatus("submitted");
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-md bg-brand p-4 sm:p-[18px]">
      <span className="font-display text-[15px] font-bold tracking-[0.06em] text-white">{heading}</span>
      <p className="font-body text-xs leading-relaxed text-[#ffd9de]">{body}</p>
      {status === "submitted" ? (
        <p className="font-body text-xs font-semibold text-white">You&apos;re on the list — check your inbox to confirm.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 rounded-[4px] bg-white px-2.5 py-2 font-body text-xs text-[#666c7c] outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-[4px] bg-ink-900 px-3 py-2 font-body text-xs font-semibold text-white"
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}
