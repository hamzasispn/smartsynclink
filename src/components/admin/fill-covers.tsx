"use client";

import { useState, useTransition } from "react";
import { fillCoversAction } from "@/app/admin/actions";
import { Btn } from "./ui";

/**
 * Catches older posts up with cover photographs.
 *
 * New posts get one as they are written, so this is only ever needed after the
 * Pexels key is added — everything written before it has a grey placeholder,
 * and the key lives on the server, not on anyone's laptop.
 */
export function FillCovers() {
  const [pending, start] = useTransition();
  const [said, setSaid] = useState<string | null>(null);

  return (
    <span className="flex items-center gap-3">
      {said ? <span className="text-[13px] text-muted">{said}</span> : null}
      <Btn
        variant="outline"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const result = await fillCoversAction();
            setSaid(
              !result.ok
                ? result.error
                : result.total === 0
                  ? "Every post already has one."
                  : `Added ${result.filled} of ${result.total}.`,
            );
          })
        }
      >
        {pending ? "Fetching…" : "Fetch missing covers"}
      </Btn>
    </span>
  );
}
