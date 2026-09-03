"use client";

import { useState } from "react";
import { AiBtn, Spark } from "./ai";
import { MediaPicker } from "./media-picker";
import { Btn, inputClass } from "./ui";

/**
 * Renders an editor for a whole content document by walking it.
 *
 * A hand-built form per section would need extending every time a field is
 * added to the content files, and would silently hide anything it forgot.
 * Walking the value means every string, number, boolean, list and nested
 * object is editable — nav links, button labels, footer columns, all of it.
 *
 * Three shapes get special treatment rather than raw inputs:
 *   { src, alt }  -> upload / library picker, no URL typing
 *   arrays        -> drag to reorder, collapse rows, add from the shape
 *   text fields   -> optional "rewrite with AI"
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Rewrites one field. Throws on failure so the caller can show the message. */
export type AssistFn = (input: {
  text: string;
  instruction: string;
  context: string;
}) => Promise<string>;

const ACRONYMS: Record<string, string> = {
  faq: "FAQ",
  cta: "CTA",
  ai: "AI",
  seo: "SEO",
  url: "URL",
  id: "ID",
};

const titleCase = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(" ")
    .map(
      (w) =>
        ACRONYMS[w.toLowerCase()] ?? w.replace(/^./, (c) => c.toUpperCase()),
    )
    .join(" ");

/** Builds a blank item matching a template, so "Add" produces the right shape. */
function blankLike(sample: unknown): Json {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    return Object.fromEntries(
      Object.entries(sample as Record<string, unknown>).map(([k, v]) => [
        k,
        blankLike(v),
      ]),
    );
  }
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  return "";
}

/**
 * jsonb does not preserve key order — Postgres stores keys sorted by length
 * then bytes, so reading a document back gives "faq" before "nav". `shape` is
 * the object as authored in src/content, and its key order is the real order.
 */
function orderedEntries(value: Record<string, Json>, shape: unknown) {
  const shapeObj =
    shape && typeof shape === "object" && !Array.isArray(shape)
      ? (shape as Record<string, unknown>)
      : {};
  const ref = Object.keys(shapeObj);

  // A field added in code is missing from documents already in the database,
  // and rendering only what the document has would hide it forever. Missing
  // keys are surfaced as *blank* values — never the shape's own content, or
  // every nav item would inherit the example submenu.
  const merged: Record<string, Json> = { ...value };
  for (const key of ref) {
    if (!(key in merged)) merged[key] = blankLike(shapeObj[key]);
  }

  const rank = (k: string) => {
    const i = ref.indexOf(k);
    return i === -1 ? ref.length + 1 : i;
  };
  return Object.entries(merged).sort(
    ([a], [b]) => rank(a) - rank(b) || a.localeCompare(b),
  );
}

const at = (shape: unknown, key: string) =>
  shape && typeof shape === "object"
    ? (shape as Record<string, unknown>)[key]
    : undefined;

/** The { src, alt } pair every image slot uses. */
function isImage(value: Json): value is { src: string; alt: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return (
    keys.length <= 3 &&
    keys.includes("src") &&
    keys.includes("alt") &&
    typeof (value as Record<string, Json>).src === "string"
  );
}

/**
 * Paths, links and slugs are addresses, not copy — offering to "rewrite" them
 * invites a broken link, so the AI control is hidden on those fields.
 */
const isRewritable = (key: string, value: string) =>
  !/^(src|href|url|slug|image|icon|id|path|model|placeholder)$/i.test(key) &&
  !/^([/#]|https?:|mailto:|tel:)/.test(value.trim());

/** Long prose gets a textarea; short labels get a single line. */
const isProse = (key: string, value: string) =>
  value.length > 80 ||
  /body|about|description|subheading|answer|quote|excerpt|^a$/i.test(key);

/**
 * Picks the most complete entry in a shape array as the template for "Add".
 *
 * nav.items[0] is "Home", which has no child menu — using it blindly would
 * mean the Solution item could never gain one. Scoring by how much structure
 * an entry actually carries finds the entry that shows the full shape.
 */
function richest(shape: unknown): unknown {
  if (!Array.isArray(shape) || !shape.length) return undefined;
  const score = (v: unknown): number => {
    if (Array.isArray(v))
      return 1 + v.reduce<number>((n, x) => n + score(x), 0);
    if (v && typeof v === "object")
      return Object.values(v as Record<string, unknown>).reduce<number>(
        (n, x) => n + 1 + score(x),
        0,
      );
    return 0;
  };
  return shape.reduce(
    (best, item) => (score(item) > score(best) ? item : best),
    shape[0],
  );
}

/** "Children" -> "child", "Topics" -> "topic". Plain -s trimming is not enough. */
const IRREGULAR: Record<string, string> = {
  children: "child",
  people: "person",
};
const singular = (label: string) => {
  const lower = label.toLowerCase();
  return IRREGULAR[lower] ?? lower.replace(/ies$/, "y").replace(/s$/, "");
};

/** Rows read better as "Home" or "Sync Starter" than as "0". */
function itemLabel(item: Json, index: number) {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    for (const key of ["label", "title", "name", "heading", "q", "step"]) {
      const v = (item as Record<string, Json>)[key];
      if (typeof v === "string" && v.trim()) return v.slice(0, 60);
    }
  }
  return `Item ${index + 1}`;
}

/* --------------------------------------------------------------- assist -- */

function FieldAssist({
  text,
  label,
  assist,
  onApply,
}: {
  text: string;
  label: string;
  assist: AssistFn;
  onApply: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply(withInstruction: string) {
    setBusy(true);
    setError(null);
    try {
      onApply(
        await assist({ text, instruction: withInstruction, context: label }),
      );
      setOpen(false);
      setInstruction("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!text.trim()}
        title={text.trim() ? "Rewrite with AI" : "Write something first"}
        className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-brand disabled:opacity-40"
      >
        <Spark /> Rewrite
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-line bg-page p-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="shorter, punchier, less salesy…"
          className={`${inputClass} h-9 max-w-[300px] py-1.5 text-[13px]`}
        />
        <AiBtn
          label="Rewrite"
          active={busy}
          onClick={() =>
            apply(instruction.trim() || "Tighten it without losing meaning.")
          }
        />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] text-muted"
        >
          Cancel
        </button>
      </div>
      {error ? <p className="text-[12px] text-red-600">{error}</p> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- list -- */

function ListEditor({
  label,
  value,
  shape,
  depth,
  assist,
  onChange,
}: {
  label: string;
  value: Json[];
  shape?: unknown;
  depth: number;
  assist?: AssistFn;
  onChange: (next: Json[]) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  // Only the handle is draggable — making the whole row draggable stops you
  // selecting text inside its inputs.
  const [grabbed, setGrabbed] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(
    value.length === 1 ? 0 : null,
  );

  // Falling back to the shape is what makes "Add" work on an empty list —
  // there is no existing item to copy the structure from.
  const template = value[0] ?? richest(shape);

  function move(from: number, to: number) {
    if (from === to) return;
    const copy = [...value];
    const [row] = copy.splice(from, 1);
    copy.splice(to, 0, row);
    onChange(copy);
  }

  return (
    <fieldset className="rounded-xl border border-line p-4">
      <legend className="px-1.5 text-[13px] font-medium text-[#1e1e1e]">
        {label} <span className="font-normal text-muted">({value.length})</span>
      </legend>

      <ul className="space-y-2">
        {value.map((item, i) => {
          const complex = item !== null && typeof item === "object";
          const expanded = !complex || open === i;
          return (
            <li
              key={i}
              draggable={grabbed === i}
              onDragStart={() => setDragging(i)}
              onDragEnter={() => setOver(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging !== null) move(dragging, i);
                setDragging(null);
                setOver(null);
                setGrabbed(null);
              }}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
                setGrabbed(null);
              }}
              className={`rounded-lg border bg-page/60 transition-colors ${
                over === i && dragging !== null && dragging !== i
                  ? "border-brand"
                  : "border-transparent"
              } ${dragging === i ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Reorder ${itemLabel(item, i)}`}
                  title="Drag to reorder, or focus and use the arrow keys"
                  onMouseDown={() => setGrabbed(i)}
                  onMouseUp={() => setGrabbed(null)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" && i > 0) {
                      e.preventDefault();
                      move(i, i - 1);
                    }
                    if (e.key === "ArrowDown" && i < value.length - 1) {
                      e.preventDefault();
                      move(i, i + 1);
                    }
                  }}
                  className="cursor-grab select-none px-1 text-[15px] leading-none text-muted active:cursor-grabbing"
                >
                  ⠿
                </span>

                {complex ? (
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    className="min-w-0 flex-1 truncate text-left text-[14px] text-[#1e1e1e]"
                  >
                    {itemLabel(item, i)}
                  </button>
                ) : (
                  <span className="flex-1 text-[13px] text-muted">
                    Item {i + 1}
                  </span>
                )}

                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="rounded-md px-2 text-[13px] text-red-600 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>

              {expanded ? (
                <div className="space-y-3 border-t border-line px-3 py-3">
                  <Node
                    path={[label, String(i)]}
                    value={item}
                    depth={depth + 1}
                    shape={richest(shape)}
                    assist={assist}
                    onChange={(next) => {
                      const copy = [...value];
                      copy[i] = next;
                      onChange(copy);
                    }}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <Btn
        type="button"
        variant="outline"
        className="mt-3 min-h-9 px-4 text-[13px]"
        onClick={() => {
          onChange([
            ...value,
            template === undefined ? "" : blankLike(template),
          ]);
          setOpen(value.length);
        }}
      >
        + Add {singular(label)}
      </Btn>
    </fieldset>
  );
}

/* ----------------------------------------------------------------- node -- */

function Node({
  path,
  value,
  onChange,
  depth,
  shape,
  assist,
}: {
  path: string[];
  value: Json;
  onChange: (next: Json) => void;
  depth: number;
  shape?: unknown;
  assist?: AssistFn;
}) {
  const key = path[path.length - 1] ?? "";
  const label = titleCase(key);

  if (isImage(value)) {
    return (
      <MediaPicker
        label={label}
        value={value}
        // src/alt is the same pair either way; the name is what says whether
        // this slot holds a picture or a clip. The whole path is checked, not
        // just the last segment: inside a list the segment is an index, and
        // "videos" only appears one level up.
        accept={path.some((step) => /video/i.test(step)) ? "video" : "image"}
        onChange={(next) => onChange({ ...value, ...next })}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2.5 py-1">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 accent-[#3300ea]"
        />
        <span className="text-[14px] text-[#1e1e1e]">{label}</span>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-[#1e1e1e]">
          {label}
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputClass}
        />
      </label>
    );
  }

  if (typeof value === "string" || value === null) {
    const v = value ?? "";
    return (
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-[#1e1e1e]">
          {label}
        </span>
        {isProse(key, v) ? (
          <textarea
            rows={Math.min(10, Math.max(3, Math.ceil(v.length / 70)))}
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} resize-y leading-[1.6]`}
          />
        ) : (
          <input
            type="text"
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        )}
        {assist && isRewritable(key, v) ? (
          <FieldAssist
            text={v}
            label={label}
            assist={assist}
            onApply={onChange}
          />
        ) : null}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <ListEditor
        label={label}
        value={value}
        shape={shape}
        depth={depth}
        assist={assist}
        onChange={onChange}
      />
    );
  }

  const inner = (
    <div className="space-y-4">
      {orderedEntries(value, shape).map(([k, v]) => (
        <Node
          key={k}
          path={[...path, k]}
          value={v}
          depth={depth + 1}
          shape={at(shape, k)}
          assist={assist}
          onChange={(next) => onChange({ ...value, [k]: next })}
        />
      ))}
    </div>
  );

  if (depth === 0) return inner;

  return (
    <fieldset className="rounded-xl border border-line p-4">
      <legend className="px-1.5 text-[13px] font-medium text-[#1e1e1e]">
        {label}
      </legend>
      {inner}
    </fieldset>
  );
}

/* --------------------------------------------------------------- editor -- */

export function ContentEditor({
  value,
  shape,
  assist,
  onChange,
}: {
  value: Record<string, Json>;
  shape?: unknown;
  assist?: AssistFn;
  onChange: (next: Record<string, Json>) => void;
}) {
  const sections = orderedEntries(value, shape);
  const [open, setOpen] = useState<string | null>(sections[0]?.[0] ?? null);

  return (
    <div className="space-y-3">
      {sections.map(([section, data]) => (
        <div key={section} className="rounded-2xl border border-line bg-white">
          <button
            type="button"
            onClick={() => setOpen(open === section ? null : section)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
          >
            <span className="text-[16px] font-medium text-[#1e1e1e]">
              {titleCase(section)}
            </span>
            <span className="text-[13px] text-muted">
              {open === section ? "Hide" : "Edit"}
            </span>
          </button>

          {open === section ? (
            <div className="border-t border-line px-6 py-5">
              <Node
                path={[section]}
                value={data}
                depth={0}
                shape={at(shape, section)}
                assist={assist}
                onChange={(next) => onChange({ ...value, [section]: next })}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
