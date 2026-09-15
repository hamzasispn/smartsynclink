"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Runs inside the builder's preview iframe only — never on the public site.
 *
 * Hover outlines each section with its name; a click selects it and tells the
 * builder which one. Clicks are swallowed here, so links, popups and sliders in
 * the preview don't navigate away mid-edit. The builder talks back to ask for a
 * refresh after an autosave, or to highlight the section picked in its list.
 */

const STYLE = `
[data-builder-id]{position:relative}
[data-builder-id]:hover{outline:2px dashed rgba(51,0,234,.55);outline-offset:-2px;cursor:pointer}
[data-builder-id].builder-selected{outline:2px solid #3300ea;outline-offset:-2px}
[data-builder-id]:hover::after,[data-builder-id].builder-selected::after{
  content:attr(data-builder-label);position:absolute;top:10px;left:10px;z-index:2147483000;
  background:#3300ea;color:#fff;font:500 12px/1 Inter,system-ui,sans-serif;padding:6px 9px;border-radius:7px;pointer-events:none}
`;

export function PreviewBridge() {
  const router = useRouter();

  useEffect(() => {
    if (window.parent === window) return;

    const style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    let selected: string | null = null;
    const send = (message: object) => window.parent.postMessage(message, window.location.origin);

    const mark = (scroll: boolean) => {
      document.querySelectorAll(".builder-selected").forEach((el) => el.classList.remove("builder-selected"));
      if (!selected) return;
      const el = document.querySelector<HTMLElement>(`[data-builder-id="${CSS.escape(selected)}"]`);
      if (!el) return;
      el.classList.add("builder-selected");
      if (scroll) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest?.<HTMLElement>("[data-builder-id]");
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!el) return;
      selected = el.dataset.builderId ?? null;
      mark(false);
      send({ type: "builder:select", id: selected });
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; id?: string | null };
      if (data?.type === "builder:refresh") router.refresh();
      if (data?.type === "builder:select") {
        selected = data.id ?? null;
        mark(true);
      }
    };

    // a refresh re-renders the sections and can drop the selection class
    const observer = new MutationObserver(() => {
      if (selected && !document.querySelector(".builder-selected")) mark(false);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMessage);
    send({ type: "builder:ready" });

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      observer.disconnect();
      style.remove();
    };
  }, [router]);

  return null;
}
