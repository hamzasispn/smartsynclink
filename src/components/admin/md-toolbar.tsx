"use client";

import { useState, type RefObject } from "react";
import { MediaPicker } from "./media-picker";

/**
 * Block buttons for the post body.
 *
 * The body stays Markdown — the renderer already handles headings, images,
 * lists and GFM tables, and Markdown is what the AI writes and rewrites, so a
 * block editor would mean a second format to convert between. These buttons
 * just drop the right snippet at the cursor.
 */
type Ref = RefObject<HTMLTextAreaElement | null>;

function useInsert(textarea: Ref, value: string, onChange: (v: string) => void) {
  return (snippet: string, wrap?: (selected: string) => string) => {
    const el = textarea.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const selected = value.slice(start, end);

    const text = wrap && selected ? wrap(selected) : snippet;
    // block snippets need a blank line above them or Markdown glues the block
    // onto the paragraph before it
    const before = value.slice(0, start);
    const pad = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";

    const next = before + pad + text + value.slice(end);
    onChange(next);

    // put the caret after what we inserted, once React has written the value
    const caret = (before + pad + text).length;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };
}

const TABLE = `| Column | Column |\n| --- | --- |\n| Cell | Cell |\n| Cell | Cell |`;

export function MdToolbar({
  textarea,
  value,
  onChange,
}: {
  textarea: Ref;
  value: string;
  onChange: (value: string) => void;
}) {
  const [picking, setPicking] = useState(false);
  const insert = useInsert(textarea, value, onChange);

  const btn =
    "rounded-lg border border-[#e7e7ec] bg-white px-3 py-1.5 text-[13px] text-[#1e1e1e] transition-colors hover:border-[#3300ea] hover:text-[#3300ea]";

  return (
    <div className="mb-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" className={btn} onClick={() => insert("## Heading\n")}>
          H2
        </button>
        <button type="button" className={btn} onClick={() => insert("### Subheading\n")}>
          H3
        </button>
        <button type="button" className={btn} onClick={() => insert("Write a paragraph here.\n")}>
          Paragraph
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => insert("**bold**", (s) => `**${s}**`)}
        >
          Bold
        </button>
        <button type="button" className={btn} onClick={() => insert("- Item\n- Item\n")}>
          List
        </button>
        <button type="button" className={btn} onClick={() => insert("> Quote\n")}>
          Quote
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => insert("[label](https://)", (s) => `[${s}](https://)`)}
        >
          Link
        </button>
        <button type="button" className={btn} onClick={() => insert(`${TABLE}\n`)}>
          Table
        </button>
        <button type="button" className={btn} onClick={() => setPicking((v) => !v)}>
          {picking ? "Close image" : "Image"}
        </button>
      </div>

      {picking ? (
        <div className="mt-3 rounded-xl border border-[#e7e7ec] bg-[#fafafa] p-3">
          <MediaPicker
            label="Insert into the body"
            value={{ src: "", alt: "" }}
            onChange={(next) => {
              if (!next.src) return;
              insert(`![${next.alt || ""}](${next.src})\n`);
              setPicking(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
