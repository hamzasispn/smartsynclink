import { SECTIONS } from "./sections";
import type { SectionInstance } from "./types";

/**
 * A fresh section instance. Kept apart from the store so the builder UI can
 * create sections in the browser — the store imports the database client.
 */
export function newSection(type: string, props?: Record<string, unknown>, id?: string): SectionInstance {
  const m = SECTIONS[type];
  return {
    id: id ?? `${type}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    label: "",
    hidden: false,
    devices: { desktop: true, tablet: true, mobile: true },
    conditions: { mode: "all", pages: [] },
    linked: m?.linked ?? false,
    props: m?.linked ? {} : ((props ?? structuredClone(m?.defaults ?? {})) as Record<string, unknown>),
  };
}
