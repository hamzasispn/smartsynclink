"use client";

import { useState, useTransition } from "react";
import { defaultGlobal, type GlobalContent } from "@/content/global";
import { saveGlobalAction } from "@/app/admin/actions";
import { assistAction } from "@/app/admin/ai-actions";
import { Btn } from "./ui";
import { ContentEditor } from "./content-editor";

/**
 * Brand, navigation and footer — the parts every page renders. Same recursive
 * editor as the home page, pointed at the global document.
 */
export function GlobalForm({ initial }: { initial: GlobalContent }) {
  const [draft, setDraft] = useState(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  async function assist({
    text,
    instruction,
    context,
  }: {
    text: string;
    instruction: string;
    context: string;
  }) {
    const result = await assistAction({ kind: "rewrite", text, instruction, context });
    if (!result.ok) throw new Error(result.error);
    if (result.kind !== "rewrite") throw new Error("Unexpected response");
    return result.text;
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-10 -mx-1 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/90 px-5 py-3 backdrop-blur">
        <p className="text-[14px] text-muted">
          {pending
            ? "Saving…"
            : dirty
              ? "Unsaved changes"
              : saved
                ? `Saved ${new Date(saved).toLocaleTimeString()}`
                : "Everything up to date"}
        </p>
        <Btn
          onClick={() =>
            start(async () => setSaved((await saveGlobalAction(draft)).at))
          }
          disabled={pending || !dirty}
        >
          Save changes
        </Btn>
      </div>

      <ContentEditor
        value={draft as never}
        shape={defaultGlobal}
        assist={assist}
        onChange={(next) => setDraft(next as unknown as GlobalContent)}
      />
    </div>
  );
}
