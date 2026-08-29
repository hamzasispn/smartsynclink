import type { HomeContent } from "@/content/home";
import { PlayTarget } from "../ui";

export function HeroVideo({ data }: { data: HomeContent["heroVideo"] }) {
  return (
    <section>
        <a
          href="#demo"
          aria-label={`Play ${data.label}`}
          className="group relative flex aspect-21/9 items-center justify-center overflow-hidden bg-[#D9D9D9]"
        >
          <PlayTarget />
        </a>
    </section>
  );
}