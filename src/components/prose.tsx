import { marked } from "marked";

/**
 * Renders Markdown written in the dashboard (by an editor or by the autopilot).
 *
 * The HTML is not sanitised because the input is not user-generated: only
 * signed-in dashboard users and our own Claude call can write these columns —
 * the same trust level as any CMS body field. If public submissions ever land
 * in `posts.body`, add a sanitiser here before it renders.
 */
export function Prose({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown ?? "", {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;

  return <div className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />;
}
