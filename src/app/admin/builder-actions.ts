"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { GlobalContent } from "@/content/global";
import { auth } from "@/lib/auth";
import { findBuilderPage, listBuilderPages } from "@/lib/builder/pages";
import {
  discardDraft,
  getBuilderState,
  publish,
  restoreVersion,
  saveDraft,
} from "@/lib/builder/store";
import type { Blocks, Layout } from "@/lib/builder/types";

/**
 * Server actions are public POST endpoints — every one re-checks the session
 * itself, exactly like the rest of admin/actions.ts.
 */
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not signed in");
}

async function requirePage(pageKey: string) {
  const page = await findBuilderPage(pageKey);
  if (!page) throw new Error("Unknown page");
  return page;
}

export async function loadBuilderAction(pageKey: string) {
  await requireAdmin();
  const page = await requirePage(pageKey);
  const [state, pages] = await Promise.all([getBuilderState(pageKey), listBuilderPages()]);
  return { page, pages, ...state };
}

export async function saveDraftAction(
  pageKey: string,
  draft: { layout: Layout; blocks: Blocks; global: GlobalContent },
) {
  await requireAdmin();
  await requirePage(pageKey);
  const at = await saveDraft(pageKey, draft);
  return { ok: true as const, at };
}

export async function publishAction(pageKey: string) {
  await requireAdmin();
  await requirePage(pageKey);
  const at = await publish(pageKey);
  // header, footer and shared blocks appear on every page, so the whole site refreshes
  revalidatePath("/", "layout");
  return { ok: true as const, at };
}

export async function discardDraftAction(pageKey: string) {
  await requireAdmin();
  await requirePage(pageKey);
  await discardDraft(pageKey);
  return getBuilderState(pageKey);
}

export async function restoreVersionAction(pageKey: string, at: string) {
  await requireAdmin();
  await requirePage(pageKey);
  await restoreVersion(pageKey, at);
  return getBuilderState(pageKey);
}
