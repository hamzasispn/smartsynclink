import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PointerFill } from "@/components/pointer-fill";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <PointerFill />
      </body>
    </html>
  );
}
