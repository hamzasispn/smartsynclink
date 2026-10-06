import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SolutionArt } from "@/components/solution/art";
import { Icon, iconFor } from "@/components/solution/icons";
import { Eyebrow, SolutionFaq, SolutionSection } from "@/components/solution/sections";
import { Button, Container, Media } from "@/components/ui";
import { getGlobalContent } from "@/lib/content";
import { getService, listServices, type Service } from "@/lib/services";
import { frontMatter, pageSections, plain, splitFaq } from "@/lib/solution-page";

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
 * One page per solution in the Solutions menu, written for search and laid out
 * as a landing page: a hero with the product drawn, then each "## " section of
 * the copy in the design that suits what it holds (see components/solution),
 * the FAQ, the solutions it works with, and the demo and plans calls to action.
 * The content is a service in the dashboard (Services); see lib/solution-page
 * for the settings block and the conventions the layout reads.
 */
export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [global, service, all] = await Promise.all([getGlobalContent(), getService(slug), listServices()]);
  if (!service || !service.published) notFound();

  const { seo, markdown } = frontMatter(service.body);
  const faq = splitFaq(markdown);
  const sections = pageSections(faq.article);
  // three of the page's own features, as proof points under the hero copy
  const proof = sections.find((s) => s.kind === "features")?.items.slice(0, 3).map((item) => item.title) ?? [];

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
        <section className="relative overflow-hidden bg-page pt-32 pb-16 md:pt-40 md:pb-24">
          <span aria-hidden="true" className="sol-hero-grid pointer-events-none absolute inset-0" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-48 -right-40 size-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(51,0,234,0.13),transparent)]"
          />
          <Container className="relative">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-14">
              <div>
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px] text-muted">
                  <Link href="/solutions" className="transition-colors hover:text-brand">
                    Solutions
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand/8 px-3 py-1 font-medium text-brand">
                    <Icon n={iconFor(service.title)} className="size-4" sw={2} />
                    {service.title}
                  </span>
                </nav>
                <h1 className="mt-6 text-balance text-[38px] font-medium leading-[1.05] tracking-[-0.035em] text-ink sm:text-[54px] xl:text-[60px]">
                  {seo.heading || service.title}
                </h1>
                {service.excerpt ? (
                  <p className="mt-6 max-w-[56ch] text-pretty text-[17px] leading-[1.65] text-[#1E1E1E]/80">{service.excerpt}</p>
                ) : null}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button cta={DEMO} className="px-8" />
                  <Button cta={PLANS} variant="outline" />
                </div>
                {proof.length ? (
                  <ul className="mt-9 grid gap-3">
                    {proof.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-[15.5px] text-ink">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white">
                          <Icon n="check" className="size-3.5" sw={3} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {service.image ? (
                <Media
                  image={{ src: service.image, alt: service.title }}
                  variant="plain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="aspect-[4/3] w-full rounded-[28px]"
                />
              ) : (
                <SolutionArt slug={service.slug} />
              )}
            </div>
          </Container>
        </section>

        {sections.map((section, i) => (
          <SolutionSection key={section.id} s={section} index={i} />
        ))}

        {faq.items.length ? <SolutionFaq title={faq.title} items={faq.items} demo={DEMO} /> : null}

        {others.length ? (
          <section className="bg-white py-16 md:py-24">
            <Container>
              <div className="flex flex-col items-center text-center">
                <Eyebrow>Keep exploring</Eyebrow>
                <h2 className="mt-5 text-[31px] font-medium tracking-[-0.03em] text-ink sm:text-[42px]">Works well with</h2>
              </div>
              <ul className="mt-12 grid gap-4 md:grid-cols-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/solutions/${other.slug}`}
                      className="group flex h-full flex-col rounded-[24px] border border-line bg-[#F8F8F9] p-7 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_20px_40px_-24px_rgba(51,0,234,0.4)]"
                    >
                      <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white">
                        <Icon n={iconFor(other.title)} className="size-[22px]" />
                      </span>
                      <span className="mt-6 text-[19px] font-medium tracking-[-0.01em] text-ink">{other.title}</span>
                      {other.excerpt ? (
                        <span className="mt-2 line-clamp-3 text-[15px] leading-[1.6] text-[#1E1E1E]/70">{other.excerpt}</span>
                      ) : null}
                      <span className="mt-auto flex items-center gap-1.5 pt-6 text-[15px] font-medium text-brand">
                        Learn more
                        <Icon n="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" sw={2} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        <section className="py-16 md:py-24">
          <Container>
            <div className="relative overflow-hidden rounded-[32px] bg-[#0E0E14] px-6 py-14 text-center text-white sm:px-12 md:py-20">
              <span aria-hidden="true" className="sol-art-grid pointer-events-none absolute inset-0 opacity-60" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(51,0,234,0.6),transparent)]"
              />
              <div className="relative">
                <Eyebrow dark>Live demo · 20 minutes</Eyebrow>
                <h2 className="mx-auto mt-6 max-w-[22ch] text-balance text-[32px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[48px]">
                  {seo.cta_heading || `See ${service.title} working on your business`}
                </h2>
                <p className="mx-auto mt-5 max-w-[58ch] text-pretty text-[16.5px] leading-[1.7] text-white/70">
                  {seo.cta_text || "A short live demo on your own calls and leads, or pick a plan and start today."}
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Button cta={DEMO} variant="white" className="px-8" />
                  <Button cta={PLANS} variant="ghost-light" className="text-white/80 hover:text-white" />
                </div>
                {seo.cta_note ? (
                  <p
                    className="mt-6 text-[15px] text-white/60 [&_a]:font-medium [&_a]:whitespace-nowrap [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4"
                    dangerouslySetInnerHTML={{ __html: marked.parseInline(seo.cta_note, { async: false }) as string }}
                  />
                ) : null}
              </div>
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
