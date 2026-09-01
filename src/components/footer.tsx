import type { GlobalContent } from "@/content/global";
import { Wordmark } from "./header";
import { Container, SocialIcon, Tick } from "./ui";

export default function Footer({
  brand,
  data,
}: {
  brand: GlobalContent["brand"];
  data: GlobalContent["footer"];
}) {
  return (
    <footer className="pb-10 pt-4">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Wordmark brand={brand} />
            <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.8] text-[#1e1e1e]">
              {data.about}
            </p>

            <ul className="mt-6 flex items-center gap-4">
              {data.socials.map((social) => (
                <li key={social}>
                  <a
                    href="#"
                    aria-label={social}
                    className="block text-ink transition-colors hover:text-brand"
                  >
                    <SocialIcon name={social} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>

            {/* ponytail: presentational only — wire to an endpoint when the admin panel lands */}
            <form className="mt-8 max-w-[380px] rounded-2xl bg-page p-6">
              <h3 className="text-[16px] font-medium leading-snug text-[#1e1e1e]">
                {data.newsletter.heading}
              </h3>
              <p className="mt-2 text-[16px] leading-[1.7] text-[#1e1e1e]">
                {data.newsletter.body}
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-white p-1 pl-4 focus-within:border-brand">
                <label htmlFor="newsletter-email" className="sr-only">
                  {data.newsletter.placeholder}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder={data.newsletter.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-[16px] text-[#1e1e1e] outline-none placeholder:text-muted"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-brand px-5 py-2 text-[16px] font-normal text-white transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  {data.newsletter.cta.label}
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {data.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-[16px] font-medium text-[#1e1e1e]">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[16px] text-[#1e1e1e] transition-colors hover:text-brand"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <ul className="mt-14 flex flex-wrap items-center gap-x-16 gap-y-3 text-[16px] text-[#1e1e1e]">
          <li>
            <span className="font-normal">Phone :</span>{" "}
            <a
              href={`tel:${data.contact.phone.replace(/[^+\d]/g, "")}`}
              className="hover:text-brand"
            >
              {data.contact.phone}
            </a>
          </li>
          <li>
            <span className="font-normal">WhatsApp :</span> {data.contact.whatsapp}
          </li>
          <li>
            <span className="font-normal">Email :</span>{" "}
            <a href={`mailto:${data.contact.email}`} className="hover:text-brand">
              {data.contact.email}
            </a>
          </li>
        </ul>

        <ul className="mt-8 grid divide-line rounded-xl border border-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {data.badges.map((badge) => (
            <li
              key={badge}
              className="flex items-center justify-center gap-2 px-4 py-3.5 text-[16px] font-normal text-[#1e1e1e]"
            >
              <Tick className="size-3.5 text-brand" />
              {badge}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-[16px] text-[#1e1e1e]">{data.copyright}</p>
      </Container>
    </footer>
  );
}
