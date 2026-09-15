"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { newSection } from "@/lib/builder/instance";
import { Inspector } from "./inspector";
import { StructurePanel } from "./structure-panel";
import { useBuilder } from "./use-builder";

/**
 * The page builder: structure on the left, the real page in the middle, the
 * selection's settings on the right.
 *
 * The middle is an iframe of /builder-preview — the same server renderer the
 * live site uses, sized to the chosen device so breakpoints really apply.
 * Edits autosave as a draft and the preview re-renders after each save;
 * nothing reaches the live site until Publish.
 */

const WIDTHS = { desktop: "100%", tablet: "820px", mobile: "390px" } as const;
type DeviceView = keyof typeof WIDTHS;

const STATUS_TEXT = {
  loading: "Loading…",
  saving: "Saving draft…",
  unsaved: "Unsaved changes",
  saved: "Draft saved",
  error: "Save failed",
} as const;

const svg = (d: string) => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export function Builder({ initialPage }: { initialPage: string }) {
  const b = useBuilder(initialPage);
  const [selected, setSelected] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceView>("desktop");
  const [notice, setNotice] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  const post = useCallback((message: object) => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  const select = useCallback(
    (id: string | null) => {
      setSelected(id);
      post({ type: "builder:select", id });
    },
    [post],
  );

  // the preview reports clicks and when it has (re)loaded
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      const data = event.data as { type?: string; id?: string };
      if (data?.type === "builder:select") setSelected(data.id ?? null);
      if (data?.type === "builder:ready" && selected) post({ type: "builder:select", id: selected });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post, selected]);

  // a saved draft is the preview's cue to re-render
  useEffect(() => {
    if (b.revision) post({ type: "builder:refresh" });
  }, [b.revision, post]);

  // undo / redo from the keyboard, unless the cursor is in a field
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) b.redo();
      else b.undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [b]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(t);
  }, [notice]);

  const { doc, loaded } = b;

  const move = (from: number, to: number) =>
    b.edit((d) => {
      const [s] = d.layout.sections.splice(from, 1);
      d.layout.sections.splice(Math.max(0, Math.min(to, d.layout.sections.length)), 0, s);
    });

  const toggleHidden = (id: string) =>
    b.edit((d) => {
      const s = d.layout.sections.find((x) => x.id === id);
      if (s) s.hidden = !s.hidden;
    });

  const duplicate = (id: string) => {
    const copy = { id: "" };
    b.edit((d) => {
      const i = d.layout.sections.findIndex((x) => x.id === id);
      if (i < 0) return;
      const source = d.layout.sections[i];
      const clone = { ...structuredClone(source), id: newSection(source.type).id };
      clone.label = `${source.label || ""}${source.label ? " " : ""}(copy)`.trim();
      d.layout.sections.splice(i + 1, 0, clone);
      copy.id = clone.id;
    });
    if (copy.id) setSelected(copy.id);
  };

  const remove = (id: string) => {
    b.edit((d) => {
      d.layout.sections = d.layout.sections.filter((x) => x.id !== id);
    });
    if (selected === id) setSelected(null);
  };

  const add = (type: string) => {
    const section = newSection(type);
    b.edit((d) => {
      const at = d.layout.sections.findIndex((x) => x.id === selected);
      d.layout.sections.splice(at >= 0 ? at + 1 : d.layout.sections.length, 0, section);
    });
    setSelected(section.id);
  };

  const page = loaded?.page;
  const groups = ["Pages", "Industries", "Legal"] as const;
  const iconBtn = "grid size-9 place-items-center rounded-lg text-ink transition-colors hover:bg-surface disabled:opacity-35 disabled:hover:bg-transparent";

  return (
    <div className="flex h-dvh flex-col bg-surface text-ink">
      {/* ---------------- top bar ---------------- */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-white px-3">
        <Link href="/admin" className="rounded-lg px-2 py-1.5 text-[13px] text-muted hover:bg-surface hover:text-ink">
          ← Admin
        </Link>

        <select
          value={b.pageKey}
          onChange={(e) => {
            setSelected(null);
            void b.switchPage(e.target.value);
          }}
          className="max-w-[240px] rounded-lg border border-line bg-white px-3 py-1.5 text-[13.5px] font-medium outline-none focus:border-brand"
          aria-label="Page"
        >
          {!loaded ? <option value={b.pageKey}>{b.pageKey}</option> : null}
          {groups.map((group) => {
            const items = loaded?.pages.filter((p) => p.group === group) ?? [];
            return items.length ? (
              <optgroup key={group} label={group}>
                {items.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            ) : null;
          })}
        </select>

        <div className="mx-auto flex items-center gap-1 rounded-xl bg-surface p-1" role="group" aria-label="Preview size">
          {(
            [
              ["desktop", "M3 4h18v12H3zM8 20h8M12 16v4"],
              ["tablet", "M6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2"],
              ["mobile", "M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2"],
            ] as [DeviceView, string][]
          ).map(([key, path]) => (
            <button
              key={key}
              type="button"
              onClick={() => setDevice(key)}
              aria-pressed={device === key}
              aria-label={key}
              className={`grid size-8 place-items-center rounded-lg transition-colors ${device === key ? "bg-white text-brand shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {svg(path)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button type="button" className={iconBtn} onClick={b.undo} disabled={!b.canUndo} aria-label="Undo (Ctrl+Z)" title="Undo (Ctrl+Z)">
            {svg("M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3")}
          </button>
          <button type="button" className={iconBtn} onClick={b.redo} disabled={!b.canRedo} aria-label="Redo (Ctrl+Shift+Z)" title="Redo (Ctrl+Shift+Z)">
            {svg("m15 14 5-5-5-5M20 9H9a5 5 0 0 0 0 10h3")}
          </button>
        </div>

        <span className={`w-[118px] text-[12.5px] ${b.status === "error" ? "text-red-600" : "text-muted"}`} aria-live="polite">
          {STATUS_TEXT[b.status]}
        </span>

        {loaded?.history.length ? (
          <select
            value=""
            onChange={(e) => {
              const at = e.target.value;
              if (at && window.confirm("Load this published version as the draft? Your current draft is replaced.")) {
                void b.restore(at);
              }
            }}
            className="rounded-lg border border-line bg-white px-2 py-1.5 text-[12.5px] text-muted outline-none"
            aria-label="Restore a previous version"
          >
            <option value="">History</option>
            {loaded.history.map((at) => (
              <option key={at} value={at}>
                {new Date(at).toLocaleString()}
              </option>
            ))}
          </select>
        ) : null}

        {b.unpublished ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Throw away every unpublished change on this page, the shared blocks and the header/footer?")) {
                void b.discard();
              }
            }}
            className="rounded-lg px-3 py-1.5 text-[13px] text-muted hover:bg-surface hover:text-red-600"
          >
            Discard
          </button>
        ) : null}

        {page ? (
          <a href={page.path} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-[13px] hover:border-brand">
            View live
          </a>
        ) : null}

        <button
          type="button"
          onClick={async () => {
            if (await b.publish()) setNotice("Published — the live site is updated.");
          }}
          disabled={!doc || b.status === "saving" || (!b.unpublished && b.status === "saved")}
          className="rounded-lg bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-4 py-2 text-[13.5px] font-medium text-white transition-opacity disabled:opacity-40"
        >
          Publish
        </button>
      </header>

      {b.error ? <p className="bg-red-50 px-4 py-2 text-[13px] text-red-700">{b.error}</p> : null}
      {notice ? <p className="bg-emerald-50 px-4 py-2 text-[13px] text-emerald-800">{notice}</p> : null}

      {/* ---------------- panes ---------------- */}
      <div className="flex min-h-0 flex-1">
        <aside className="w-[300px] shrink-0 border-r border-line bg-page">
          {doc ? (
            <StructurePanel
              layout={doc.layout}
              selected={selected}
              onSelect={(id) => select(id)}
              onMove={move}
              onToggleHidden={toggleHidden}
              onDuplicate={duplicate}
              onDelete={remove}
              onAdd={add}
            />
          ) : (
            <p className="p-4 text-[13px] text-muted">Loading structure…</p>
          )}
        </aside>

        <div className="flex min-w-0 flex-1 justify-center overflow-auto p-4">
          <div
            className={`h-full overflow-hidden bg-white shadow-lift transition-[width] duration-300 ${device === "desktop" ? "rounded-lg" : "rounded-[28px] border-[6px] border-ink"}`}
            style={{ width: WIDTHS[device], maxWidth: "100%" }}
          >
            <iframe
              key={b.pageKey}
              ref={frame}
              src={`/builder-preview?page=${encodeURIComponent(b.pageKey)}`}
              title="Page preview"
              className="size-full border-0"
            />
          </div>
        </div>

        <aside className="w-[380px] shrink-0 border-l border-line bg-page">
          {doc && loaded ? (
            <Inspector key={selected ?? "none"} doc={doc} selected={selected} pages={loaded.pages} edit={b.edit} onClose={() => select(null)} />
          ) : null}
        </aside>
      </div>
    </div>
  );
}
