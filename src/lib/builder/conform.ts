/**
 * Fits what "Customize with AI" sends back to the section's own fields, so
 * whatever the model says, the section still renders in its design.
 *
 * `shape` is the section's defaults — the fields its component draws. The
 * answer is walked against it: keys the section has are taken when their type
 * matches, anything else falls back to the current value; keys the section
 * does not have are dropped; keys the content has but the defaults do not are
 * carried over untouched. Lists may grow, shrink and reorder, each item fitted
 * to the list's own item shape. Pictures and videos can be moved or removed,
 * never invented (a made-up URL is a broken image), and links have to be a
 * page, an anchor, tel:, mailto: or https.
 *
 * No imports, so `node scripts/check-conform.ts` can run it.
 */

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const kind = (v: unknown) => (Array.isArray(v) ? "array" : v === null ? "null" : typeof v);

const LINK = /^(\/|#|https?:\/\/|tel:|mailto:)/;
const MAX_TEXT = 4000;
const MAX_ITEMS = 40;

/** Every value under a "src" key: the only pictures and videos an answer may use. */
export function mediaOf(value: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((v) => mediaOf(v, out));
  else if (isObj(value)) {
    for (const [k, v] of Object.entries(value)) {
      if (k === "src" && typeof v === "string") out.add(v);
      else mediaOf(v, out);
    }
  }
  return out;
}

/** A list's item shape: every key any example item has, the first item's value winning. */
function itemOf(examples: unknown[]): unknown {
  const objects = examples.filter(isObj);
  return objects.length ? Object.assign({}, ...objects.slice().reverse()) : examples[0];
}

export function conform(next: unknown, shape: unknown, current: unknown, media: Set<string>, key = ""): unknown {
  if (Array.isArray(shape)) {
    if (!Array.isArray(next)) return current ?? shape;
    const examples = shape.length ? shape : Array.isArray(current) ? current : [];
    // nothing to check the items against: leave the list as it is
    if (!examples.length) return current ?? shape;
    const item = itemOf(examples);
    // an edited list of the same length lines up with the current one; a
    // longer or shorter one may not, so new items fill gaps from the shape
    const inPlace = Array.isArray(current) && current.length === next.length;
    return next.slice(0, MAX_ITEMS).map((v, i) => conform(v, item, inPlace ? current[i] : undefined, media));
  }

  if (isObj(shape)) {
    const answer = isObj(next) ? next : {};
    const now = isObj(current) ? current : {};
    const out: Record<string, unknown> = { ...now };
    for (const k of Object.keys(shape)) {
      out[k] = k in answer ? conform(answer[k], shape[k], now[k], media, k) : k in now ? now[k] : shape[k];
    }
    return out;
  }

  const fallback = current !== undefined && kind(current) === kind(shape) ? current : shape;
  if (kind(next) !== kind(shape)) return fallback;
  if (typeof next !== "string") return next;
  if (key === "src") return next === "" || media.has(next) ? next : fallback;
  if (key === "href") return next === "" || LINK.test(next.trim()) ? next.trim() : fallback;
  return next.slice(0, MAX_TEXT);
}

/* ------------------------------------------------------ a whole section -- */

type CatalogueField = {
  key: string;
  kind: string;
  options?: { value: string }[];
  itemFields?: CatalogueField[];
};

/** What a custom section may be built from — passed in, so this file keeps no imports. */
export type Catalogue = {
  widgets: Record<string, { fields: CatalogueField[]; defaults: Record<string, unknown> }>;
  sectionFields: CatalogueField[];
  sectionDefaults: Record<string, unknown>;
  columnWidths: string[];
  icons: string[];
};

const MAX_COLUMNS = 12;
const MAX_WIDGETS = 12;

const rid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

/** Dropdowns and icons keep only values they offer; item lists are checked item by item. */
function fitChoices(value: Record<string, unknown>, fields: CatalogueField[], defaults: Record<string, unknown>, icons: string[]) {
  for (const f of fields) {
    const v = value[f.key];
    if (f.kind === "select" && !f.options?.some((o) => o.value === v)) value[f.key] = defaults[f.key];
    if (f.kind === "icon" && !icons.includes(String(v))) value[f.key] = defaults[f.key];
    if (f.kind === "items" && Array.isArray(v) && f.itemFields) {
      const example = (Array.isArray(defaults[f.key]) ? (defaults[f.key] as unknown[])[0] : undefined) ?? {};
      for (const item of v) if (isObj(item)) fitChoices(item, f.itemFields, example as Record<string, unknown>, icons);
    }
  }
}

/**
 * Fits an AI-built custom section to the block library: known block types
 * only (anything else is dropped), each block's fields fitted like conform()
 * does, dropdowns and icons limited to what they offer, column widths from the
 * grid, and fresh ids throughout. Image and video blocks left without a file,
 * and columns left with no blocks, are dropped.
 */
export function conformCustom(answer: unknown, cat: Catalogue, media: Set<string>): Record<string, unknown> {
  const a = isObj(answer) ? answer : {};
  const out: Record<string, unknown> = {};
  for (const f of cat.sectionFields) {
    const fallback = cat.sectionDefaults[f.key];
    out[f.key] = conform(a[f.key], fallback, undefined, media, f.key);
  }
  fitChoices(out, cat.sectionFields, cat.sectionDefaults, cat.icons);

  const columns = (Array.isArray(a.columns) ? a.columns : []).slice(0, MAX_COLUMNS);
  out.columns = columns
    .map((col) => {
      const c = isObj(col) ? col : {};
      const widgets = (Array.isArray(c.widgets) ? c.widgets : []).slice(0, MAX_WIDGETS).flatMap((w) => {
        const meta = isObj(w) && typeof w.type === "string" ? cat.widgets[w.type] : undefined;
        if (!meta) return [];
        const fitted = conform(w, meta.defaults, undefined, media) as Record<string, unknown>;
        fitChoices(fitted, meta.fields, meta.defaults, cat.icons);
        // a picture or clip block with nothing in it would be an empty grey box on the live page
        const type = (w as { type: string }).type;
        const empty = (key: string) => !(fitted[key] as { src?: string } | undefined)?.src;
        if ((type === "image" && empty("image")) || (type === "video" && empty("video"))) return [];
        return [{ ...fitted, id: rid("w"), type }];
      });
      return { id: rid("c"), width: cat.columnWidths.includes(String(c.width)) ? String(c.width) : "12", widgets };
    })
    .filter((col) => col.widgets.length);
  return out;
}
