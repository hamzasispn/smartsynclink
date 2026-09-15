"use client";

import { useState } from "react";
import {
  COLUMN_WIDTHS,
  newColumn,
  newWidget,
  SECTION_FIELDS,
  WIDGETS,
  type Column,
  type CustomProps,
  type Widget,
} from "@/lib/builder/widgets";
import { FieldForm } from "./field-form";

/**
 * Editor for a custom section: its settings, its columns, and the widgets
 * stacked in each column. Every change produces a fresh copy of the props and
 * hands it to the builder, which owns history and saving.
 */

type OnChange = (next: CustomProps, coalesce: boolean) => void;

const MAX_COLUMNS = 6;

const iconPath = (d: string, cls = "size-4") => (
  <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/** A one-line reminder of what a widget holds, for the collapsed row. */
function summary(w: Widget) {
  const pick = (key: string) => (typeof w[key] === "string" ? (w[key] as string) : "");
  const cta = w.cta as { label?: string } | undefined;
  const media = (w.image ?? w.video) as { src?: string } | undefined;
  const text =
    pick("text") ||
    pick("title") ||
    pick("value") ||
    cta?.label ||
    (Array.isArray(w.items) ? (w.items as string[]).join(", ") : "") ||
    (media ? (media.src ? "Media set" : "No media yet") : "");
  return text.replace(/[*#[\]()]/g, "").slice(0, 60);
}

export function CustomEditor({ value, onChange }: { value: CustomProps; onChange: OnChange }) {
  const [openWidget, setOpenWidget] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const change = (mutate: (draft: CustomProps) => void, coalesce = false) => {
    const next = structuredClone(value);
    mutate(next);
    onChange(next, coalesce);
  };

  // the settings form edits everything except the columns, which are managed below
  const settings: Record<string, unknown> = { ...value };
  delete settings.columns;

  const btn = "grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-30";

  return (
    <div className="space-y-4">
      {/* section settings */}
      <div className="rounded-2xl border border-line bg-white">
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-medium text-ink"
        >
          Section style
          <span className="text-muted">{settingsOpen ? "−" : "+"}</span>
        </button>
        {settingsOpen ? (
          <div className="border-t border-line p-4">
            <FieldForm
              fields={SECTION_FIELDS}
              value={settings}
              onChange={(next, coalesce) => onChange({ ...(next as Omit<CustomProps, "columns">), columns: value.columns }, coalesce)}
            />
          </div>
        ) : null}
      </div>

      {/* columns */}
      {value.columns.map((column: Column, ci) => (
        <div key={column.id} className="rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
            <span className="text-[12.5px] font-semibold text-ink">Column {ci + 1}</span>
            <select
              value={column.width}
              onChange={(e) => change((d) => (d.columns[ci].width = e.target.value as Column["width"]))}
              className="rounded-md border border-line bg-white px-2 py-1 text-[12px] outline-none focus:border-brand"
              aria-label="Column width on desktop"
            >
              {COLUMN_WIDTHS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
            <span className="ml-auto flex items-center">
              <button
                type="button"
                className={btn}
                disabled={ci === 0}
                onClick={() => change((d) => d.columns.splice(ci - 1, 0, d.columns.splice(ci, 1)[0]))}
                aria-label="Move column earlier"
              >
                {iconPath("m15 18-6-6 6-6")}
              </button>
              <button
                type="button"
                className={btn}
                disabled={ci === value.columns.length - 1}
                onClick={() => change((d) => d.columns.splice(ci + 1, 0, d.columns.splice(ci, 1)[0]))}
                aria-label="Move column later"
              >
                {iconPath("m9 18 6-6-6-6")}
              </button>
              <button
                type="button"
                className={`${btn} hover:text-red-600`}
                disabled={value.columns.length === 1}
                onClick={() => {
                  if (!column.widgets.length || window.confirm(`Delete column ${ci + 1} and its widgets?`)) {
                    change((d) => d.columns.splice(ci, 1));
                  }
                }}
                aria-label="Delete column"
              >
                {iconPath("M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2")}
              </button>
            </span>
          </div>

          <ul className="space-y-1.5 p-2">
            {column.widgets.map((widget, wi) => {
              const meta = WIDGETS[widget.type];
              const open = openWidget === widget.id;
              return (
                <li key={widget.id} className={`rounded-xl border ${open ? "border-brand" : "border-transparent bg-page"}`}>
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <button type="button" onClick={() => setOpenWidget(open ? null : widget.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-brand">{iconPath(meta?.icon ?? "M4 4h16v16H4z")}</span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-ink">{meta?.label ?? widget.type}</span>
                        <span className="block truncate text-[11.5px] text-muted">{summary(widget) || meta?.description}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={btn}
                      disabled={wi === 0}
                      onClick={() => change((d) => d.columns[ci].widgets.splice(wi - 1, 0, d.columns[ci].widgets.splice(wi, 1)[0]))}
                      aria-label="Move up"
                    >
                      {iconPath("m18 15-6-6-6 6")}
                    </button>
                    <button
                      type="button"
                      className={btn}
                      disabled={wi === column.widgets.length - 1}
                      onClick={() => change((d) => d.columns[ci].widgets.splice(wi + 1, 0, d.columns[ci].widgets.splice(wi, 1)[0]))}
                      aria-label="Move down"
                    >
                      {iconPath("m6 9 6 6 6-6")}
                    </button>
                    <button
                      type="button"
                      className={btn}
                      onClick={() =>
                        change((d) => {
                          const copy = { ...structuredClone(widget), id: newWidget(widget.type).id };
                          d.columns[ci].widgets.splice(wi + 1, 0, copy);
                        })
                      }
                      aria-label="Duplicate"
                    >
                      {iconPath("M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1")}
                    </button>
                    <button
                      type="button"
                      className={`${btn} hover:text-red-600`}
                      onClick={() => change((d) => d.columns[ci].widgets.splice(wi, 1))}
                      aria-label="Delete widget"
                    >
                      {iconPath("M18 6 6 18M6 6l12 12")}
                    </button>
                  </div>

                  {open ? (
                    <div className="border-t border-line p-3">
                      <FieldForm
                        fields={meta?.fields ?? []}
                        value={widget}
                        onChange={(next, coalesce) =>
                          change((d) => {
                            d.columns[ci].widgets[wi] = { ...(next as Widget), id: widget.id, type: widget.type };
                          }, coalesce)
                        }
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}

            <li>
              {adding === column.id ? (
                <div className="rounded-xl border border-dashed border-brand/50 p-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(WIDGETS).map(([type, meta]) => (
                      <button
                        key={type}
                        type="button"
                        title={meta.description}
                        onClick={() => {
                          const widget = newWidget(type);
                          change((d) => d.columns[ci].widgets.push(widget));
                          setAdding(null);
                          setOpenWidget(widget.id);
                        }}
                        className="flex flex-col items-center gap-1 rounded-lg bg-page px-1 py-2 text-[11.5px] text-ink transition-colors hover:bg-brand-soft hover:text-brand"
                      >
                        {iconPath(meta.icon, "size-[18px]")}
                        {meta.label}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setAdding(null)} className="mt-2 w-full text-center text-[12px] text-muted hover:text-ink">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(column.id)}
                  className="w-full rounded-xl border border-dashed border-line py-2 text-[12.5px] text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  + Add widget
                </button>
              )}
            </li>
          </ul>
        </div>
      ))}

      <button
        type="button"
        disabled={value.columns.length >= MAX_COLUMNS}
        onClick={() => change((d) => d.columns.push(newColumn("6")))}
        className="w-full rounded-2xl border border-dashed border-line py-3 text-[13px] text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
      >
        + Add column
      </button>
      <p className="text-[11.5px] leading-snug text-muted">
        Widths apply on desktop; columns stack on tablets and phones. Widths adding up to Full (12) sit on one row — the rest wrap below.
      </p>
    </div>
  );
}
