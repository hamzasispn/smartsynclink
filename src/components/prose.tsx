import { marked } from "marked";
import { tableOfContents } from "@/lib/toc";

/**
 * Renders Markdown written in the dashboard (by an editor or by the autopilot).
 *
 * The HTML is not sanitised because the input is not user-generated: only
 * signed-in dashboard users and our own Claude call can write these columns —
 * the same trust level as any CMS body field. If public submissions ever land
 * in `posts.body`, add a sanitiser here before it renders.
 *
 * h2/h3 get the ids the table of contents links to. They are stamped on after
 * rendering, in document order, from the same list the sidebar is built from —
 * one slug function, so a link can never point at an anchor that isn't there.
 */
export function Prose({ markdown }: { markdown: string }) {
  let html = marked.parse(markdown ?? "", {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;

  const items = tableOfContents(markdown ?? "");
  let i = 0;
  html = html.replace(/<h([23])>/g, (tag, level) => {
    const item = items[i++];
    return item && String(item.level) === level ? `<h${level} id="${item.id}">` : tag;
  });

  return <div className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />;
}
