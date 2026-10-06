"use client";

import { useLinkStatus } from "next/link";

/**
 * Inside a blog <Link>: feedback while the page it opens is on its way. The
 * blog is rendered per request (a tag, a page, a search), so a click used to
 * look like nothing had happened until the new page arrived — "why doesn't it
 * go to page one?" on the client call. Always rendered, only its opacity
 * changes, so nothing shifts. The Link needs `relative`.
 */
export function LinkPending({ shape = "ring" }: { shape?: "ring" | "pill" }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute transition-opacity duration-150 ${pending ? "opacity-100" : "opacity-0"} ${
        shape === "ring"
          ? "-inset-1 animate-spin rounded-full border-2 border-brand border-t-transparent"
          : "inset-0 animate-pulse rounded-full bg-white/45"
      }`}
    />
  );
}
