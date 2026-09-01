import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { generatePost } from "@/lib/ai";
import { getAutopilot, isDue, recordRun } from "@/lib/autopilot";
import { listPosts, upsertPost } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Scheduled blog writer. Deliberately provider-agnostic: it is a plain
 * authenticated GET, so Vercel Cron, GitHub Actions, cron-job.org, or a crontab
 * with curl all drive it the same way.
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://site/api/cron/autopilot
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not set" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!(await isDue())) {
    const cfg = await getAutopilot();
    return NextResponse.json({
      skipped: cfg.enabled ? "not due yet" : "autopilot is off",
      next_run_at: cfg.next_run_at,
    });
  }

  const cfg = await getAutopilot();

  try {
    const recent = (await listPosts(true)).slice(0, 10).map((p) => p.title);
    const draft = await generatePost(cfg, { avoidTitles: recent });

    const id = await upsertPost({
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

    return NextResponse.json({
      created: id,
      title: draft.title,
      status: cfg.auto_publish ? "published" : "draft",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Record the failure so the dashboard shows it and the next slot is set,
    // otherwise a broken key would retry on every single cron tick.
    await recordRun(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
