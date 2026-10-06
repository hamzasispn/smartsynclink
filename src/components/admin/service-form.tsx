"use client";

import { useState } from "react";
import type { Service } from "@/lib/services";
import { saveServiceAction } from "@/app/admin/actions";
import { AiBtn, AiError, useAssist } from "./ai";
import { Btn, Card, Field, inputClass } from "./ui";
import { MediaPicker } from "./media-picker";

export function ServiceForm({ service }: { service: Service | null }) {
  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [position, setPosition] = useState(service?.position ?? 0);
  const [excerpt, setExcerpt] = useState(service?.excerpt ?? "");
  const [image, setImage] = useState(service?.image ?? "");
  const [body, setBody] = useState(service?.body ?? "");
  const [published, setPublished] = useState(service?.published ?? true);
  const [notes, setNotes] = useState("");

  const { busy, error, setError, run } = useAssist();

  return (
    <form action={saveServiceAction}>
      <input type="hidden" name="id" value={service?.id ?? ""} />
      <input
        type="hidden"
        name="published"
        value={published ? "true" : "false"}
      />

      <Card className="space-y-5">
        <div className="rounded-xl bg-page p-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything specific it should cover (optional)"
              className={`${inputClass} h-10 max-w-[420px] py-2 text-[14px]`}
            />
            <AiBtn
              label="Write this page"
              busyLabel="Writing…"
              active={busy === "service"}
              disabled={!title.trim()}
              onClick={() =>
                run("service", { kind: "service", title, notes }, (r) => {
                  if (r.ok && r.kind === "service") {
                    setExcerpt(r.excerpt);
                    setBody(r.body);
                  }
                })
              }
            />
          </div>
          {!title.trim() ? (
            <p className="mt-2 text-[13px] text-muted">
              Give it a title first — that is the brief.
            </p>
          ) : null}
        </div>

        <AiError error={error} onDismiss={() => setError(null)} />

        <Field label="Title">
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Slug" hint="Leave empty to generate from the title.">
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Order" hint="Lower numbers appear first.">
            <input
              name="position"
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Excerpt"
          hint="One or two lines, used on the listing page."
        >
          <textarea
            name="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>

        {/* the column stores a plain path, so the picker feeds a hidden input */}
        <input type="hidden" name="image" value={image} />
        <MediaPicker
          label="Image"
          value={{ src: image, alt: title }}
          onChange={(next) => setImage(next.src)}
        />

        <Field label="Body">
          {/* the conventions the solution page reads, see lib/solution-page */}
          <span className="mb-2 block text-[13px] leading-relaxed text-muted">
            Shows at /solutions/{"{slug}"}. Optional settings at the very top, between two <code>---</code> lines:{" "}
            <code>title:</code>, <code>description:</code> and <code>keywords:</code> for Google, <code>heading:</code> for
            the big headline, <code>related:</code> for the solutions linked at the bottom (their slugs, comma-separated),
            <code>cta_heading:</code>, <code>cta_text:</code>, <code>cta_note:</code> for the closing box, and{" "}
            <code>highlight:</code> for phrases to colour in the headings (the solution&apos;s name is coloured anyway). Questions
            under a <code>## Frequently asked questions</code> heading, each as <code>### question</code> with its answer
            below, show as an accordion and become FAQ results on Google.
          </span>
          <textarea
            name="body"
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${inputClass} resize-y font-mono text-[14px] leading-[1.7]`}
          />
        </Field>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 accent-[#3300ea]"
          />
          <span className="text-[15px] text-[#1e1e1e]">
            Visible on the site
          </span>
        </label>
      </Card>

      <Btn type="submit" className="mt-5">
        Save service
      </Btn>
    </form>
  );
}
