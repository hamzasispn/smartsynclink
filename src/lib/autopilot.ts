import { sql } from "./db";

export type Autopilot = {
  enabled: boolean;
  every_hours: number;
  topics: string[];
  tone: string;
  audience: string;
  words: number;
  auto_publish: boolean;
  model: string;
  last_run_at: string | null;
  next_run_at: string | null;
  last_error: string | null;
};

export async function getAutopilot() {
  const rows = await sql`select * from blog_autopilot where id = 1`;
  return rows[0] as Autopilot;
}

export async function saveAutopilot(a: Partial<Autopilot>) {
  const current = await getAutopilot();
  const next = { ...current, ...a };
  await sql`
    update blog_autopilot set
      enabled = ${next.enabled}, every_hours = ${next.every_hours},
      topics = ${next.topics}, tone = ${next.tone}, audience = ${next.audience},
      words = ${next.words}, auto_publish = ${next.auto_publish},
      model = ${next.model}, updated_at = now()
    where id = 1`;
}

/** Marks a run as finished, and schedules the next one from *now*. */
export async function recordRun(error: string | null) {
  const { every_hours } = await getAutopilot();
  await sql`
    update blog_autopilot set
      last_run_at = now(),
      next_run_at = now() + make_interval(hours => ${every_hours}),
      last_error  = ${error}
    where id = 1`;
}

/** True when the schedule says a post is owed. */
export async function isDue() {
  const rows = await sql`
    select enabled and (next_run_at is null or next_run_at <= now()) as due
    from blog_autopilot where id = 1`;
  return Boolean(rows[0]?.due);
}
