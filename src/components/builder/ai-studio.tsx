"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { uploadMediaAction } from "@/app/admin/actions";
import { aiOptionsAction, createSectionAction, type AttachedImage } from "@/app/admin/ai-actions";

/**
 * The builder's AI: one composer — instruction, suggestions, pictures, model —
 * used by "Create with AI" (a new section) and by "Customize with AI" in the
 * inspector (the selected section). Every answer is applied as an ordinary
 * edit, so it lands in the draft, Undo takes it back, and nothing goes live
 * until Publish.
 */

type Options = Awaited<ReturnType<typeof aiOptionsAction>>;
export type Attachment = AttachedImage & { name: string };
export type AiRequest = { instruction: string; model?: string; images: Attachment[]; placeImages: boolean };

// one round-trip per builder session, shared by every composer on the screen
let optionsOnce: Promise<Options> | null = null;
function useAiOptions() {
  const [options, setOptions] = useState<Options | null>(null);
  useEffect(() => {
    optionsOnce ??= aiOptionsAction();
    optionsOnce.then(setOptions).catch(() => (optionsOnce = null));
  }, []);
  return options;
}

const MODEL_KEY = "builder-ai-model";

export function Spark({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.5c.4 0 .7.3.8.6l1.6 4.9a3 3 0 0 0 1.9 1.9l4.9 1.6a.8.8 0 0 1 0 1.6l-4.9 1.6a3 3 0 0 0-1.9 1.9l-1.6 4.9a.8.8 0 0 1-1.6 0l-1.6-4.9a3 3 0 0 0-1.9-1.9l-4.9-1.6a.8.8 0 0 1 0-1.6l4.9-1.6a3 3 0 0 0 1.9-1.9l1.6-4.9c.1-.3.4-.6.8-.6z" />
    </svg>
  );
}

/* ---------------------------------------------------------------- model -- */

function ModelPicker({ options, value, onChange }: { options: Options; value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => box.current?.contains(e.target as Node) || setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!options.models.length) return <span className="text-[11.5px] text-muted">{options.model}</span>;
  const current = options.models.find((m) => m.id === value);
  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="size-1.5 rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA]" />
        {current ? current.label.replace("Claude ", "") : "Default"}
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul role="listbox" className="absolute bottom-full left-0 z-30 mb-1.5 w-[260px] rounded-xl border border-line bg-white p-1.5 shadow-[0_20px_40px_-16px_rgba(14,14,20,0.35)]">
          {[{ id: "", label: "Default", note: `Your saved model (${options.model})` }, ...options.models].map((m) => (
            <li key={m.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === m.id}
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${value === m.id ? "bg-brand-soft" : "hover:bg-surface"}`}
              >
                <span className={`block text-[12.5px] font-medium ${value === m.id ? "text-brand" : "text-ink"}`}>{m.label}</span>
                <span className="block text-[11.5px] leading-snug text-muted">{m.note}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- composer -- */

async function upload(file: File): Promise<Attachment> {
  const form = new FormData();
  form.set("file", file);
  const result = await uploadMediaAction(form);
  if (!result.ok) throw new Error(result.error);
  return { id: result.item.id, url: result.item.url, name: file.name || "Pasted image" };
}

export function AiComposer({
  busy,
  submitLabel,
  placeholder,
  suggestions,
  allowPlace = true,
  onSubmit,
}: {
  busy: boolean;
  submitLabel: string;
  placeholder: string;
  suggestions: string[];
  allowPlace?: boolean;
  /** Resolves true when the answer was applied, which clears the box; on an error the request stays to retry. */
  onSubmit: (request: AiRequest) => Promise<boolean>;
}) {
  const options = useAiOptions();
  const [instruction, setInstruction] = useState("");
  const [images, setImages] = useState<Attachment[]>([]);
  const [placeImages, setPlaceImages] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // the last model picked sticks across selections and sessions (the composer only mounts in the browser)
  const [model, setModel] = useState(() => {
    try {
      return localStorage.getItem(MODEL_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [dragging, setDragging] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const text = useRef<HTMLTextAreaElement>(null);

  const pickModel = (id: string) => {
    setModel(id);
    try {
      localStorage.setItem(MODEL_KEY, id);
    } catch {}
  };

  const attach = async (files: File[]) => {
    const pictures = files.filter((f) => f.type.startsWith("image/")).slice(0, 4 - images.length);
    if (!pictures.length) return;
    setUploadError(null);
    setUploading((n) => n + pictures.length);
    for (const picture of pictures) {
      try {
        const added = await upload(picture);
        setImages((list) => [...list, added].slice(0, 4));
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "The picture could not be uploaded.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const ready = instruction.trim().length > 0 && !busy && !uploading;
  const submit = async () => {
    if (!ready) return;
    const ok = await onSubmit({ instruction: instruction.trim(), model: model || undefined, images, placeImages: allowPlace && placeImages });
    if (!ok) return;
    setInstruction("");
    setImages([]);
    setPlaceImages(false);
  };

  if (options && !options.configured) {
    return (
      <p className="rounded-xl bg-amber-50 px-3.5 py-3 text-[12.5px] leading-relaxed text-amber-900">
        The AI needs an API key.{" "}
        <Link href="/admin/settings" className="font-medium underline">
          Add one under Settings → AI connection
        </Link>
        .
      </p>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setDragging(true);
          }
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void attach([...e.dataTransfer.files]);
        }}
        className={`relative overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] focus-within:border-brand/50 focus-within:shadow-[0_0_0_4px_rgba(51,0,234,0.08)] ${
          dragging ? "border-brand shadow-[0_0_0_4px_rgba(51,0,234,0.12)]" : "border-line"
        }`}
      >
        {busy ? <span aria-hidden="true" className="ai-progress absolute inset-x-0 top-0 h-0.5" /> : null}
        <textarea
          ref={text}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void submit();
            }
          }}
          onPaste={(e) => {
            const pasted = [...e.clipboardData.files].filter((f) => f.type.startsWith("image/"));
            if (pasted.length) {
              e.preventDefault();
              void attach(pasted);
            }
          }}
          rows={3}
          disabled={busy}
          placeholder={placeholder}
          className="block max-h-56 min-h-[84px] w-full resize-none bg-transparent px-3.5 pt-3 pb-2 text-[13.5px] leading-relaxed text-ink outline-none placeholder:text-muted/70 disabled:opacity-60"
        />

        {images.length || uploading ? (
          <div className="flex flex-wrap items-center gap-2 px-3.5 pb-2">
            {images.map((image) => (
              <span key={image.id} className="group relative size-14 overflow-hidden rounded-lg ring-1 ring-line">
                {/* eslint-disable-next-line @next/next/no-img-element -- a thumbnail of an upload, not page content */}
                <img src={image.url} alt={image.name} className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((list) => list.filter((i) => i.id !== image.id))}
                  aria-label={`Remove ${image.name}`}
                  className="absolute top-0.5 right-0.5 grid size-5 place-items-center rounded-full bg-ink/80 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                >
                  ✕
                </button>
              </span>
            ))}
            {Array.from({ length: uploading }).map((_, i) => (
              <span key={i} className="size-14 animate-pulse rounded-lg bg-surface" />
            ))}
          </div>
        ) : null}

        {images.length && allowPlace ? (
          <div className="mx-3.5 mb-2 flex rounded-lg bg-surface p-0.5 text-[11.5px] font-medium" role="radiogroup" aria-label="What the pictures are for">
            {(
              [
                [false, "Just a reference"],
                [true, "Put them in the section"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={placeImages === value}
                onClick={() => setPlaceImages(value)}
                className={`flex-1 rounded-md px-2 py-1.5 transition-colors ${placeImages === value ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-1 border-t border-line/70 px-2 py-1.5">
          <input
            ref={file}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              void attach([...(e.target.files ?? [])]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => file.current?.click()}
            disabled={busy || images.length >= 4}
            title="Attach pictures — a screenshot to copy the look of, or photos to use. You can also paste or drop them."
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />
            </svg>
            Image
          </button>
          {options ? <ModelPicker options={options} value={model} onChange={pickModel} /> : null}
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!ready}
            className={`ml-auto flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(51,0,234,0.8)] transition-opacity ${
              busy ? "cursor-wait" : "disabled:opacity-40 disabled:shadow-none"
            }`}
          >
            <Spark />
            <span className={busy ? "animate-pulse" : ""}>{busy ? "Working…" : submitLabel}</span>
          </button>
        </div>
      </div>

      {uploadError ? <p className="mt-2 text-[12px] text-red-600">{uploadError}</p> : null}

      {!busy && !instruction ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setInstruction(s);
                text.current?.focus();
              }}
              className="rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] text-muted transition-colors hover:border-brand/40 hover:text-brand"
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-muted">{busy ? "This can take up to a minute for a big section." : "Ctrl + Enter to send · paste or drop a screenshot to attach it"}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------- create with ai, dialog -- */

const CREATE_SUGGESTIONS = [
  "Four benefits as a bento grid",
  "How it works in three steps",
  "A FAQ about pricing and setup",
  "Two customer quotes side by side",
  "A call-to-action band to book a demo",
  "Copy the layout of the attached screenshot",
];

/** Mounted while open, so every opening starts clean. */
export function CreateWithAi({
  onClose,
  page,
  after,
  onCreate,
  onUndo,
}: {
  onClose: () => void;
  page: { label: string; sections: string[] };
  /** Where it goes: after this section's name, or the end of the page. */
  after: string | null;
  onCreate: (props: Record<string, unknown>, label: string) => void;
  onUndo: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ label: string; summary: string; after: string | null } | null>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [busy, onClose]);

  const run = async (request: AiRequest) => {
    // where it goes, read now: once added, the new section is the selection
    const place = after;
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      const result = await createSectionAction({
        instruction: request.instruction,
        page,
        model: request.model,
        images: request.images.map(({ id, url }) => ({ id, url })),
        placeImages: request.placeImages,
      });
      if (!result.ok) throw new Error(result.error);
      onCreate(result.props, result.label);
      setDone({ label: result.label, summary: result.summary, after: place });
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI could not build that section.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/30 p-4 backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="ai-create-title" className="w-full max-w-[600px] overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_-30px_rgba(14,14,20,0.55)]">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#052EFF] to-[#3300EA] px-6 pt-6 pb-5 text-white">
          <span aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] text-white/75 uppercase">
                <Spark /> AI section builder
              </p>
              <h2 id="ai-create-title" className="mt-2 text-[22px] font-medium tracking-[-0.02em]">
                Describe a section. The AI builds it.
              </h2>
              <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-white/75">
                Built from the site&apos;s own blocks, so it matches the design on every screen. Edit it afterwards like any section.
              </p>
            </div>
            <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-40">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {done ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="text-[14px] font-medium text-ink">
                <span className="text-emerald-600">✓</span> Added “{done.label}” {done.after ? `after “${done.after}”` : "at the end of the page"}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{done.summary}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={onClose} className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white">
                  Keep it
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUndo();
                    setDone(null);
                  }}
                  className="rounded-lg border border-line px-4 py-2 text-[13px] font-medium text-ink hover:border-red-300 hover:text-red-600"
                >
                  Undo
                </button>
                <button type="button" onClick={() => setDone(null)} className="ml-auto rounded-lg px-3 py-2 text-[13px] font-medium text-brand hover:bg-brand-soft">
                  Make another
                </button>
              </div>
            </div>
          ) : (
            <>
              <AiComposer
                busy={busy}
                submitLabel="Build section"
                placeholder="e.g. A section for plumbers on why an AI receptionist pays off — a short heading, four benefits as a bento grid and a button to book a demo"
                suggestions={CREATE_SUGGESTIONS}
                onSubmit={run}
              />
              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
                <span className="rounded-md bg-surface px-2 py-1 font-medium text-ink">{page.label}</span>
                {after ? <>goes after “{after}”</> : <>goes at the end of the page</>}
                <span className="ml-auto">Select a section first to place it there</span>
              </p>
            </>
          )}
          {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] leading-relaxed text-red-700">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
