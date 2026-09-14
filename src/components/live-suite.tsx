"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  LIVE_COUNT,
  REPLIES,
  STATIC_CHAT,
  SuiteDashboard,
  SuitePhone,
  type ChatState,
} from "./suite-mockup";

/**
 * The SmartSync Suite demo, running: the inbox walks through its threads, an
 * AI reply types itself into the composer, lands in the thread, and the unread
 * badge clears. A lap brings the badges back, so it loops forever.
 *
 * One cycle drives both the dashboard and the phone through context, so the
 * two screens always show the same conversation. It only runs while the stage
 * is on screen, and not at all under prefers-reduced-motion — the mockups then
 * stay on their static first thread.
 */

export const ChatContext = createContext<ChatState>(STATIC_CHAT);

const HOLD_INCOMING = 1500;
const PER_CHARACTER = 34;
const BEFORE_SEND = 400;
const HOLD_SENT = 2800;

export function useChatCycle(ref: RefObject<HTMLElement | null>) {
  const [chat, setChat] = useState<ChatState>(STATIC_CHAT);
  const [inView, setInView] = useState(false);
  // the thread to resume from when the stage scrolls back into view
  const index = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          resolve();
        }, ms);
        timers.add(t);
      });

    (async () => {
      while (!cancelled) {
        const i = index.current;
        const reply = REPLIES[i];

        setChat((c) => ({ ...c, active: i, phase: "incoming", typed: "" }));
        await wait(HOLD_INCOMING);
        if (cancelled) return;

        setChat((c) => ({ ...c, phase: "typing" }));
        for (let n = 1; n <= reply.length; n++) {
          await wait(PER_CHARACTER);
          if (cancelled) return;
          setChat((c) => ({ ...c, typed: reply.slice(0, n) }));
        }
        await wait(BEFORE_SEND);
        if (cancelled) return;

        setChat((c) => ({
          ...c,
          phase: "sent",
          typed: "",
          read: c.read.includes(i) ? c.read : [...c.read, i],
        }));
        await wait(HOLD_SENT);
        if (cancelled) return;

        index.current = (i + 1) % LIVE_COUNT;
        // a full lap: the unread badges come back so the loop never runs dry
        if (index.current === 0) setChat((c) => ({ ...c, read: [] }));
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [inView]);

  return chat;
}

/** A standalone running cycle, for a phone shown on its own (mobile layouts). */
export function ChatCycle({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const chat = useChatCycle(ref);
  return (
    <div ref={ref} className={className}>
      <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
    </div>
  );
}

export function LiveDashboard() {
  return <SuiteDashboard chat={useContext(ChatContext)} />;
}

export function LivePhone({ idPrefix }: { idPrefix: string }) {
  return <SuitePhone idPrefix={idPrefix} chat={useContext(ChatContext)} />;
}
