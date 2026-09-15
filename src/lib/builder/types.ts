/**
 * The page builder's data model.
 *
 * A page is an ordered list of section instances. Each instance names a
 * section type from the catalogue (lib/builder/sections.ts), carries its own
 * content — or points at the shared copy when `linked` — and says where it
 * shows: on or off, per device, and on which pages.
 */

export type Device = "desktop" | "tablet" | "mobile";

export type Conditions = {
  /** all: every page this layout renders on. include/exclude: by page key. */
  mode: "all" | "include" | "exclude";
  pages: string[];
};

export type SectionInstance = {
  /** Stable within a layout — the preview uses it to select and scroll. */
  id: string;
  type: string;
  /** Optional name in the structure list; the catalogue label otherwise. */
  label: string;
  hidden: boolean;
  devices: Record<Device, boolean>;
  conditions: Conditions;
  /**
   * Linked sections read and write the shared block of their type, so
   * pricing or the closing call to action is edited once for every page.
   */
  linked: boolean;
  /** The section's own content. Ignored while linked. */
  props: Record<string, unknown>;
};

export type Layout = { sections: SectionInstance[] };

/** Shared content for linked sections, keyed by section type. */
export type Blocks = Record<string, Record<string, unknown>>;

/** One stored document with its unpublished draft alongside. */
export type Versioned<T> = {
  published: T | null;
  draft: T | null;
  publishedAt: string | null;
  draftAt: string | null;
  /** The last few published versions, newest first, for restore. */
  history: { at: string; value: T }[];
};

export type Mode = "published" | "draft";
