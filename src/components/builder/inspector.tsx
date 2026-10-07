"use client";

import { useState } from "react";
import { assistAction, customizeAction, type CustomizeTarget } from "@/app/admin/ai-actions";
import { defaultGlobal } from "@/content/global";
import type { BuilderPage } from "@/lib/builder/pages";
import { SECTIONS } from "@/lib/builder/sections";
import type { Device } from "@/lib/builder/types";
import type { CustomProps } from "@/lib/builder/widgets";
import { ContentEditor, FieldGroups } from "../admin/content-editor";
import { AiComposer, Spark, type AiRequest } from "./ai-studio";
import { CustomEditor } from "./custom-editor";
import type { BuilderDoc } from "./use-builder";

/**
 * The right column: whatever is selected, editable.
 *
 * Content reuses the dashboard's document walker, so every text, image, video,
 * list and button a section has is already editable here — the builder adds
 * placement, not a second form system. A section's fields come as accordion
 * groups (FieldGroups): its text, its buttons, its images, then one panel per
 * list or nested block, so nothing is buried in a single long column.
 */

type Edit = (mutate: (draft: BuilderDoc) => void, coalesce?: boolean) => void;

async function assist({ text, instruction, context }: { text: string; instruction: string; context: string }) {
  const result = await assistAction({ kind: "rewrite", text, instruction, context });
  if (!result.ok) throw new Error(result.error);
  if (result.kind !== "rewrite") throw new Error("Unexpected response");
  return result.text;
}

/**
 * "Customize with AI": an instruction in, the section's content rewritten.
 * The answer is applied as one ordinary edit — into the draft, one Undo step —
 * and this panel keeps the content from before it, so "Undo" here puts back
 * this section even after other edits. Nothing goes live until Publish.
 */
function AiCustomize({
  target,
  value,
  onApply,
}: {
  target: CustomizeTarget;
  value: unknown;
  onApply: (next: unknown) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ summary: string; before: unknown } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(request: AiRequest) {
    setBusy(true);
    setError(null);
    setDone(null);
    const before = structuredClone(value);
    try {
      const result = await customizeAction({
        target,
        value,
        instruction: request.instruction,
        model: request.model,
        images: request.images.map(({ id, url }) => ({ id, url })),
        placeImages: request.placeImages,
      });
      if (!result.ok) throw new Error(result.error);
      onApply(result.value);
      setDone({ summary: result.summary, before });
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI could not make this change.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const custom = target.kind === "section" && target.type === "custom";
  const suggestions =
    target.kind === "footer"
      ? ["Add our address to the copyright line", "Shorten the about text", "Add a Pricing link to the first column"]
      : target.kind === "header"
        ? ["Add a Pricing link to the menu", "Change the header button to Book a Demo"]
        : custom
          ? ["Make it a dark band", "Turn the points into a bento grid", "Add an FAQ under it", "Make the copy shorter"]
          : ["Make the copy shorter and punchier", "Rewrite it for plumbers", "Add one more item to the list"];

  return (
    <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#052EFF]/25 via-[#3300EA]/15 to-transparent p-px">
      <div className="rounded-[15px] bg-gradient-to-br from-[#F4F2FF] to-white">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3 text-left">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white shadow-[0_6px_14px_-6px_rgba(51,0,234,0.8)]">
            <Spark className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-ink">Customize with AI</span>
            <span className="block truncate text-[11.5px] text-muted">{custom ? "Change the blocks, layout or copy" : "Say what to change — the design stays"}</span>
          </span>
          <svg viewBox="0 0 24 24" className={`size-4 text-muted transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open || busy || done || error ? (
          <div className="px-3 pb-3">
            {open || busy ? (
              <AiComposer
                busy={busy}
                submitLabel="Apply"
                placeholder={
                  target.kind === "footer"
                    ? "e.g. Add our address to the copyright line: 8911 N Capital of Texas Hwy, Austin, TX"
                    : custom
                      ? "e.g. Put the heading on the left and the points on the right, on a dark background"
                      : "e.g. Make the heading about contractors, and add a fourth point about after-hours calls"
                }
                suggestions={suggestions}
                onSubmit={run}
              />
            ) : null}
            {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] leading-relaxed text-red-700">{error}</p> : null}
            {done ? (
              <div className="mt-3 rounded-xl bg-white px-3 py-2.5 text-[12.5px] leading-relaxed text-ink ring-1 ring-emerald-200">
                <span className="font-medium text-[#0E9F5B]">✓ Done.</span> {done.summary}{" "}
                <button
                  type="button"
                  className="font-medium text-brand underline"
                  onClick={() => {
                    onApply(done.before);
                    setDone(null);
                  }}
                >
                  Undo
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
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

/** Page conditions for the header and footer. */
function ConditionsPicker({
  title,
  value,
  pages,
  onChange,
}: {
  title: string;
  value: { mode: "all" | "include" | "exclude"; pages: string[] };
  pages: BuilderPage[];
  onChange: (next: { mode: "all" | "include" | "exclude"; pages: string[] }) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="mb-2 text-[12px] font-semibold tracking-[0.06em] text-muted uppercase">{title}</p>
      <select
        value={value.mode}
        onChange={(e) => onChange({ ...value, mode: e.target.value as typeof value.mode })}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] outline-none focus:border-brand"
      >
        <option value="all">Every page</option>
        <option value="include">Only the pages ticked below</option>
        <option value="exclude">Every page except those ticked below</option>
      </select>
      {value.mode !== "all" ? (
        <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto">
          {pages.map((page) => {
            const ticked = value.pages.includes(page.key);
            return (
              <li key={page.key}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] hover:bg-surface">
                  <input
                    type="checkbox"
                    checked={ticked}
                    onChange={() =>
                      onChange({
                        ...value,
                        pages: ticked ? value.pages.filter((k) => k !== page.key) : [...value.pages, page.key],
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
          <AiCustomize
            target={{ kind: "header" }}
            value={{ brand: doc.global.brand, nav: doc.global.nav }}
            onApply={(next) =>
              edit((d) => {
                const v = next as { brand: typeof d.global.brand; nav: typeof d.global.nav };
                d.global.brand = v.brand;
                d.global.nav = v.nav;
              })
            }
          />
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
          <div className="mt-4">
            <ConditionsPicker
              title="Show the header on"
              value={doc.global.visibility.header}
              pages={pages}
              onChange={(next) =>
                edit((d) => {
                  d.global.visibility = { ...d.global.visibility, header: next };
                })
              }
            />
          </div>
        </div>
      </div>
    );
  }

  if (selected === "__footer") {
    return (
      <div className="flex h-full flex-col">
        <Heading title="Footer" sub="Columns, newsletter, contact details — on every page." onClose={onClose} />
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <AiCustomize
            target={{ kind: "footer" }}
            value={doc.global.footer}
            onApply={(next) =>
              edit((d) => {
                d.global.footer = next as typeof d.global.footer;
              })
            }
          />
          <FieldGroups
            key="footer"
            value={doc.global.footer as never}
            shape={defaultGlobal.footer}
            assist={assist}
            onChange={(next) =>
              edit((d) => {
                d.global.footer = next as never;
              }, true)
            }
          />
          <div className="mt-4">
            <ConditionsPicker
              title="Show the footer on"
              value={doc.global.visibility.footer}
              pages={pages}
              onChange={(next) =>
                edit((d) => {
                  d.global.visibility = { ...d.global.visibility, footer: next };
                })
              }
            />
          </div>
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
        {tab === "content" && section.type === "custom" ? (
          <>
            <AiCustomize
              target={{ kind: "section", type: "custom", label: section.label }}
              value={section.props}
              onApply={(next) =>
                edit((d) => {
                  const target = d.layout.sections.find((s) => s.id === selected);
                  if (target) target.props = next as Record<string, unknown>;
                })
              }
            />
            <CustomEditor
              key={section.id}
              value={section.props as unknown as CustomProps}
              onChange={(next, coalesce) =>
                edit((d) => {
                  const target = d.layout.sections.find((s) => s.id === selected);
                  if (target) target.props = next as unknown as Record<string, unknown>;
                }, coalesce)
              }
            />
          </>
        ) : tab === "content" ? (
          <>
            <AiCustomize
              target={{ kind: "section", type: section.type, label: section.label }}
              value={content ?? {}}
              onApply={(next) =>
                edit((d) => {
                  const target = d.layout.sections.find((s) => s.id === selected);
                  if (!target) return;
                  const value = next as Record<string, unknown>;
                  if (target.linked) d.blocks[target.type] = value;
                  else target.props = value;
                })
              }
            />
            <FieldGroups
              key={`${section.id}-${section.linked}`}
              value={(content ?? {}) as never}
              shape={meta.defaults}
              assist={assist}
              onChange={(next) =>
                edit((d) => {
                  const target = d.layout.sections.find((s) => s.id === selected);
                  if (!target) return;
                  const value = next as Record<string, unknown>;
                  if (target.linked) d.blocks[target.type] = value;
                  else target.props = value;
                }, true)
              }
            />
          </>
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
