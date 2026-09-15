"use client";

import { useState } from "react";
import { assistAction } from "@/app/admin/ai-actions";
import { defaultGlobal } from "@/content/global";
import type { BuilderPage } from "@/lib/builder/pages";
import { SECTIONS } from "@/lib/builder/sections";
import type { Device } from "@/lib/builder/types";
import { ContentEditor } from "../admin/content-editor";
import type { BuilderDoc } from "./use-builder";

/**
 * The right column: whatever is selected, editable.
 *
 * Content reuses the dashboard's document walker, so every text, image, video,
 * list and button a section has is already editable here — the builder adds
 * placement, not a second form system. Each selection is wrapped under one
 * named key so the walker shows it as a single open panel.
 */

type Edit = (mutate: (draft: BuilderDoc) => void, coalesce?: boolean) => void;

async function assist({ text, instruction, context }: { text: string; instruction: string; context: string }) {
  const result = await assistAction({ kind: "rewrite", text, instruction, context });
  if (!result.ok) throw new Error(result.error);
  if (result.kind !== "rewrite") throw new Error("Unexpected response");
  return result.text;
}

const DEVICES: { key: Device; label: string }[] = [
  { key: "desktop", label: "Desktop" },
  { key: "tablet", label: "Tablet" },
  { key: "mobile", label: "Mobile" },
];

function Heading({ title, sub, onClose }: { title: string; sub?: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-ink">{title}</p>
        {sub ? <p className="mt-0.5 text-[12px] text-muted">{sub}</p> : null}
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="grid size-7 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink">
        ✕
      </button>
    </div>
  );
}

export function Inspector({
  doc,
  selected,
  pages,
  edit,
  onClose,
}: {
  doc: BuilderDoc;
  selected: string | null;
  pages: BuilderPage[];
  edit: Edit;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"content" | "visibility">("content");

  if (!selected) {
    return (
      <div className="grid h-full place-items-center px-8 text-center">
        <div>
          <p className="text-[15px] font-medium text-ink">Nothing selected</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Click a section in the preview, or pick one from the structure list, to edit its content and where it shows.
          </p>
        </div>
      </div>
    );
  }

  if (selected === "__header") {
    return (
      <div className="flex h-full flex-col">
        <Heading title="Header & menu" sub="Logo, links, mega menu panels and the header buttons — on every page." onClose={onClose} />
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <ContentEditor
            key="header"
            value={{ brand: doc.global.brand, nav: doc.global.nav } as never}
            shape={{ brand: defaultGlobal.brand, nav: defaultGlobal.nav }}
            assist={assist}
            onChange={(next) =>
              edit((d) => {
                d.global.brand = next.brand as never;
                d.global.nav = next.nav as never;
              }, true)
            }
          />
        </div>
      </div>
    );
  }

  if (selected === "__footer") {
    return (
      <div className="flex h-full flex-col">
        <Heading title="Footer" sub="Columns, newsletter, contact details — on every page." onClose={onClose} />
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <ContentEditor
            key="footer"
            value={{ footer: doc.global.footer } as never}
            shape={{ footer: defaultGlobal.footer }}
            assist={assist}
            onChange={(next) =>
              edit((d) => {
                d.global.footer = next.footer as never;
              }, true)
            }
          />
        </div>
      </div>
    );
  }

  const index = doc.layout.sections.findIndex((s) => s.id === selected);
  const section = doc.layout.sections[index];
  if (!section) return null;
  const meta = SECTIONS[section.type];
  const content = section.linked ? doc.blocks[section.type] : section.props;

  const change = (mutate: (s: (typeof doc.layout.sections)[number], d: BuilderDoc) => void, coalesce = false) =>
    edit((d) => {
      const target = d.layout.sections.find((s) => s.id === selected);
      if (target) mutate(target, d);
    }, coalesce);

  const tabBtn = (key: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={`flex-1 rounded-lg py-1.5 text-[13px] font-medium transition-colors ${tab === key ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      <Heading title={section.label || meta.label} sub={meta.description} onClose={onClose} />

      <div className="space-y-3 border-b border-line px-5 py-3">
        <label className="block">
          <span className="mb-1 block text-[11.5px] font-medium text-muted">Name in the structure list</span>
          <input
            value={section.label}
            placeholder={meta.label}
            onChange={(e) => change((s) => (s.label = e.target.value), true)}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] outline-none focus:border-brand"
          />
        </label>

        {meta.linked ? (
          section.linked ? (
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-amber-900">
              <strong>Global block.</strong> Changes here show on every page that uses it.{" "}
              <button
                type="button"
                className="font-medium underline"
                onClick={() =>
                  change((s, d) => {
                    s.props = structuredClone(d.blocks[s.type]);
                    s.linked = false;
                  })
                }
              >
                Make a separate copy for this page
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-surface px-3 py-2.5 text-[12.5px] leading-relaxed text-muted">
              This page has its own copy.{" "}
              <button
                type="button"
                className="font-medium text-brand underline"
                onClick={() => {
                  if (window.confirm("Switch back to the global version? This page's own copy will be dropped.")) {
                    change((s) => {
                      s.linked = true;
                      s.props = {};
                    });
                  }
                }}
              >
                Use the global version
              </button>
            </div>
          )
        ) : null}

        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {tabBtn("content", "Content")}
          {tabBtn("visibility", "Visibility")}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {tab === "content" ? (
          <ContentEditor
            key={`${section.id}-${section.linked}`}
            value={{ [section.type]: content } as never}
            shape={{ [section.type]: meta.defaults }}
            assist={assist}
            onChange={(next) =>
              edit((d) => {
                const target = d.layout.sections.find((s) => s.id === selected);
                if (!target) return;
                const value = next[target.type] as Record<string, unknown>;
                if (target.linked) d.blocks[target.type] = value;
                else target.props = value;
              }, true)
            }
          />
        ) : (
          <div className="space-y-6">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
              <span>
                <span className="block text-[13.5px] font-medium text-ink">Hide this section</span>
                <span className="block text-[12px] text-muted">Kept in the layout, not shown on the site.</span>
              </span>
              <input type="checkbox" checked={section.hidden} onChange={(e) => change((s) => (s.hidden = e.target.checked))} className="size-4 accent-[#3300ea]" />
            </label>

            <div>
              <p className="mb-2 text-[12px] font-semibold tracking-[0.06em] text-muted uppercase">Show on devices</p>
              <div className="grid grid-cols-3 gap-2">
                {DEVICES.map(({ key, label }) => {
                  const on = section.devices[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => change((s) => (s.devices[key] = !s.devices[key]))}
                      aria-pressed={on}
                      className={`rounded-xl border px-2 py-2.5 text-[13px] font-medium transition-colors ${
                        on ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-muted line-through"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[12px] text-muted">Mobile is under 768px, tablet up to 1024px, desktop above.</p>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-semibold tracking-[0.06em] text-muted uppercase">Display conditions</p>
              <select
                value={section.conditions.mode}
                onChange={(e) => change((s) => (s.conditions.mode = e.target.value as typeof s.conditions.mode))}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] outline-none focus:border-brand"
              >
                <option value="all">Show on every page this layout renders</option>
                <option value="include">Show only on the pages ticked below</option>
                <option value="exclude">Hide on the pages ticked below</option>
              </select>

              {section.conditions.mode !== "all" ? (
                <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto rounded-xl border border-line bg-white p-2">
                  {pages.map((page) => {
                    const ticked = section.conditions.pages.includes(page.key);
                    return (
                      <li key={page.key}>
                        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] hover:bg-surface">
                          <input
                            type="checkbox"
                            checked={ticked}
                            onChange={() =>
                              change((s) => {
                                s.conditions.pages = ticked
                                  ? s.conditions.pages.filter((k) => k !== page.key)
                                  : [...s.conditions.pages, page.key];
                              })
                            }
                            className="size-4 accent-[#3300ea]"
                          />
                          <span className="text-ink">{page.label}</span>
                          <span className="ml-auto truncate text-[11.5px] text-muted">{page.path}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                Useful for global blocks — show the pricing block everywhere except one page, or a banner only on the industries you choose.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
