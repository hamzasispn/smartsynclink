"use client";

import { useEffect } from "react";

/**
 * Runs inside the builder's preview iframe only — never on the public site.
 *
 * Hover outlines each section with its name; a click selects it and tells the
 * builder which one. Clicks are swallowed here, so links, popups and sliders in
 * the preview don't navigate away mid-edit.
 *
 * Text a custom section marks with data-builder-field edits in place: double
 * click, type, Enter (or click away) saves, Escape cancels. The new text goes
 * to the builder, which writes it into the section like any other edit — so it
 * lands in undo history and autosaves.
 */

const STYLE = `
[data-builder-id]{position:relative}
[data-builder-id]:hover{outline:2px dashed rgba(51,0,234,.55);outline-offset:-2px;cursor:pointer}
[data-builder-id].builder-selected{outline:2px solid #3300ea;outline-offset:-2px}
[data-builder-id]:hover::after,[data-builder-id].builder-selected::after{
  content:attr(data-builder-label);position:absolute;top:10px;left:10px;z-index:2147483000;
  background:#3300ea;color:#fff;font:500 12px/1 Inter,system-ui,sans-serif;padding:6px 9px;border-radius:7px;pointer-events:none}
.builder-selected [data-builder-field]{cursor:text}
.builder-selected [data-builder-field]:hover{outline:1px dashed #16a34a;outline-offset:3px}
[data-builder-editing]{outline:2px solid #16a34a!important;outline-offset:3px;cursor:text;caret-color:#16a34a}
`;

export function PreviewBridge() {
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
      const target = event.target as Element | null;
      // a click inside text being edited just moves the caret
      if (target?.closest?.("[data-builder-editing]")) return;
      const el = target?.closest?.<HTMLElement>("[data-builder-id]");
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!el) return;
      selected = el.dataset.builderId ?? null;
      mark(false);
      send({ type: "builder:select", id: selected });
    };

    const startEditing = (event: MouseEvent) => {
      const field = (event.target as Element | null)?.closest?.<HTMLElement>("[data-builder-field]");
      const section = field?.closest<HTMLElement>("[data-builder-id]");
      if (!field || !section) return;
      event.preventDefault();
      event.stopImmediatePropagation();

      const original = field.textContent ?? "";
      let cancelled = false;

      field.setAttribute("contenteditable", "plaintext-only");
      field.setAttribute("data-builder-editing", "");
      field.focus();
      const range = document.createRange();
      range.selectNodeContents(field);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          field.blur();
        } else if (e.key === "Escape") {
          cancelled = true;
          field.textContent = original;
          field.blur();
        }
      };

      const finish = () => {
        field.removeEventListener("keydown", onKey);
        field.removeAttribute("contenteditable");
        field.removeAttribute("data-builder-editing");
        const value = (field.textContent ?? "").trim();
        const changed = !cancelled && value !== original.trim();
        // typing replaced text nodes React still points at; the preview remounts
        // this section (with the new document, if one is coming) to own them again
        window.postMessage(
          { type: "builder:stale", id: section.dataset.builderId, pending: changed },
          window.location.origin,
        );
        if (!changed) return;
        send({
          type: "builder:field",
          id: section.dataset.builderId,
          path: field.dataset.builderField,
          value,
        });
      };

      field.addEventListener("keydown", onKey);
      field.addEventListener("blur", finish, { once: true });
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; id?: string | null };
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
    document.addEventListener("dblclick", startEditing, true);
    window.addEventListener("message", onMessage);
    send({ type: "builder:ready" });

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("dblclick", startEditing, true);
      window.removeEventListener("message", onMessage);
      observer.disconnect();
      style.remove();
    };
  }, []);

  return null;
}
