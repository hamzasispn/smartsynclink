"use client";

import type { Field } from "@/lib/builder/widgets";
import { MediaPicker, type ImageValue } from "../admin/media-picker";

/**
 * One form for every widget and for custom-section settings, driven by the
 * field list each widget declares in lib/builder/widgets.ts.
 *
 * `coalesce` tells the builder whether this change is one of a burst (typing)
 * that should share an undo step, or a discrete choice (a select, a toggle).
 */

type Value = Record<string, unknown>;
type OnChange = (next: Value, coalesce: boolean) => void;

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] text-ink outline-none transition-colors focus:border-brand";

const QUICK_LINKS: [string, string][] = [
  ["#call", "Call booking"],
  ["#contact", "Appointment"],
  ["#demo", "Voice demo"],
];

function Label({ field }: { field: Field }) {
  return <span className="mb-1.5 block text-[12px] font-medium text-[#1e1e1e]">{field.label}</span>;
}

function Help({ field }: { field: Field }) {
  return field.help ? <span className="mt-1 block text-[11.5px] leading-snug text-muted">{field.help}</span> : null;
}

export function FieldForm({ fields, value, onChange }: { fields: Field[]; value: Value; onChange: OnChange }) {
  const set = (key: string, next: unknown, coalesce: boolean) => onChange({ ...value, [key]: next }, coalesce);

  if (!fields.length) return <p className="text-[12.5px] text-muted">Nothing to set for this widget.</p>;

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const current = value[field.key];

        switch (field.kind) {
          case "text":
            return (
              <label key={field.key} className="block">
                <Label field={field} />
                <input value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value, true)} className={input} />
                <Help field={field} />
              </label>
            );

          case "textarea":
          case "markdown":
            return (
              <label key={field.key} className="block">
                <Label field={field} />
                <textarea
                  value={String(current ?? "")}
                  rows={field.kind === "markdown" ? 6 : 5}
                  onChange={(e) => set(field.key, e.target.value, true)}
                  className={`${input} resize-y leading-relaxed ${field.kind === "textarea" ? "font-mono text-[12.5px]" : ""}`}
                />
                <Help field={field} />
              </label>
            );

          case "select":
            return (
              <label key={field.key} className="block">
                <Label field={field} />
                <select value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value, false)} className={input}>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Help field={field} />
              </label>
            );

          case "toggle":
            return (
              <label key={field.key} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-3 py-2.5">
                <span className="text-[13px] text-ink">{field.label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(current)}
                  onChange={(e) => set(field.key, e.target.checked, false)}
                  className="size-4 accent-[#3300ea]"
                />
              </label>
            );

          case "image":
          case "video":
            return (
              <div key={field.key}>
                <MediaPicker
                  label={field.label}
                  accept={field.kind}
                  whiteBackground={false}
                  value={(current as ImageValue) ?? { src: "", alt: "" }}
                  onChange={(next) => set(field.key, next, false)}
                />
              </div>
            );

          case "link": {
            const link = (current as { label: string; href: string }) ?? { label: "", href: "" };
            return (
              <div key={field.key}>
                <Label field={field} />
                <div className="grid gap-2">
                  <input
                    value={link.label}
                    placeholder="Label"
                    onChange={(e) => set(field.key, { ...link, label: e.target.value }, true)}
                    className={input}
                  />
                  <input
                    value={link.href}
                    placeholder="/page, https://…, #call"
                    onChange={(e) => set(field.key, { ...link, href: e.target.value }, true)}
                    className={input}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_LINKS.map(([href, label]) => (
                    <button
                      key={href}
                      type="button"
                      onClick={() => set(field.key, { ...link, href }, false)}
                      className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                        link.href === href ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-muted hover:text-ink"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <Help field={field} />
              </div>
            );
          }

          case "list": {
            const items = (current as string[]) ?? [];
            const update = (next: string[], coalesce: boolean) => set(field.key, next, coalesce);
            return (
              <div key={field.key}>
                <Label field={field} />
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-1.5">
                      <input
                        value={item}
                        onChange={(e) => update(items.map((x, j) => (j === i ? e.target.value : x)), true)}
                        className={input}
                      />
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => {
                          const next = [...items];
                          [next[i - 1], next[i]] = [next[i], next[i - 1]];
                          update(next, false);
                        }}
                        aria-label="Move up"
                        className="grid w-8 shrink-0 place-items-center rounded-lg border border-line bg-white text-muted disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => update(items.filter((_, j) => j !== i), false)}
                        aria-label="Remove"
                        className="grid w-8 shrink-0 place-items-center rounded-lg border border-line bg-white text-muted hover:text-red-600"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => update([...items, "New point"], false)}
                  className="mt-2 rounded-full border border-dashed border-line px-3 py-1.5 text-[12px] text-muted hover:border-brand hover:text-brand"
                >
                  + Add point
                </button>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
