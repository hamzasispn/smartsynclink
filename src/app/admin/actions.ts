"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { generatePost } from "@/lib/ai";
import { getAutopilot, recordRun, saveAutopilot } from "@/lib/autopilot";
import { saveGlobalContent, saveHomeContent } from "@/lib/content";
import type { GlobalContent } from "@/content/global";
import type { HomeContent } from "@/content/home";
import { saveAiSettings, clearAiKey } from "@/lib/ai-settings";
import { deleteMedia, listMedia, storeUpload } from "@/lib/media";
import { deletePost, listPosts, upsertPost } from "@/lib/posts";
import { deleteService, upsertService } from "@/lib/services";

/**
 * Server actions are public POST endpoints — the /admin layout guard does not
 * protect them. Every action re-checks the session for itself.
 */
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
  return session;
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const bool = (f: FormData, k: string) =>
  f.get(k) === "on" || f.get(k) === "true";
const num = (f: FormData, k: string, fallback: number) => {
  const n = Number(f.get(k));
  return Number.isFinite(n) ? n : fallback;
};

/* ------------------------------------------------------------ home page -- */

export async function saveHomeAction(data: HomeContent) {
  await requireAdmin();
  await saveHomeContent(data);
  revalidatePath("/");
  revalidatePath("/admin/pages/home");
  return { ok: true as const, at: new Date().toISOString() };
}

/* ------------------------------------------------------- global content -- */

export async function saveGlobalAction(data: GlobalContent) {
  await requireAdmin();
  await saveGlobalContent(data);
  // brand, nav and footer render on every page, so nothing can stay cached
  revalidatePath("/", "layout");
  return { ok: true as const, at: new Date().toISOString() };
}

/* ---------------------------------------------------------------- media -- */

export async function uploadMediaAction(form: FormData) {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) {
    return { ok: false as const, error: "No file was selected." };
  }
  try {
    return { ok: true as const, item: await storeUpload(file) };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function listMediaAction() {
  await requireAdmin();
  return listMedia();
}

export async function deleteMediaAction(id: string) {
  await requireAdmin();
  await deleteMedia(id);
  return { ok: true as const };
}

/* ------------------------------------------------------- ai connection -- */

export async function saveAiSettingsAction(form: FormData) {
  await requireAdmin();
  await saveAiSettings({
    provider:
      str(form, "provider") === "openai-compatible"
        ? "openai-compatible"
        : "anthropic",
    base_url: str(form, "base_url"),
    api_key: str(form, "api_key"),
    model: str(form, "model"),
  });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/autopilot");
}

export async function clearAiKeyAction() {
  await requireAdmin();
  await clearAiKey();
  revalidatePath("/admin/settings");
}

/* ------------------------------------------------------------- services -- */

export async function saveServiceAction(form: FormData) {
  await requireAdmin();
  const id = str(form, "id");
  await upsertService({
    id: id || undefined,
    slug: str(form, "slug"),
    title: str(form, "title"),
    excerpt: str(form, "excerpt"),
    body: str(form, "body"),
    image: str(form, "image"),
    position: num(form, "position", 0),
    published: bool(form, "published"),
  });
  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteServiceAction(form: FormData) {
  await requireAdmin();
  await deleteService(str(form, "id"));
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

/* ----------------------------------------------------------------- blog -- */

export async function savePostAction(form: FormData) {
  await requireAdmin();
  const id = str(form, "id");
  await upsertPost({
    id: id || undefined,
    slug: str(form, "slug"),
    title: str(form, "title"),
    excerpt: str(form, "excerpt"),
    body: str(form, "body"),
    cover: str(form, "cover"),
    tags: str(form, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: bool(form, "published") ? "published" : "draft",
  });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePostAction(form: FormData) {
  await requireAdmin();
  await deletePost(str(form, "id"));
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

/* ------------------------------------------------------------ autopilot -- */

export async function saveAutopilotAction(form: FormData) {
  await requireAdmin();
  await saveAutopilot({
    enabled: bool(form, "enabled"),
    every_hours: Math.max(1, num(form, "every_hours", 24)),
    topics: str(form, "topics")
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean),
    tone: str(form, "tone"),
    audience: str(form, "audience"),
    words: Math.max(200, num(form, "words", 900)),
    auto_publish: bool(form, "auto_publish"),
  });
  revalidatePath("/admin/autopilot");
}

/** "Write one now" — same path the cron takes, minus the schedule check. */
export async function runAutopilotAction(form: FormData) {
  await requireAdmin();
  const cfg = await getAutopilot();
  const topic = str(form, "topic");

  try {
    const recent = (await listPosts(true)).slice(0, 10).map((p) => p.title);
    const draft = await generatePost(cfg, { topic, avoidTitles: recent });
    await upsertPost({
      title: draft.title,
      excerpt: draft.excerpt,
      body: draft.body_markdown,
      tags: draft.tags,
      status: cfg.auto_publish ? "published" : "draft",
      source: "autopilot",
    });
    await recordRun(null);
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath("/admin/autopilot");
    return { ok: true as const, title: draft.title };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await recordRun(message);
    revalidatePath("/admin/autopilot");
    return { ok: false as const, error: message };
  }
}

/* ----------------------------------------------------------------- auth -- */

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
