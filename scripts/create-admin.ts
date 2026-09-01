// Creates the first dashboard user.
// Run: npm run admin:create -- you@example.com "a-long-password" "Your Name"
import { neon } from "@neondatabase/serverless";
import { auth } from "../src/lib/auth.ts";

const [email, password, name] = process.argv.slice(2);
if (!email || !password) {
  console.error(
    'usage: npm run admin:create -- <email> <password> ["Full Name"]',
  );
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL!);

const existing = await sql`select id from neon_auth."user" where email = ${email}`;
if (existing.length) {
  await sql`update neon_auth."user" set role = 'admin' where email = ${email}`;
  console.log(`${email} already existed — promoted to admin`);
  process.exit(0);
}

await auth.api.signUpEmail({
  body: { email, password, name: name ?? email.split("@")[0] },
});
await sql`update neon_auth."user" set role = 'admin' where email = ${email}`;

console.log(`admin created: ${email}`);
console.log("sign in at /admin/login");
process.exit(0);
