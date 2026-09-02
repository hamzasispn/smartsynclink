import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Prose } from "@/components/prose";
import { Container, Media } from "@/components/ui";
import { getGlobalContent } from "@/lib/content";
import { getService, listServices } from "@/lib/services";

export const revalidate = 60;

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = await getService((await params).slug);
  if (!service) return {};
  return { title: `${service.title} — SmartSyncLink`, description: service.excerpt };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [global, service] = await Promise.all([getGlobalContent(), getService(slug)]);
  if (!service || !service.published) notFound();

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pt-40 pb-24">
        <Container>
          <Link href="/services" className="text-[16px] text-muted hover:text-brand">
            ← All services
          </Link>

          <h1 className="mt-6 max-w-[20ch] text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1e1e1e]">
            {service.title}
          </h1>
          {service.excerpt ? (
            <p className="mt-4 max-w-[65ch] text-[16px] leading-[1.75] text-[#1e1e1e]">
              {service.excerpt}
            </p>
          ) : null}

          {service.image ? (
            <Media
              image={{ src: service.image, alt: service.title }}
              variant="plain"
              sizes="(max-width: 1024px) 100vw, 900px"
              className="mt-10 aspect-[21/9] w-full rounded-[22px]"
            />
          ) : null}

          <article className="mt-12 max-w-[70ch]">
            <Prose markdown={service.body} />
          </article>
        </Container>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
