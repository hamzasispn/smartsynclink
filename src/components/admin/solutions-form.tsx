"use client";

import { useState, useTransition } from "react";
import { defaultSolutions, type SolutionsContent } from "@/content/solutions";
import { saveSolutionsAction } from "@/app/admin/actions";
import { assistAction } from "@/app/admin/ai-actions";
import { ContentEditor } from "./content-editor";
import { Btn } from "./ui";

export function SolutionsForm({ initial }: { initial: SolutionsContent }) {
  const [draft, setDraft] = useState(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

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

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

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
            start(async () => setSaved((await saveSolutionsAction(draft)).at))
          }
          disabled={pending || !dirty}
        >
          Save changes
        </Btn>
      </div>

      <ContentEditor
        value={draft as never}
        shape={defaultSolutions}
        assist={assist}
        onChange={(next) => setDraft(next as unknown as SolutionsContent)}
      />
    </div>
  );
}
