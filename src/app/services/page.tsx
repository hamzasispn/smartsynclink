import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Container, Media } from "@/components/ui";
import { getGlobalContent } from "@/lib/content";
import { listServices } from "@/lib/services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services — SmartSyncLink",
  description: "What SmartSyncLink sets up and runs for your business.",
};

export default async function ServicesPage() {
  const [global, services] = await Promise.all([getGlobalContent(), listServices()]);

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pt-40 pb-24">
        <Container>
          <h1 className="max-w-[16ch] text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1e1e1e]">
            Services
          </h1>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.75] text-[#1e1e1e]">
            Everything we set up, connect and keep running for you.
          </p>

          {services.length ? (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-card transition-shadow hover:shadow-lift"
                >
                  <Media
                    image={{ src: service.image, alt: service.title }}
                    variant="plain"
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="aspect-4/3 w-full"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-[19px] font-medium tracking-[-0.02em] text-[#1e1e1e]">
                      {service.title}
                    </h2>
                    <p className="mt-2.5 text-[16px] leading-[1.7] text-[#1e1e1e]">
                      {service.excerpt}
                    </p>
                    <span className="mt-6 text-[16px] text-brand group-hover:underline">
                      Read more
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-14 rounded-2xl border border-dashed border-line px-6 py-16 text-center text-[16px] text-muted">
              Services are being written up. Check back shortly.
            </p>
          )}
        </Container>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
