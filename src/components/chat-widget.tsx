"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * The LeadConnector chat bot. Only the loader script is ours to add: it builds
 * the <chat-widget> element and its bubble itself.
 *
 * lazyOnload waits until the page has finished loading and the browser is
 * idle, so the widget never competes with the first paint. The CMS and the
 * builder's preview iframe skip it.
 *
 * Nothing on the page opens it by hand — the assistant orb hands people to the
 * voice agent instead (#demo, see DemoModal), and this keeps its own bubble.
 */
export function ChatWidget() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/builder-preview")) return null;

  return (
    <Script
      id="lc-chat-widget"
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="69f8acd4bde5e8ad6251260b"
      data-source="WEBSITE"
      strategy="lazyOnload"
    />
  );
}
