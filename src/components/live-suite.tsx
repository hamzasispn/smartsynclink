"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import {
  LIVE_COUNT,
  REPLIES,
  STATIC_CHAT,
  SuiteDashboard,
  SuitePhone,
  SuitePhoneChat,
  type ChatState,
} from "./suite-mockup";

/**
 * The SmartSync Suite demo, running: the inbox walks through its threads, an
 * AI reply types itself into the composer, lands in the thread, and the unread
 * badge clears. A lap brings the badges back, so it loops forever.
 *
 * One cycle drives both the dashboard and the phone through context, so the
 * two screens always show the same conversation. It only runs while the stage
 * is on screen, and not at all under prefers-reduced-motion.
 *
 * The typed characters deliberately bypass React state. Pushing each letter
 * through state re-rendered the whole ~700-element dashboard some thirty times
 * a second (measured: ~300ms of script per second, long tasks up to 236ms).
 * Letters now go to a tiny store that only the composer text subscribes to, so
 * the dashboard renders when the phase changes — three times per reply.
 */

export const ChatContext = createContext<ChatState>(STATIC_CHAT);

type TypedStore = {
  get: () => string;
  set: (value: string) => void;
  subscribe: (listener: () => void) => () => void;
};

function createTypedStore(): TypedStore {
  let value = "";
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next) => {
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const TypedContext = createContext<TypedStore>(createTypedStore());

const HOLD_INCOMING = 1500;
const PER_CHARACTER = 34;
const BEFORE_SEND = 400;
const HOLD_SENT = 2800;

/**
 * @param startDelay wait this long after the stage comes into view before the
 * first message. The Suite stage opens on a website whose form is still being
 * filled in; the inbox answering that message before it is sent would give the
 * story away.
 */
export function useChatCycle(ref: RefObject<HTMLElement | null>, startDelay = 0) {
  const [chat, setChat] = useState<ChatState>(STATIC_CHAT);
  const [typed] = useState(createTypedStore);
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
      if (startDelay) {
        await wait(startDelay);
        if (cancelled) return;
      }
      while (!cancelled) {
        const i = index.current;
        const reply = REPLIES[i];

        typed.set("");
        setChat((c) => ({ ...c, active: i, phase: "incoming" }));
        await wait(HOLD_INCOMING);
        if (cancelled) return;

        setChat((c) => ({ ...c, phase: "typing" }));
        for (let n = 1; n <= reply.length; n++) {
          await wait(PER_CHARACTER);
          if (cancelled) return;
          typed.set(reply.slice(0, n));
        }
        await wait(BEFORE_SEND);
        if (cancelled) return;

        typed.set("");
        setChat((c) => ({
          ...c,
          phase: "sent",
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
  }, [inView, typed, startDelay]);

  return { chat, typed };
}

/** A standalone running cycle, for a phone shown on its own (mobile layouts). */
export function ChatCycle({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { chat, typed } = useChatCycle(ref);
  return (
    <div ref={ref} className={className}>
      <ChatContext.Provider value={chat}>
        <TypedContext.Provider value={typed}>{children}</TypedContext.Provider>
      </ChatContext.Provider>
    </div>
  );
}

/** Just the characters typed so far — the only thing that re-renders per letter. */
function TypedText() {
  const store = useContext(TypedContext);
  return <>{useSyncExternalStore(store.subscribe, store.get, () => "")}</>;
}

export function LiveDashboard() {
  return <SuiteDashboard chat={useContext(ChatContext)} typedSlot={<TypedText />} />;
}

export function LivePhone({ idPrefix, overlay }: { idPrefix: string; overlay?: ReactNode }) {
  return <SuitePhone idPrefix={idPrefix} chat={useContext(ChatContext)} overlay={overlay} />;
}

/** The phone with the conversation open, its reply typing into the message box. */
export function LivePhoneChat() {
  return <SuitePhoneChat chat={useContext(ChatContext)} typedSlot={<TypedText />} />;
}
