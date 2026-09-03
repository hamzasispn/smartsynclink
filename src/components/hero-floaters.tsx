import Image from "next/image";

/**
 * Three floating cards behind the hero, one for each industry the site serves:
 * med spa, real estate, contractor.
 *
 * Two sizes, not one: at 1280 the gutter beside the clip is about 170px a
 * side, so full size cards there pushed into both the copy and the clip.
 * xl gets smaller ones nearer the edge, 2xl gets the full treatment.
 *
 * Shown from xl up, and no lower. Measured at 1024px they drift over the clip
 * and collide with the copy — the gutter beside a centred 700px video simply is
 * not there yet, and the honest answer at that width is to show none.
 *
 * All of them stay outside the middle column on purpose. The hero clip is
 * mix-blend-multiply, so anything under it would be multiplied too and the
 * blend would show as a dark smear.
 *
 * Decorative: aria-hidden throughout, alt is empty on purpose, CSS keyframes,
 * no JavaScript.
 */

const scenes = [
  {
    label: "Med spa",
    src: "/images/icons/facial.png",
    place: "left-[3%] top-[17%] 2xl:left-[9%] 2xl:top-[19%]",
    tilt: "-7deg",
  },
  {
    label: "Real estate",
    src: "/images/icons/search.png",
    place: "right-[3%] top-[26%] 2xl:right-[8%] 2xl:top-[27%]",
    tilt: "6deg",
  },
  {
    label: "Contractor",
    src: "/images/icons/engineer.png",
    place: "left-[5%] bottom-[22%] 2xl:left-[12%] 2xl:bottom-[23%]",
    tilt: "5deg",
  },
];

export function HeroFloaters() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-1 hidden xl:block"
    >
      {scenes.map((scene, i) => (
        <span
          key={scene.label}
          style={{ "--i": i, "--tilt": scene.tilt } as React.CSSProperties}
          className={`hero-float absolute grid size-20 place-items-center rounded-2xl border border-black/5 bg-white shadow-lift 2xl:size-28 2xl:rounded-3xl ${scene.place}`}
        >
          {/* width is the 2xl render size; Next serves 1x and 2x from it, so the
              112px card still gets a retina source without shipping the 512px
              original */}
          <Image
            src={scene.src}
            alt=""
            width={112}
            height={112}
            className="size-14 2xl:size-20"
          />
        </span>
      ))}
    </div>
  );
}
