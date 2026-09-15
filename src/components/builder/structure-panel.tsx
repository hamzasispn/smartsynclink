"use client";

import { useState } from "react";
import { GROUP_ORDER, SECTIONS } from "@/lib/builder/sections";
import { CUSTOM_PRESETS } from "@/lib/builder/widgets";
import type { Layout, SectionInstance } from "@/lib/builder/types";

/**
 * The left column: header, the page's sections in order, footer — plus the
 * library to add more.
 *
 * Reordering is native drag and drop (no library), with up/down buttons beside
 * each row so it also works from a keyboard or a trackpad that fights dragging.
 */

type Props = {
  layout: Layout;
  selected: string | null;
  onSelect: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onToggleHidden: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (type: string, props?: Record<string, unknown>) => void;
};

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const EYE = "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z";
const EYE_OFF = "M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6";
const COPY = "M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1";
const TRASH = "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2";
const UP = "m18 15-6-6-6 6";
const DOWN = "m6 9 6 6 6-6";
const GRIP = "M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01";

function PinnedRow({ id, label, selected, onSelect }: { id: string; label: string; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13.5px] transition-colors ${
        selected ? "border-brand bg-brand-soft text-brand" : "border-dashed border-line bg-white text-ink hover:border-brand/50"
      }`}
    >
      <span className="grid size-6 place-items-center rounded-md bg-surface text-[11px] text-muted">★</span>
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-[11px] text-muted">every page</span>
    </button>
  );
}

function SectionRow({
  section,
  index,
  count,
  selected,
  dragging,
  dropBefore,
  props,
  onDragStart,
  onDragOverRow,
  onDragEnd,
}: {
  section: SectionInstance;
  index: number;
  count: number;
  selected: boolean;
  dragging: boolean;
  dropBefore: boolean;
  props: Props;
  onDragStart: () => void;
  onDragOverRow: (before: boolean) => void;
  onDragEnd: () => void;
}) {
  const meta = SECTIONS[section.type];
  const deviceOff = Object.entries(section.devices).filter(([, on]) => !on).map(([d]) => d);
  const btn = "grid size-7 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink";

  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", section.id);
        onDragStart();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        const r = e.currentTarget.getBoundingClientRect();
        onDragOverRow(e.clientY < r.top + r.height / 2);
      }}
      onDragEnd={onDragEnd}
      className={`group relative ${dragging ? "opacity-40" : ""}`}
    >
      {dropBefore ? <span className="absolute -top-1.5 right-2 left-2 h-0.5 rounded-full bg-brand" /> : null}
      <div
        className={`flex items-center gap-1.5 rounded-xl border px-2 py-2 transition-colors ${
          selected ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40"
        } ${section.hidden ? "opacity-55" : ""}`}
      >
        <span className="cursor-grab text-muted active:cursor-grabbing" title="Drag to reorder">
          {icon(GRIP)}
        </span>
        <button type="button" onClick={() => props.onSelect(section.id)} className="min-w-0 flex-1 text-left">
          <span className={`block truncate text-[13.5px] font-medium ${selected ? "text-brand" : "text-ink"}`}>
            {section.label || meta?.label || section.type}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            {section.linked ? <span className="rounded bg-amber-100 px-1.5 py-px text-amber-800">Global</span> : null}
            {section.hidden ? <span>Hidden</span> : null}
            {deviceOff.length ? <span>Off on {deviceOff.join(", ")}</span> : null}
            {section.conditions.mode !== "all" ? <span>Conditional</span> : null}
          </span>
        </button>
        <span className="flex items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button type="button" className={btn} disabled={index === 0} onClick={() => props.onMove(index, index - 1)} aria-label="Move up">
            {icon(UP)}
          </button>
          <button type="button" className={btn} disabled={index === count - 1} onClick={() => props.onMove(index, index + 1)} aria-label="Move down">
            {icon(DOWN)}
          </button>
          <button type="button" className={btn} onClick={() => props.onDuplicate(section.id)} aria-label="Duplicate">
            {icon(COPY)}
          </button>
          <button
            type="button"
            className={`${btn} hover:text-red-600`}
            onClick={() => {
              if (window.confirm(`Delete "${section.label || meta?.label}" from this page?`)) props.onDelete(section.id);
            }}
            aria-label="Delete"
          >
            {icon(TRASH)}
          </button>
        </span>
        <button type="button" className={btn} onClick={() => props.onToggleHidden(section.id)} aria-label={section.hidden ? "Show section" : "Hide section"}>
          {icon(section.hidden ? EYE_OFF : EYE)}
        </button>
      </div>
    </li>
  );
}

export function StructurePanel(props: Props) {
  const { layout, selected, onSelect, onMove, onAdd } = props;
  const [drag, setDrag] = useState<number | null>(null);
  const [drop, setDrop] = useState<number | null>(null);
  const [library, setLibrary] = useState(false);
  const count = layout.sections.length;

  const finishDrag = () => {
    if (drag !== null && drop !== null) {
      // dropping below your own position lands one slot earlier once you're lifted out
      const to = drop > drag ? drop - 1 : drop;
      if (to !== drag) onMove(drag, to);
    }
    setDrag(null);
    setDrop(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">Structure</p>
        <button
          type="button"
          onClick={() => setLibrary((v) => !v)}
          className="rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-3 py-1.5 text-[12.5px] font-medium text-white"
        >
          {library ? "Close" : "+ Add section"}
        </button>
      </div>

      {library ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {GROUP_ORDER.map((group) => (
            <div key={group} className="mb-4">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{group}</p>
              <ul className="space-y-2">
                {group === "Custom"
                  ? CUSTOM_PRESETS.map((preset) => (
                      <li key={preset.key}>
                        <button
                          type="button"
                          onClick={() => {
                            onAdd("custom", preset.build() as unknown as Record<string, unknown>);
                            setLibrary(false);
                          }}
                          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-left transition-colors hover:border-brand"
                        >
                          <span className="block text-[13.5px] font-medium text-ink">{preset.label}</span>
                          <span className="mt-0.5 block text-[12px] leading-snug text-muted">{preset.description}</span>
                        </button>
                      </li>
                    ))
                  : null}
                {Object.entries(SECTIONS)
                  .filter(([, m]) => m.group === group && group !== "Custom")
                  .map(([type, m]) => (
                    <li key={type}>
                      <button
                        type="button"
                        onClick={() => {
                          onAdd(type);
                          setLibrary(false);
                        }}
                        className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-left transition-colors hover:border-brand"
                      >
                        <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                          {m.label}
                          {m.linked ? <span className="rounded bg-amber-100 px-1.5 py-px text-[10.5px] text-amber-800">Global</span> : null}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-muted">{m.description}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
          <PinnedRow id="__header" label="Header & menu" selected={selected === "__header"} onSelect={onSelect} />

          <ul
            className="space-y-2 py-1"
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrop(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              finishDrag();
            }}
          >
            {layout.sections.map((section, i) => (
              <SectionRow
                key={section.id}
                section={section}
                index={i}
                count={count}
                selected={selected === section.id}
                dragging={drag === i}
                dropBefore={drop === i && drag !== null && drag !== i && drag !== i - 1}
                props={props}
                onDragStart={() => setDrag(i)}
                onDragOverRow={(before) => setDrop(before ? i : i + 1)}
                onDragEnd={finishDrag}
              />
            ))}
            {drag !== null && drop === count ? <li className="h-0.5 rounded-full bg-brand" /> : null}
          </ul>

          {!count ? (
            <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-[13px] text-muted">
              No sections yet — add one above.
            </p>
          ) : null}

          <PinnedRow id="__footer" label="Footer" selected={selected === "__footer"} onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}
