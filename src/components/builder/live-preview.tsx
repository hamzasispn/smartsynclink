"use client";

import { createContext, memo, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { GlobalContent } from "@/content/global";
import type { Blocks, Layout } from "@/lib/builder/types";
import { PageShell, SectionBlock, type RenderContext, type SectionBlockProps } from "./render";

/**
 * The builder preview, rendered in the browser so edits show as they're typed.
 *
 * The server renders the draft once; after that the builder posts its whole
 * document on every change and this re-renders from it — no save, no network
 * round trip, no server render in between. Saving still happens in the
 * background, so a reload shows the same thing.
 *
 * Only sections whose content actually changed re-render: unchanged sections
 * keep their previous objects, and the memoised block skips them. Typing in a
 * heading re-renders that one section, not the page.
 */

type Doc = { layout: Layout; blocks: Blocks; global: GlobalContent };

const same = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);

/** The next document, reusing the previous objects for anything that didn't change. */
function share(prev: Doc, next: Doc): Doc {
  const before = new Map(prev.layout.sections.map((s) => [s.id, s]));
  const sections = next.layout.sections.map((s) => {
    const old = before.get(s.id);
    return old && same(old, s) ? old : s;
  });
  const unchangedOrder =
    sections.length === prev.layout.sections.length && sections.every((s, i) => s === prev.layout.sections[i]);

  const blocks: Blocks = {};
  for (const [type, value] of Object.entries(next.blocks)) {
    blocks[type] = prev.blocks[type] && same(prev.blocks[type], value) ? prev.blocks[type] : value;
  }

  return {
    layout: unchangedOrder ? prev.layout : { sections },
    blocks,
    global: same(prev.global, next.global) ? prev.global : next.global,
  };
}

/** Per section, how many times it has been remounted after text was edited in place. */
const Epochs = createContext<Record<string, number>>({});

const LiveBlock = memo(
  function LiveBlock(props: SectionBlockProps) {
    const epoch = useContext(Epochs)[props.section.id] ?? 0;
    return <SectionBlock key={epoch} {...props} />;
  },
  (a, b) => a.section === b.section && a.data === b.data && a.ctx === b.ctx && a.preview === b.preview,
);

const bump = (epochs: Record<string, number>, ids: Iterable<string>) => {
  const next = { ...epochs };
  for (const id of ids) next[id] = (next[id] ?? 0) + 1;
  return next;
};

export function LivePreview({
  initial,
  ctx,
  brand,
  after,
}: {
  initial: Doc;
  ctx: RenderContext;
  brand?: GlobalContent["brand"];
  after?: ReactNode;
}) {
  const [doc, setDoc] = useState(initial);
  const [epochs, setEpochs] = useState<Record<string, number>>({});
  const current = useRef(initial);
  // sections edited in place whose new text is on its way from the builder
  const stale = useRef(new Set<string>());

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; doc?: Doc; id?: string; pending?: boolean };

      if (data?.type === "builder:stale" && data.id) {
        // nothing coming (cancelled or unchanged): remount now; otherwise with the new text, so it never flickers back
        if (data.pending) stale.current.add(data.id);
        else setEpochs((e) => bump(e, [data.id!]));
      }

      if (data?.type === "builder:doc" && data.doc) {
        const next = share(current.current, data.doc);
        current.current = next;
        if (stale.current.size) {
          const ids = [...stale.current];
          stale.current.clear();
          setEpochs((e) => bump(e, ids));
        }
        setDoc(next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <Epochs.Provider value={epochs}>
      <PageShell
        layout={doc.layout}
        blocks={doc.blocks}
        global={doc.global}
        ctx={ctx}
        brand={brand}
        after={after}
        preview
        Block={LiveBlock}
      />
    </Epochs.Provider>
  );
}
