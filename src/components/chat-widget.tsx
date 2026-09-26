"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

/** After the page has loaded, a beat so it never competes with first paint. */
const AFTER_LOAD_MS = 1500;
/** And never later than this, however long `load` takes to fire. */
const AT_THE_LATEST_MS = 5000;

/**
 * The LeadConnector chat bot. Only the loader script is ours to add: it builds
 * the <chat-widget> element and its bubble itself.
 *
 * It waits for the page to load (or AT_THE_LATEST_MS, whichever comes first)
 * rather than using next/script's lazyOnload. lazyOnload waits on
 * requestIdleCallback, which Safari does not have; Next's stand-in fired about
 * twenty seconds late on an iPhone, so there the bubble looked gone. The CMS
 * and the builder's preview iframe skip it.
 *
 * Nothing on the page opens it by hand — the assistant orb hands people to the
 * voice agent instead (#demo, see DemoModal), and this keeps its own bubble.
 */
export function ChatWidget() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    const go = () => setReady(true);
    const afterLoad = () => timers.push(window.setTimeout(go, AFTER_LOAD_MS));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    timers.push(window.setTimeout(go, AT_THE_LATEST_MS));
    return () => {
      window.removeEventListener("load", afterLoad);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/builder-preview")) return null;
  if (!ready) return null;

  return (
    <Script
      id="lc-chat-widget"
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="69f8acd4bde5e8ad6251260b"
      data-source="WEBSITE"
      strategy="afterInteractive"
    />
  );
}
