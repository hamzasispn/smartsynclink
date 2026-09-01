"use client";

import { SiteLogo } from "@/components/site-logo";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Btn, Field, inputClass } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const { error } = await signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (error) {
      setError(error.message ?? "Could not sign in.");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-page px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8 shadow-card"
      >
        <div className="mb-7 flex items-center">
          <SiteLogo height={26} />
        </div>

        <h1 className="text-[22px] font-medium tracking-[-0.02em] text-[#1e1e1e]">
          Sign in
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">
          Dashboard access for site editors.
        </p>

        <div className="mt-7 space-y-4">
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </Field>
          <Field label="Password">
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </Field>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700"
          >
            {error}
          </p>
        ) : null}

        <Btn type="submit" disabled={busy} className="mt-6 w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Btn>
      </form>
    </main>
  );
}
