"use client";

import { useRef, useState, useTransition } from "react";
import {
  deleteMediaAction,
  listMediaAction,
  uploadMediaAction,
} from "@/app/admin/actions";
import type { MediaItem } from "@/lib/media";
import { inputClass } from "./ui";

export type ImageValue = { src: string; alt: string };

// A Server Action body is capped at 1MB. Kept a little under 1024*1024 so the
// multipart boundary and filename that ride along cannot tip it over.
const MAX_UPLOAD = 1_000_000;

/**
 * Replaces the raw src/alt text pair everywhere an image is edited.
 *
 * Uploading is the primary path — typing a URL was the only option before and
 * meant knowing where a file lived before you could use it. Anything already
 * uploaded is one click away in the library, so the same logo or photo does
 * not get uploaded five times.
 */
export function MediaPicker({
  value,
  label,
  accept = "image",
  onChange,
}: {
  value: ImageValue;
  label?: string;
  /** Which kind of file this slot takes. Drives the picker, the file dialog
   *  and what the library offers — a video slot never lists images. */
  accept?: "image" | "video";
  onChange: (next: ImageValue) => void;
}) {
  const isVideo = accept === "video";
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState<MediaItem[] | null>(null);
  const [dropping, setDropping] = useState(false);

  function upload(file: File) {
    setError(null);

    // Going over the cap throws a raw 413 that replaces the dashboard with
    // an error page. Checking first keeps the failure inside the form, where
    // it reads as a message next to the field instead of losing the page.
    if (file.size > MAX_UPLOAD) {
      setError(
        `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 1MB — compress it and try again.`,
      );
      return;
    }

    const form = new FormData();
    form.set("file", file);
    start(async () => {
      const result = await uploadMediaAction(form);
      if (!result.ok) setError(result.error);
      else onChange({ ...value, src: result.item.url, alt: value.alt || result.item.filename });
    });
  }

  function openLibrary() {
    setError(null);
    start(async () => {
      const all = await listMediaAction();
      setLibrary(all.filter((item) => item.mime.startsWith(accept + "/")));
    });
  }

  return (
    <div className="space-y-3">
      {label ? (
        <span className="block text-[13px] font-medium text-[#1e1e1e]">{label}</span>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDropping(true);
        }}
        onDragLeave={() => setDropping(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDropping(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`flex items-center gap-4 rounded-xl border border-dashed p-3 transition-colors ${
          dropping ? "border-brand bg-brand/[0.06]" : "border-line bg-page"
        }`}
      >
        {value.src && isVideo ? (
          <video
            src={value.src}
            muted
            playsInline
            preload="metadata"
            className="size-16 shrink-0 rounded-lg bg-black object-cover"
          />
        ) : value.src ? (
          // eslint-disable-next-line @next/next/no-img-element -- uploads have
          // no known dimensions here and next/image would need them
          <img
            src={value.src}
            alt=""
            className="size-16 shrink-0 rounded-lg bg-white object-contain"
          />
        ) : (
          <span className="grid size-16 shrink-0 place-items-center rounded-lg border border-line bg-white text-[11px] text-muted">
            none
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => fileInput.current?.click()}
              className="rounded-full bg-brand px-4 py-1.5 text-[13px] text-white disabled:opacity-50"
            >
              {pending ? "Uploading…" : value.src ? "Replace" : "Upload"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={openLibrary}
              className="rounded-full border border-line bg-white px-4 py-1.5 text-[13px] text-[#1e1e1e] disabled:opacity-50"
            >
              Library
            </button>
            {value.src ? (
              <button
                type="button"
                onClick={() => onChange({ ...value, src: "" })}
                className="rounded-full border border-line bg-white px-4 py-1.5 text-[13px] text-red-600"
              >
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-1.5 truncate text-[12px] text-muted">
            {value.src ||
              (isVideo
                ? "Drop an MP4 here, or upload one (up to 64MB)."
                : "Drop a file here, or upload one.")}
          </p>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept={isVideo ? "video/*" : "image/*"}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] text-muted">
          {isVideo
            ? "Description — read out by screen readers, and shown if the video cannot play"
            : "Alt text — describes the image for screen readers and search engines"}
        </span>
        <input
          type="text"
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          className={inputClass}
        />
      </label>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </p>
      ) : null}

      {library ? (
        <div className="rounded-xl border border-line bg-page p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#1e1e1e]">
              Library ({library.length})
            </span>
            <button
              type="button"
              onClick={() => setLibrary(null)}
              className="text-[13px] text-muted"
            >
              Close
            </button>
          </div>

          {library.length ? (
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {library.map((item) => (
                <li key={item.id} className="group relative">
                  <button
                    type="button"
                    title={item.filename}
                    onClick={() => {
                      onChange({ ...value, src: item.url, alt: value.alt || item.filename });
                      setLibrary(null);
                    }}
                    className="block w-full overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-brand"
                  >
                    {item.mime.startsWith("video/") ? (
                      <video
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="aspect-square w-full bg-black object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt="" className="aspect-square w-full object-contain" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.filename}`}
                    onClick={() =>
                      start(async () => {
                        await deleteMediaAction(item.id);
                        const all = await listMediaAction();
                        setLibrary(all.filter((m) => m.mime.startsWith(accept + "/")));
                      })
                    }
                    className="absolute -right-1.5 -top-1.5 hidden size-5 place-items-center rounded-full border border-red-200 bg-white text-[11px] text-red-600 group-hover:grid"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-[13px] text-muted">
              Nothing uploaded yet.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
