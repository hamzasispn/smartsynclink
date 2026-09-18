import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";
import { DemoModal } from "@/components/demo-modal";
import { Calendar } from "@/components/sections/calendar";
import { Loader } from "@/components/loader";
import { PointerFill } from "@/components/pointer-fill";
import { getHomeContent } from "@/lib/content";

// Inter variable: opsz 14→32, wght 100→900 (verified from the fvar table).
// opsz 32 IS the Display cut. globals.css pins the axis there for every
// element, so small text gets Display too — not just headings.
const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

export const metadata: Metadata = {
  title: "SmartSyncLink — Never Lose Another Lead Again",
  description:
    "AI answers calls, replies to messages, books appointments, and follows up automatically so your business closes more customers without hiring more staff.",
  other: {
    'facebook-domain-verification': 'kssgurfudqyqy0mt2vq0wctotfxy5d',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // mounted here rather than per page, so a #demo link works from anywhere
  const { demo, calendar } = await getHomeContent();

  return (
    <html lang="en">
      <body>
        {/* without JS the curtain would never lift, so it never goes up */}
        <noscript>
          <style>{`.site-loader{display:none!important}`}</style>
        </noscript>
        <Loader />
        {children}
        <DemoModal data={demo} />
        <Calendar data={calendar} />
        <PointerFill />
        <ChatWidget />

        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1063158049442681');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1063158049442681&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}