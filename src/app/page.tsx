import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  Bento,
  Faq,
  FinalCta,
  Hero,
  HeroVideo,
  Industries,
  Intro,
  Pricing,
  ShowcaseVideo,
  Steps,
  Testimonials,
} from "@/components/sections";
import { getHomeContent } from "@/lib/content";

// Admin panel can call revalidatePath("/") for instant updates.
export const revalidate = 60;

export default async function Home() {
  const c = await getHomeContent();

  return (
    <>
      {/* header sits on the hero backdrop, as in the design */}
      <div className="blueprint relative overflow-hidden">
        <Header brand={c.brand} nav={c.nav} />
        <Hero data={c.hero} />
        <HeroVideo data={c.heroVideo} />
      </div>

      <main>
        <Intro data={c.intro} />
        <Bento data={c.bento} />
        <Industries data={c.industries} />
        <Steps data={c.steps} />
        <Pricing data={c.pricing} />
        <ShowcaseVideo data={c.showcaseVideo} />
        <Testimonials data={c.testimonials} />
        <Faq data={c.faq} />
        <FinalCta data={c.finalCta} />
      </main>

      <Footer brand={c.brand} data={c.footer} />
    </>
  );
}
