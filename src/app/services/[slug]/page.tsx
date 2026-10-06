import { permanentRedirect } from "next/navigation";

/**
 * Service pages moved to /solutions/[slug] — one page per item in the
 * Solutions menu, with SEO, FAQ markup and the demo call to action. Kept as a
 * permanent redirect so any link already out there still lands.
 */
export default async function ServiceRedirect({ params }: { params: Promise<{ slug: string }> }) {
  permanentRedirect(`/solutions/${(await params).slug}`);
}
