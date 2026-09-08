"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { defaultIndustry, type IndustryContent } from "@/content/industry";
import type { Industry } from "@/lib/industries";
import { saveIndustryAction } from "@/app/admin/actions";
import { assistAction } from "@/app/admin/ai-actions";
import { ContentEditor } from "./content-editor";
import { Btn, Card, Field, inputClass } from "./ui";

/**
 * One industry landing page: the row's own fields, then the page document.
 *
 * The meta fields are React state rather than an uncontrolled form because
 * the page sections below them are a nested document — one save has to send
 * both, and a plain form post cannot carry the document.
 */
export function IndustryForm({ industry }: { industry: Industry | null }) {
  const router = useRouter();

  const [name, setName] = useState(industry?.name ?? "");
  const [slug, setSlug] = useState(industry?.slug ?? "");
  const [excerpt, setExcerpt] = useState(industry?.excerpt ?? "");
  const [position, setPosition] = useState(industry?.position ?? 0);
  const [published, setPublished] = useState(industry?.published ?? true);
  const [data, setData] = useState<IndustryContent>(
    industry?.data ?? defaultIndustry,
  );

  const [pending, start] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function assist({
    text,
    instruction,
    context,
  }: {
    text: string;
    instruction: string;
    context: string;
  }) {
    const result = await assistAction({
      kind: "rewrite",
      text,
      instruction,
      context,
    });
    if (!result.ok) throw new Error(result.error);
    if (result.kind !== "rewrite") throw new Error("Unexpected response");
    return result.text;
  }

  function save() {
    if (!name.trim()) {
      setError("Give the industry a name first.");
      return;
    }
    setError(null);
    start(async () => {
      const result = await saveIndustryAction({
        id: industry?.id,
        name: name.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        position,
        published,
        data,
      });
      setSaved(result.at);
      // a new row has just claimed a URL — land on it so the next save updates
      // the same page instead of creating another
      if (!industry) router.replace(`/admin/industries/${result.id}`);
      else router.refresh();
    });
  }

  const preview = slug.trim() || "…";

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-10 -mx-1 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/90 px-5 py-3 backdrop-blur">
        <p className="text-[14px] text-muted">
          {pending
            ? "Saving…"
            : saved
              ? `Saved ${new Date(saved).toLocaleTimeString()}`
              : industry
                ? `Live at /industries/${industry.slug}`
                : "Not saved yet"}
        </p>
        <Btn onClick={save} disabled={pending}>
          {industry ? "Save industry" : "Create industry"}
        </Btn>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700"
        >
          {error}
        </p>
      ) : null}

      <Card className="space-y-5">
        <Field label="Industry name" hint="Shown in the dashboard and as the page title.">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contractors"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Slug"
            hint={`The page will be /industries/${preview}. Leave empty to build it from the name.`}
          >
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="contractors"
              className={inputClass}
            />
          </Field>
          <Field label="Order" hint="Lower numbers come first in listings.">
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Summary" hint="Used as the page description for search results.">
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 accent-[#3300ea]"
          />
          <span className="text-[15px] text-[#1e1e1e]">Visible on the site</span>
        </label>
      </Card>

      <ContentEditor
        value={data as never}
        shape={defaultIndustry}
        assist={assist}
        onChange={(next) => setData(next as unknown as IndustryContent)}
      />
    </div>
  );
}
