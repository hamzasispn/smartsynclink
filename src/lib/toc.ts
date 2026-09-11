/**
 * Headings out of a Markdown body, for the article's table of contents.
 *
 * Parsed from the Markdown rather than from the rendered HTML: the page is a
 * server component, there is no DOM to read, and the anchor ids have to be
 * decided in one place so the list and the headings agree.
 *
 * ponytail: regex, not a Markdown AST walk. Headings are line-anchored in
 * Markdown, and the only thing that can fake one is a fenced code block, which
 * the fence toggle below skips. Swap in the marked lexer if that stops holding.
 */
export type TocItem = { id: string; text: string; level: 2 | 3 };

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[`*_~[\]()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function tableOfContents(markdown: string): TocItem[] {
  const out: TocItem[] = [];
  const seen = new Map<string, number>();
  let fenced = false;

  for (const line of (markdown ?? "").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;

    const text = m[2].replace(/[*_`]/g, "").trim();
    const base = slugify(text);
    // two sections can share a name; the anchors cannot
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);

    out.push({ id: n > 1 ? `${base}-${n}` : base, text, level: m[1].length as 2 | 3 });
  }
  return out;
}
