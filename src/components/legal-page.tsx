import type { LegalDoc } from "@/content/legal";
import { tableOfContents } from "@/lib/toc";
import { TableOfContents } from "./blog/toc";
import { Prose } from "./prose";
import { Badge } from "./ui";

/**
 * The layout both legal documents share: a left-aligned title block, the
 * policy on a white sheet, and the contents card following the reader down.
 *
 * Built from the blog article's parts — Prose stamps the heading anchors and
 * TableOfContents links to them — so a policy reads like the rest of the site
 * and a heading added in the admin shows up in the contents automatically.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const toc = tableOfContents(doc.body);

  return (
    <main className="pb-24">
      <section className="mx-auto w-full max-w-[1200px] px-5 pt-[168px]">
        <Badge>{doc.badge}</Badge>
        <h1 className="mt-6 max-w-[20ch] text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[60px]">
          {doc.title}
        </h1>
        <p className="mt-4 text-[15px] text-muted">{doc.updated}</p>
        {doc.intro ? (
          <p className="mt-6 max-w-[80ch] text-[18px] leading-[1.7] text-[#1E1E1E]">{doc.intro}</p>
        ) : null}
      </section>

      <div className="mx-auto mt-12 grid w-full max-w-[1200px] gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 rounded-[20px] border border-line bg-white p-6 sm:p-10">
          <Prose markdown={doc.body} />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <TableOfContents items={toc} label={doc.tocLabel} numbered={false} />
          </div>
        </aside>
      </div>
    </main>
  );
}
