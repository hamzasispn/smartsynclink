"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  discardDraftAction,
  loadBuilderAction,
  publishAction,
  restoreVersionAction,
  saveDraftAction,
} from "@/app/admin/builder-actions";
import type { GlobalContent } from "@/content/global";
import type { Blocks, Layout } from "@/lib/builder/types";

/** Everything an edit can touch: the page's sections, the shared blocks, the header and footer. */
export type BuilderDoc = { layout: Layout; blocks: Blocks; global: GlobalContent };

type Loaded = Awaited<ReturnType<typeof loadBuilderAction>>;
export type SaveStatus = "loading" | "saving" | "unsaved" | "saved" | "error";

const SAVE_DELAY = 700;
// edits closer together than this are one undo step — a typed word, not a letter
const COALESCE_MS = 800;
const HISTORY_LIMIT = 60;

/**
 * The builder's document, its undo history and its autosave.
 *
 * The current document lives in a ref as well as state, so edits compose
 * without stale closures and history is pushed exactly once per edit (a state
 * updater with side effects would double-push under React's dev double-invoke).
 * Every change saves the draft after a short pause; `revision` bumps when a
 * save lands, which is the preview's cue to re-render.
 */
export function useBuilder(initialPage: string) {
  const [pageKey, setPageKeyState] = useState(initialPage);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [doc, setDoc] = useState<BuilderDoc | null>(null);
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [unpublished, setUnpublished] = useState(false);
  const [revision, setRevision] = useState(0);
  const [historySize, setHistorySize] = useState({ past: 0, future: 0 });
  const [error, setError] = useState<string | null>(null);

  const docRef = useRef<BuilderDoc | null>(null);
  const past = useRef<BuilderDoc[]>([]);
  const future = useRef<BuilderDoc[]>([]);
  const lastEdit = useRef(0);
  const timer = useRef<number | null>(null);
  const pageRef = useRef(initialPage);

  const syncHistory = () => setHistorySize({ past: past.current.length, future: future.current.length });

  const saveNow = useCallback(async () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    const current = docRef.current;
    if (!current) return;
    setStatus("saving");
    try {
      await saveDraftAction(pageRef.current, current);
      setStatus("saved");
      setUnpublished(true);
      setRevision((r) => r + 1);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Saving failed");
    }
  }, []);

  const scheduleSave = useCallback(() => {
    setStatus("unsaved");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void saveNow(), SAVE_DELAY);
  }, [saveNow]);

  const replace = useCallback((next: BuilderDoc) => {
    docRef.current = next;
    setDoc(next);
  }, []);

  // load a page
  useEffect(() => {
    // status is set to loading by switchPage (and starts there), not here
    let cancelled = false;
    loadBuilderAction(pageKey)
      .then((result) => {
        if (cancelled) return;
        setLoaded(result);
        replace({ layout: result.layout, blocks: result.blocks, global: result.global });
        past.current = [];
        future.current = [];
        syncHistory();
        setUnpublished(result.dirty);
        setStatus("saved");
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "Could not load the page");
      });
    return () => {
      cancelled = true;
    };
  }, [pageKey, replace]);

  // a pending save must not be lost to a closed tab
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (timer.current) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  /** Applies an edit to a copy of the document. `coalesce` merges rapid edits into one undo step. */
  const edit = useCallback(
    (mutate: (draft: BuilderDoc) => void, coalesce = false) => {
      const current = docRef.current;
      if (!current) return;
      const next = structuredClone(current);
      mutate(next);

      const now = Date.now();
      if (!(coalesce && now - lastEdit.current < COALESCE_MS)) {
        past.current.push(current);
        if (past.current.length > HISTORY_LIMIT) past.current.shift();
      }
      lastEdit.current = coalesce ? now : 0;
      future.current = [];
      syncHistory();
      replace(next);
      scheduleSave();
    },
    [replace, scheduleSave],
  );

  const undo = useCallback(() => {
    const previous = past.current.pop();
    if (!previous || !docRef.current) return;
    future.current.push(docRef.current);
    lastEdit.current = 0;
    syncHistory();
    replace(previous);
    scheduleSave();
  }, [replace, scheduleSave]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next || !docRef.current) return;
    past.current.push(docRef.current);
    lastEdit.current = 0;
    syncHistory();
    replace(next);
    scheduleSave();
  }, [replace, scheduleSave]);

  const switchPage = useCallback(
    async (key: string) => {
      if (key === pageRef.current) return;
      if (timer.current) await saveNow();
      pageRef.current = key;
      setStatus("loading");
      setPageKeyState(key);
      const url = new URL(window.location.href);
      url.searchParams.set("page", key);
      window.history.replaceState(null, "", url);
    },
    [saveNow],
  );

  const publish = useCallback(async () => {
    if (timer.current || status === "unsaved") await saveNow();
    setStatus("saving");
    try {
      await publishAction(pageRef.current);
      setUnpublished(false);
      setStatus("saved");
      return true;
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Publishing failed");
      return false;
    }
  }, [saveNow, status]);

  const applyState = useCallback(
    (state: Awaited<ReturnType<typeof discardDraftAction>>) => {
      replace({ layout: state.layout, blocks: state.blocks, global: state.global });
      past.current = [];
      future.current = [];
      syncHistory();
      setUnpublished(state.dirty);
      setRevision((r) => r + 1);
      setStatus("saved");
    },
    [replace],
  );

  const discard = useCallback(async () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    applyState(await discardDraftAction(pageRef.current));
  }, [applyState]);

  const restore = useCallback(
    async (at: string) => {
      if (timer.current) await saveNow();
      applyState(await restoreVersionAction(pageRef.current, at));
      setUnpublished(true);
    },
    [applyState, saveNow],
  );

  return {
    pageKey,
    switchPage,
    loaded,
    doc,
    edit,
    undo,
    redo,
    canUndo: historySize.past > 0,
    canRedo: historySize.future > 0,
    status,
    error,
    unpublished,
    revision,
    publish,
    discard,
    restore,
  };
}
