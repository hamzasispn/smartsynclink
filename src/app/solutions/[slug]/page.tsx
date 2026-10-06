import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Prose } from "@/components/prose";
import { Badge, Button, Chevron, Container, Media } from "@/components/ui";
import { getGlobalContent } from "@/lib/content";
import { getService, listServices, type Service } from "@/lib/services";
import { frontMatter, plain, splitFaq } from "@/lib/solution-page";
import { tableOfContents } from "@/lib/toc";

export const revalidate = 60;

const SITE = "https://smartsynclink.com";

/** Every solution page ends on these two: a demo call (opens the calendar) and the plans. */
const DEMO = { label: "Book a Live Demo", href: "#call" };
const PLANS = { label: "See Plans", href: "/pricing-table" };

export async function generateStaticParams() {
  // A build must not die because the database is unreachable — an empty list
  // just means nothing is prerendered, and the pages still render on demand.
  try {
    return (await listServices()).map((s) => ({ slug: s.slug }));
  } catch (error) {
    console.error("generateStaticParams: skipping prerender:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  const { seo } = frontMatter(service.body);
  return {
    title: seo.title || `${service.title} — SmartSyncLink`,
    description: seo.description || service.excerpt,
    keywords: seo.keywords,
    alternates: { canonical: `/solutions/${service.slug}` },
  };
}

/**
 * One page per solution in the Solutions menu, written for search: the story,
 * how it works, a comparison, an FAQ, links to the other solutions, and the
 * demo and plans calls to action. The content is a service in the dashboard
 * (Services); see lib/solution-page for the settings block and FAQ conventions.
 */
export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [global, service, all] = await Promise.all([getGlobalContent(), getService(slug), listServices()]);
  if (!service || !service.published) notFound();

  const { seo, markdown } = frontMatter(service.body);
  const faq = splitFaq(markdown);
  const toc = [
    ...tableOfContents(faq.article).filter((item) => item.level === 2),
    ...(faq.items.length ? [{ id: "faq", text: faq.title }] : []),
  ];

  // the solutions this page names in its settings, else the first three
  const named = (seo.related ?? "")
    .split(",")
    .map((s) => all.find((other) => other.slug === s.trim() && other.slug !== service.slug))
    .filter((s): s is Service => Boolean(s));
  const others = named.length ? named : all.filter((s) => s.slug !== service.slug).slice(0, 3);

  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        serviceType: service.title,
        description: seo.description || service.excerpt,
        url: `${SITE}/solutions/${service.slug}`,
        areaServed: { "@type": "Country", name: "United States" },
        provider: { "@type": "Organization", name: "SmartSyncLink", url: SITE },
      },
      ...(faq.items.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.items.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: plain(a) },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main>
        <section className="bg-page pt-36 pb-14 md:pt-44 md:pb-20">
          <Container>
            {service.image ? (
              <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <Badge>{service.title}</Badge>
                  <h1 className="mt-5 max-w-[20ch] text-balance text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[52px]">
                    {seo.heading || service.title}
                  </h1>
                  {service.excerpt ? (
                    <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.7] text-[#1E1E1E]">{service.excerpt}</p>
                  ) : null}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button cta={DEMO} className="px-8" />
                    <Button cta={PLANS} variant="outline" />
                  </div>
                </div>
                <Media
                  image={{ src: service.image, alt: service.title }}
                  variant="plain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="aspect-[4/3] w-full rounded-[22px]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <Badge>{service.title}</Badge>
                <h1 className="mt-6 max-w-[22ch] text-balance text-[34px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[56px]">
                  {seo.heading || service.title}
                </h1>
                {service.excerpt ? (
                  <p className="mt-6 max-w-[64ch] text-pretty text-[16px] leading-[1.7] text-[#1E1E1E] sm:text-[17px]">
                    {service.excerpt}
                  </p>
                ) : null}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button cta={DEMO} className="px-8" />
                  <Button cta={PLANS} variant="outline" />
                </div>
              </div>
            )}
          </Container>
        </section>

        <section className="py-14 md:py-20">
          <Container>
            <div className={`grid gap-12 ${toc.length > 2 ? "lg:grid-cols-[minmax(0,1fr)_260px]" : ""}`}>
              <article className="solution-article max-w-[72ch] min-w-0">
                <Prose markdown={faq.article} />

                {faq.items.length ? (
                  <section id="faq" className="mt-14 scroll-mt-[120px]">
                    <h2 className="text-[24px] font-medium tracking-[-0.02em] text-ink">{faq.title}</h2>
                    <div className="mt-4 border-t border-line">
                      {faq.items.map((item) => (
                        <details key={item.q} className="group border-b border-line">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium leading-snug text-ink transition-colors hover:text-brand sm:text-[18px]">
                            {item.q}
                            <Chevron className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:-rotate-180" />
                          </summary>
                          <div className="pb-6">
                            <Prose markdown={item.a} />
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                ) : null}
              </article>

              {toc.length > 2 ? (
                <aside className="hidden lg:block">
                  <nav aria-label="On this page" className="sticky top-28 rounded-2xl border border-line p-5">
                    <p className="text-[13px] font-medium tracking-[0.12em] text-muted uppercase">On this page</p>
                    <ol className="mt-3 space-y-2">
                      {toc.map((item) => (
                        <li key={item.id}>
                          <a href={`#${item.id}`} className="text-[14px] leading-snug text-[#1E1E1E] hover:text-brand">
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </aside>
              ) : null}
            </div>
          </Container>
        </section>

        {others.length ? (
          <section className="bg-page py-14 md:py-20">
            <Container>
              <h2 className="text-[28px] font-medium tracking-[-0.02em] text-ink sm:text-[34px]">Works with</h2>
              <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/solutions/${other.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-[border-color,box-shadow] hover:border-brand/40 hover:shadow-card"
                    >
                      <span className="text-[18px] font-medium tracking-[-0.01em] text-ink">{other.title}</span>
                      {other.excerpt ? (
                        <span className="mt-2 line-clamp-3 text-[15px] leading-[1.6] text-muted">{other.excerpt}</span>
                      ) : null}
                      <span className="mt-auto pt-5 text-[15px] font-medium text-brand">Learn more →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        <section className="py-14 md:py-20">
          <Container>
            <div className="relative overflow-hidden rounded-[28px] bg-[#0E0E14] px-6 py-12 text-center text-white sm:px-12 md:py-16">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(51,0,234,0.55),transparent)]"
              />
              <h2 className="relative mx-auto max-w-[22ch] text-balance text-[30px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
                {seo.cta_heading || `See ${service.title} working on your business`}
              </h2>
              <p className="relative mx-auto mt-4 max-w-[56ch] text-pretty text-[16px] leading-[1.7] text-white/70">
                {seo.cta_text || "A short live demo on your own calls and leads, or pick a plan and start today."}
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                <Button cta={DEMO} variant="white" className="px-8" />
                <Button cta={PLANS} variant="ghost-light" className="text-white/80 hover:text-white" />
              </div>
              {seo.cta_note ? (
                <p
                  className="relative mt-6 text-[15px] text-white/60 [&_a]:font-medium [&_a]:whitespace-nowrap [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4"
                  dangerouslySetInnerHTML={{ __html: marked.parseInline(seo.cta_note, { async: false }) as string }}
                />
              ) : null}
            </div>
          </Container>
        </section>
      </main>

      <Footer brand={global.brand} data={global.footer} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
