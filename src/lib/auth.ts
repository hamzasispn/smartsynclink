import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { Pool } from "pg";

/**
 * Neon Auth already provisions and owns the better-auth tables, and keeps them
 * in its own `neon_auth` schema. Rather than duplicating that schema in
 * `public`, the pool is pinned to it with a search_path — better-auth then
 * finds `user`, `session`, `account` and `verification` unqualified.
 *
 * channel_binding is stripped: Neon's pooler advertises it, node-postgres does
 * not implement it, and the handshake fails with it left in the URL.
 */
const connectionString = (process.env.DATABASE_URL ?? "")
  // channel_binding is advertised by Neon but not implemented by node-postgres
  .replace(/[?&]channel_binding=[^&]*/, "")
  // Neon's *pooler* rejects the search_path startup parameter; its direct
  // endpoint accepts it. Setting it as a startup parameter matters: doing it
  // from a pool "connect" handler is a race — that event is not awaited, so
  // queries can reach the server before the path is applied and fail with
  // 42P01 undefined_table.
  .replace("-pooler.", ".");

const pool = new Pool({
  connectionString,
  options: "-c search_path=neon_auth,public",
  max: 3,
});

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 10,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    database: {
      // Neon Auth declares every id column as uuid; better-auth's own ids are
      // short random strings and are rejected by that type. Letting the column
      // default (gen_random_uuid()) win is the only thing that inserts cleanly.
      generateId: false,
    },
  },
  // gives us user.role / ban controls, which the neon_auth columns already have
  plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
