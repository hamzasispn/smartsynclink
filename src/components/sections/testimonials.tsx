import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { Container, Placeholder, Stars } from "../ui";

export function Testimonials({ data }: { data: HomeContent["testimonials"] }) {
  return (
    <section id="reviews" className="py-24 lg:py-28">
      <Container>
        <Reveal
          className="grid gap-12 lg:grid-cols-12 lg:gap-10"
          stagger={0.14}
        >
          <div className="lg:col-span-4 border-r-[0.6px] border-black/25 border-solid lg:pr-10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {data.avatars.map((avatar) => (
                  <Placeholder
                    key={avatar}
                    label=""
                    variant="plain"
                    className="size-6 rounded-full ring-2 ring-white"
                  />
                ))}
              </div>
              <span className="text-[14px] font-medium uppercase  text-[#1e1e1e]">
                {data.eyebrow}
              </span>
            </div>

            <h2 className="mt-6 text-[40px] font-medium leading-[112%] tracking-[-0.02em] text-ink">
              {data.heading}
            </h2>
            <p className="mt-4 max-w-[42ch] text-[16px] leading-[1.75] text-[#1e1e1e]">
              {data.subheading}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {data.reviews.map((review) => (
              <figure
                key={review.author}
                className="flex flex-col rounded-[18px] bg-white p-7 shadow-card"
              >
                <Stars count={review.rating} />
                <blockquote className="mt-4 flex-1 text-[16px] leading-[1.8] text-[#1e1e1e]">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-[20px] font-medium text-black">
                  - {review.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
