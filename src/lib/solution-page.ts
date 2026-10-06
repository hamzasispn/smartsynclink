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
 * The rest of the article is cut at its "## " headings into sections, and each
 * section is given a kind from what it is made of, which decides its design:
 * "### " features become a bento grid, a table a comparison, an ordered list a
 * timeline, quotes chat bubbles, "**Lead.** text" paragraphs industry cards,
 * and so on — see `pageSections`. An editor writes plain Markdown; the layout
 * follows from it.
 *
 * Only package imports (no "@/" aliases), so `node scripts/check-solution-page.ts` can run it.
 */
import { marked, type Token, type Tokens } from "marked";

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
  /** comma-separated phrases painted in the brand gradient in headings, beside the solution's name */
  highlight?: string;
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

/**
 * A heading cut around the phrases to paint: the solution's own name, and the
 * page's `highlight:` phrases for headings that say it another way ("The AI
 * Receptionist That…"). Any case, whole words, the longest phrase first.
 */
export function highlightParts(text: string, terms: string[]): { text: string; hit: boolean }[] {
  const list = [...new Set(terms.map((t) => t.trim()).filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!list.length) return [{ text, hit: false }];
  const escaped = list.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const lower = list.map((t) => t.toLowerCase());
  return text
    .split(new RegExp(`(?<!\\w)(${escaped.join("|")})(?!\\w)`, "gi"))
    .filter(Boolean)
    .map((part) => ({ text: part, hit: lower.includes(part.toLowerCase()) }));
}

/* -------------------------------------------------------------- sections -- */

export type Item = { title: string; body: string; quote?: string; href?: string };
export type Chat = { label: string; lines: { who: string; text: string }[] };
export type SectionKind = "features" | "steps" | "compare" | "chats" | "cards" | "links" | "list" | "prose";
export type Section = {
  id: string;
  title: string;
  kind: SectionKind;
  /** Markdown before and after the part that sets the kind. */
  intro: string;
  outro: string;
  items: Item[];
  chats: Chat[];
  table?: { head: string[]; rows: string[][] };
};

export const anchor = (text: string) =>
  plain(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

// blank lines between blocks: the lexer leaves them in the space tokens dropped above
const join = (tokens: Token[]) => tokens.map((t) => t.raw.trim()).join("\n\n");
const unquote = (text: string) => text.trim().replace(/^["“]|["”]$/g, "");

/** "**Lead.** the rest" → { title: "Lead", body: "the rest" }; a link in the lead becomes href. */
function lead(text: string): Item | null {
  const m = text.trim().match(/^\*\*(.+?)\*\*([\s\S]*)$/);
  if (!m) return null;
  const link = m[1].match(/^\[([^\]]+)\]\(([^)]+)\)\.?$/);
  return {
    title: (link ? link[1] : m[1]).replace(/[.:]\s*$/, "").trim(),
    // "**Phone calls**, with recordings" reads "with recordings" under its title
    body: m[2].replace(/^\s*[.,:;]/, "").trim(),
    href: link?.[2],
  };
}

const isParagraph = (t: Token): t is Tokens.Paragraph => t.type === "paragraph";

/** Cuts an article into its "## " sections and decides how each one is drawn. */
export function pageSections(markdown: string): Section[] {
  const blocks = (markdown ?? "").split(/^##\s+/m).slice(1);
  return blocks.map((block) => {
    const [heading, ...rest] = block.split("\n");
    const tokens = marked.lexer(rest.join("\n")).filter((t) => t.type !== "space");
    const section: Section = {
      id: anchor(heading),
      title: plain(heading),
      kind: "prose",
      intro: join(tokens),
      outro: "",
      items: [],
      chats: [],
    };
    const around = (i: number) => ({ intro: join(tokens.slice(0, i)), outro: join(tokens.slice(i + 1)) });

    // "### " features: a bento grid, or a timeline when they are numbered
    const h3 = tokens.flatMap((t, i) => (t.type === "heading" && (t as Tokens.Heading).depth === 3 ? [i] : []));
    if (h3.length >= 2) {
      const last = h3[h3.length - 1];
      section.items = h3.map((start, n) => {
        // the last feature keeps its first paragraph; anything after it closes the section
        const body = start === last ? tokens.slice(start + 1, start + 2) : tokens.slice(start + 1, h3[n + 1]);
        return { title: plain((tokens[start] as Tokens.Heading).text), body: join(body) };
      });
      const numbered = section.items.every((item) => /^\d+\.\s/.test(item.title));
      if (numbered) section.items.forEach((item) => (item.title = item.title.replace(/^\d+\.\s*/, "")));
      return {
        ...section,
        kind: numbered ? "steps" : "features",
        intro: join(tokens.slice(0, h3[0])),
        outro: join(tokens.slice(last + 2)),
      };
    }

    const table = tokens.findIndex((t) => t.type === "table");
    if (table >= 0) {
      const t = tokens[table] as Tokens.Table;
      return {
        ...section,
        kind: "compare",
        ...around(table),
        table: { head: t.header.map((c) => plain(c.text)), rows: t.rows.map((r) => r.map((c) => plain(c.text))) },
      };
    }

    const ordered = tokens.findIndex(
      (t) => t.type === "list" && (t as Tokens.List).ordered && (t as Tokens.List).items.length >= 3,
    );
    if (ordered >= 0) {
      section.items = (tokens[ordered] as Tokens.List).items.map((li) => {
        const text = li.tokens.find((t) => t.type === "paragraph" || t.type === "text") as Tokens.Text | undefined;
        const quote = li.tokens.find((t) => t.type === "blockquote") as Tokens.Blockquote | undefined;
        const raw = text?.text ?? li.text;
        return { ...(lead(raw) ?? { title: "", body: raw }), quote: quote ? unquote(plain(quote.text)) : undefined };
      });
      return { ...section, kind: "steps", ...around(ordered) };
    }

    // sample conversations and texts: a bold label, then the quote
    if (tokens.some((t) => t.type === "blockquote")) {
      const intro: Token[] = [];
      const outro: Token[] = [];
      let label = "";
      for (const t of tokens) {
        if (t.type === "blockquote") {
          const lines = (t as Tokens.Blockquote).tokens.filter(isParagraph).map((p) => {
            const said = p.text.match(/^\*\*([^*]+?):\*\*\s*([\s\S]*)$/);
            return said ? { who: said[1].trim(), text: plain(said[2]) } : { who: "", text: unquote(plain(p.text)) };
          });
          section.chats.push({ label, lines });
          label = "";
        } else if (isParagraph(t) && /^\*\*[^*]+\*\*$/.test(t.text.trim())) {
          label = plain(t.text).replace(/[.:]\s*$/, "");
        } else (section.chats.length ? outro : intro).push(t);
      }
      return { ...section, kind: "chats", intro: join(intro), outro: join(outro) };
    }

    // "**Contractors and home services.** …" paragraphs
    const leads = tokens.filter((t) => isParagraph(t) && lead(t.text)?.body);
    if (leads.length >= 3) {
      return {
        ...section,
        kind: "cards",
        items: leads.map((t) => lead((t as Tokens.Paragraph).text)!),
        intro: join(tokens.slice(0, tokens.indexOf(leads[0]))),
        outro: join(tokens.slice(tokens.indexOf(leads[leads.length - 1]) + 1)),
      };
    }

    const list = tokens.findIndex((t) => t.type === "list" && (t as Tokens.List).items.length >= 2);
    if (list >= 0) {
      section.items = (tokens[list] as Tokens.List).items.map((li) => lead(li.text) ?? { title: "", body: li.text.trim() });
      return { ...section, kind: section.items.every((item) => item.href) ? "links" : "list", ...around(list) };
    }

    return section;
  });
}
