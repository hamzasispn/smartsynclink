/**
 * What a solution page reads out of its Markdown body, beyond the article:
 *
 *   ---
 *   title: AI Voice Agent for Small Business | SmartSyncLink
 *   description: An AI receptionist that answers every call…
 *   keywords: ai receptionist, ai phone answering
 *   heading: The AI Receptionist That Answers Every Call
 *   related: missed-call-text-back, ai-conversation-assistant
 *   cta_heading: Stop sending callers to your competitors
 *   cta_text: In a 20-minute demo we'll…
 *   cta_note: Or call [+1 737 252-4262](tel:+17372524262).
 *   ---
 *
 * at the very top sets the page's Google title, description and keywords, its
 * h1, the solutions linked at the foot and the closing call to action. A
 * "## FAQ" section of "### question" + answer pairs becomes an accordion and
 * FAQ markup for Google. All optional; plain Markdown renders as it always has.
 *
 * No imports, so `node scripts/check-solution-page.ts` can run it.
 */

export type SeoBlock = {
  title?: string;
  description?: string;
  keywords?: string;
  heading?: string;
  /** comma-separated slugs */
  related?: string;
  cta_heading?: string;
  cta_text?: string;
  /** inline Markdown, so a phone number can be a tel: link */
  cta_note?: string;
};

/** Splits the optional `---` block off the top of a body. */
export function frontMatter(body: string): { seo: SeoBlock; markdown: string } {
  const match = (body ?? "").match(/^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) return { seo: {}, markdown: body ?? "" };
  const seo: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^\s*([A-Za-z_-]+)\s*:\s*(.*?)\s*$/);
    if (pair) seo[pair[1].toLowerCase().replace(/^seo[_-]/, "")] = pair[2].replace(/^["']|["']$/g, "");
  }
  return { seo, markdown: body.slice(match[0].length) };
}

/** Markdown inline marks and links down to their words, for structured data. */
export const plain = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Lifts the "## FAQ" (or "## Frequently Asked Questions") section out of the
 * article. Answers stay Markdown; the questions are plain text. A section with
 * no "### question" in it is left in the article untouched.
 */
export function splitFaq(markdown: string): { article: string; title: string; items: { q: string; a: string }[] } {
  const lines = (markdown ?? "").split(/\r?\n/);
  const start = lines.findIndex((line) => /^##\s+(faq|faqs|frequently asked questions)\b/i.test(line));
  const none = { article: markdown ?? "", title: "", items: [] };
  if (start < 0) return none;
  const next = lines.findIndex((line, i) => i > start && /^##\s/.test(line));
  const end = next < 0 ? lines.length : next;
  const items = lines
    .slice(start + 1, end)
    .join("\n")
    .split(/^###\s+/m)
    .slice(1)
    .map((block) => {
      const [question, ...answer] = block.split("\n");
      return { q: plain(question), a: answer.join("\n").trim() };
    })
    .filter((pair) => pair.q && pair.a);
  if (!items.length) return none;
  return {
    article: [...lines.slice(0, start), ...lines.slice(end)].join("\n"),
    title: lines[start].replace(/^##\s+/, "").trim(),
    items,
  };
}
