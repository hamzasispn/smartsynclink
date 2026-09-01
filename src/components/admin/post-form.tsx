"use client";

import { useState } from "react";
import type { Post } from "@/lib/posts";
import { savePostAction } from "@/app/admin/actions";
import { AiBtn, AiChoices, AiError, useAssist } from "./ai";
import { Btn, Card, Field, inputClass } from "./ui";
import { MediaPicker } from "./media-picker";

export function PostForm({ post }: { post: Post | null }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [cover, setCover] = useState(post?.cover ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [published, setPublished] = useState(post?.status === "published");

  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [instruction, setInstruction] = useState("");
  const { busy, error, setError, run } = useAssist();

  const noTitle = !title.trim();
  const noBody = !body.trim();

  return (
    <form action={savePostAction}>
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input
        type="hidden"
        name="published"
        value={published ? "true" : "false"}
      />

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-page p-3">
          <AiBtn
            label="Write the whole post"
            busyLabel="Writing…"
            active={busy === "draft"}
            disabled={noTitle}
            onClick={() =>
              run("draft", { kind: "draft", topic: title }, (r) => {
                if (r.ok && r.kind === "draft") {
                  setTitle(r.title);
                  setExcerpt(r.excerpt);
                  setTags(r.tags.join(", "));
                  setBody(r.body);
                }
              })
            }
          />
          <AiBtn
            label="Title ideas"
            active={busy === "titles"}
            disabled={noTitle && noBody}
            onClick={() =>
              run("titles", { kind: "titles", topic: title, body }, (r) => {
                if (r.ok && r.kind === "titles") setTitleOptions(r.titles);
              })
            }
          />
          <AiBtn
            label="Write excerpt"
            active={busy === "excerpt"}
            disabled={noBody}
            onClick={() =>
              run("excerpt", { kind: "excerpt", title, body }, (r) => {
                if (r.ok && r.kind === "excerpt") setExcerpt(r.excerpt);
              })
            }
          />
          <AiBtn
            label="Suggest tags"
            active={busy === "tags"}
            disabled={noBody}
            onClick={() =>
              run("tags", { kind: "tags", title, body }, (r) => {
                if (r.ok && r.kind === "tags") setTags(r.tags.join(", "));
              })
            }
          />
          {noTitle ? (
            <span className="text-[13px] text-muted">
              Add a title or topic to enable these.
            </span>
          ) : null}
        </div>

        <AiError error={error} onDismiss={() => setError(null)} />

        <AiChoices
          options={titleOptions}
          onPick={(value) => {
            setTitle(value);
            setTitleOptions([]);
          }}
          onClose={() => setTitleOptions([])}
        />

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
          <Field label="Tags" hint="Comma separated.">
            <input
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Excerpt">
          <textarea
            name="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>

        {/* the column stores a plain path, so the picker feeds a hidden input */}
        <input type="hidden" name="cover" value={cover} />
        <MediaPicker
          label="Cover image"
          value={{ src: cover, alt: title }}
          onChange={(next) => setCover(next.src)}
        />

        <div>
          <Field label="Body">
            <textarea
              name="body"
              rows={22}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`${inputClass} resize-y font-mono text-[14px] leading-[1.7]`}
            />
          </Field>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="How should it change? (blank = tighten it)"
              className={`${inputClass} h-10 max-w-[420px] py-2 text-[14px]`}
            />
            <AiBtn
              label="Rewrite body"
              busyLabel="Rewriting…"
              active={busy === "improve"}
              disabled={noBody}
              onClick={() =>
                run(
                  "improve",
                  { kind: "improve", title, body, instruction },
                  (r) => {
                    if (r.ok && r.kind === "improve") setBody(r.body);
                  },
                )
              }
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 accent-[#3300ea]"
          />
          <span className="text-[15px] text-[#1e1e1e]">Published</span>
        </label>
      </Card>

      <Btn type="submit" className="mt-5">
        Save post
      </Btn>
    </form>
  );
}
