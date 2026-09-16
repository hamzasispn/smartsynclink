// Full database backup: content, posts, industries, users and the uploaded
// images (they live in the `media` table as bytea, so a dump has everything).
//
//   npm run db:backup
//
// Writes backups/smartsynclink-<date>.dump in Postgres' custom format, which is
// what restores into a new database:
//
//   pg_restore --no-owner --no-privileges -d "<new DATABASE_URL>" backups/<file>.dump
//
// pg_dump ships with pgAdmin, so no separate install is needed; the paths below
// cover the usual spots. If yours is elsewhere, set PG_DUMP to the full path.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const CANDIDATES = [
  process.env.PG_DUMP,
  join(process.env.LOCALAPPDATA ?? "", "Programs", "pgAdmin 4", "runtime", "pg_dump.exe"),
  "C:/Program Files/pgAdmin 4/runtime/pg_dump.exe",
  "C:/Program Files/PostgreSQL/18/bin/pg_dump.exe",
  "C:/Program Files/PostgreSQL/17/bin/pg_dump.exe",
  "pg_dump",
].filter(Boolean) as string[];

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set — run with: node --env-file=.env.local scripts/backup-db.ts");

const exe = CANDIDATES.find((path) => path === "pg_dump" || existsSync(path));
if (!exe) throw new Error(`pg_dump not found. Tried:\n${CANDIDATES.join("\n")}\nSet PG_DUMP to its full path.`);

const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
const out = join("backups", `smartsynclink-${stamp}.dump`);
mkdirSync("backups", { recursive: true });

console.log(`pg_dump: ${exe}`);
console.log(`writing: ${out}`);

const result = spawnSync(
  exe,
  [url, "--format=custom", "--no-owner", "--no-privileges", "--file", out],
  { encoding: "utf8", stdio: ["ignore", "inherit", "pipe"] },
);

if (result.status !== 0) {
  // never echo the connection string — it carries the password
  const message = (result.stderr || String(result.error)).replaceAll(url, "<DATABASE_URL>");
  console.error(message.trim());
  throw new Error(`pg_dump failed with exit code ${result.status}`);
}

const { size } = await import("node:fs").then((fs) => fs.promises.stat(out));
console.log(`done — ${(size / 1024 / 1024).toFixed(1)} MB`);
