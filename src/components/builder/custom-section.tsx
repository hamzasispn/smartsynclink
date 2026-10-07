import type { ReactNode } from "react";
import type { Media as MediaValue } from "@/content/home";
import type { Column, CustomProps, Widget } from "@/lib/builder/widgets";
import { Prose } from "../prose";
import { Reveal } from "../reveal";
import { Icon, ICON_NAMES, type IconName } from "../solution/icons";
import { CheckRing, Chevron, Media, Placeholder, Star } from "../ui";

/**
 * A custom section: columns of widgets, styled from its settings.
 *
 * Server-rendered, plain markup — a custom section costs the live page nothing
 * but its HTML. Every class below is a literal string so Tailwind sees it.
 *
 * In the builder preview, editable text carries data-builder-field with its
 * path inside the section's props; the preview bridge turns those into inline
 * editors on double-click. On the live site the attribute is never written.
 */

const BG: Record<CustomProps["background"], string> = {
  none: "",
  page: "bg-page",
  surface: "bg-surface",
  soft: "bg-brand-soft",
  brand: "bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white",
  dark: "bg-ink text-white",
};
const PT: Record<CustomProps["paddingTop"], string> = { none: "pt-0", sm: "pt-10", md: "pt-16", lg: "pt-24", xl: "pt-32" };
const PB: Record<CustomProps["paddingBottom"], string> = { none: "pb-0", sm: "pb-10", md: "pb-16", lg: "pb-24", xl: "pb-32" };
const WIDTH: Record<CustomProps["width"], string> = {
  narrow: "mx-auto max-w-[760px] px-6",
  normal: "mx-auto max-w-382 px-6 lg:px-12",
  wide: "mx-auto max-w-[1600px] px-6 lg:px-10",
  full: "w-full",
};
const GAP: Record<CustomProps["gap"], string> = { sm: "gap-6", md: "gap-10", lg: "gap-16" };
const VALIGN: Record<CustomProps["verticalAlign"], string> = { start: "items-start", center: "items-center", end: "items-end" };
const SPAN: Record<Column["width"], string> = {
  "12": "lg:col-span-12",
  "9": "lg:col-span-9",
  "8": "lg:col-span-8",
  "6": "lg:col-span-6",
  "4": "lg:col-span-4",
  "3": "lg:col-span-3",
};
const ASPECT: Record<string, string> = {
  auto: "",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "9/16": "aspect-[9/16]",
};
const HEADING_SIZE: Record<string, string> = {
  display: "text-[40px] sm:text-[52px] lg:text-[64px]",
  xl: "text-[34px] sm:text-[44px] lg:text-[52px]",
  lg: "text-[30px] sm:text-[38px]",
  md: "text-[24px] sm:text-[28px]",
  sm: "text-[20px]",
};
const TEXT_SIZE: Record<string, string> = { lg: "[&_.prose-site]:text-[18px]", md: "", sm: "[&_.prose-site]:text-[14px]" };
const SPACER: Record<string, string> = { sm: "h-4", md: "h-10", lg: "h-16", xl: "h-24" };
const FEATURE_COLS: Record<string, string> = {
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};
// spans on a six-column grid that fill every row, by item count — the bento
const BENTO: Record<number, number[]> = {
  1: [6],
  2: [3, 3],
  3: [2, 2, 2],
  4: [4, 2, 2, 4],
  5: [4, 2, 2, 2, 2],
  6: [4, 2, 2, 4, 3, 3],
  7: [4, 2, 2, 2, 2, 2, 4],
  8: [4, 2, 2, 2, 2, 2, 2, 2],
};
const BENTO_SPAN: Record<number, string> = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4", 6: "lg:col-span-6" };
const STEP_COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };
const iconOf = (name: unknown): IconName => (ICON_NAMES.includes(name as IconName) ? (name as IconName) : "sparkle");
type Entry = Record<string, unknown>;

type Ctx = { preview: boolean; inverted: boolean; center: boolean };

/** Marks an editable text in the preview only. */
const field = (ctx: Ctx, path: string) => (ctx.preview ? { "data-builder-field": path } : {});

function ButtonLink({
  cta,
  variant,
  size,
  full,
  ctx,
  path,
}: {
  cta: { label: string; href: string };
  variant: string;
  size: string;
  full: boolean;
  ctx: Ctx;
  path: string;
}) {
  const skin =
    variant === "white"
      ? "bg-white text-ink"
      : variant === "outline"
        ? ctx.inverted
          ? "border border-white/60 text-white"
          : "border border-black/15 text-ink hover:border-ink/30"
        : "bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white";
  return (
    <a
      href={cta.href}
      data-fill=""
      style={{ "--fill": variant === "primary" ? "#6c31e9" : "var(--color-brand-soft)" } as React.CSSProperties}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 active:scale-[0.98] ${skin} ${
        size === "lg" ? "min-h-13 px-8 text-[17px]" : "min-h-11 px-6 text-[16px]"
      } ${full ? "w-full" : "w-fit"}`}
    >
      <span {...field(ctx, `${path}.cta.label`)}>{cta.label}</span>
    </a>
  );
}

function renderWidget(w: Widget, path: string, ctx: Ctx): ReactNode {
  const s = (key: string) => String(w[key] ?? "");
  switch (w.type) {
    case "heading": {
      const Tag = (["h1", "h2", "h3", "h4"].includes(s("level")) ? s("level") : "h2") as "h2";
      return (
        <div className={`flex flex-col ${ctx.center ? "items-center" : "items-start"}`}>
          {s("eyebrow") ? (
            <span
              className={`mb-5 inline-flex rounded-full px-[18px] py-2 text-[15px] font-medium ${ctx.inverted ? "bg-white/15 text-white" : "bg-black/4 text-black"}`}
              {...field(ctx, `${path}.eyebrow`)}
            >
              {s("eyebrow")}
            </span>
          ) : null}
          <Tag
            className={`max-w-[26ch] text-balance font-medium leading-[1.12] tracking-[-0.02em] ${HEADING_SIZE[s("size")] ?? HEADING_SIZE.lg} ${ctx.inverted ? "text-white" : "text-ink"}`}
            {...field(ctx, `${path}.text`)}
          >
            {s("text")}
          </Tag>
        </div>
      );
    }
    case "text":
      return (
        <div
          className={`${TEXT_SIZE[s("size")] ?? ""} ${s("tone") === "muted" ? "[&_.prose-site]:text-muted" : ""} ${
            ctx.inverted ? "[&_.prose-site]:text-white/85 [&_.prose-site_a]:text-white" : ""
          } ${ctx.center ? "mx-auto max-w-[68ch]" : "max-w-[72ch]"}`}
        >
          <Prose markdown={s("text")} />
        </div>
      );
    case "image": {
      const image = w.image as MediaValue;
      return (
        <Media
          image={image}
          variant="plain"
          fit={s("fit") === "contain" ? "contain" : "cover"}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`w-full ${ASPECT[s("aspect")] || "aspect-video"} ${w.rounded ? "rounded-[20px]" : ""} ${w.shadow ? "shadow-lift" : ""}`}
        />
      );
    }
    case "video": {
      const video = w.video as MediaValue;
      const shape = `w-full overflow-hidden ${ASPECT[s("aspect")] || "aspect-video"} ${w.rounded ? "rounded-[20px]" : ""}`;
      if (!video?.src) return <Placeholder label="Video — upload a clip or paste a link" className={shape} />;
      return (
        <div className={`${shape} bg-ink`}>
          <video
            src={video.src}
            aria-label={video.alt || undefined}
            className="size-full object-cover"
            playsInline
            preload="metadata"
            {...(w.autoplay ? { autoPlay: true, muted: true, loop: true } : {})}
            controls={Boolean(w.controls)}
          />
        </div>
      );
    }
    case "button":
      return (
        <ButtonLink
          cta={w.cta as { label: string; href: string }}
          variant={s("variant")}
          size={s("size")}
          full={Boolean(w.fullWidth)}
          ctx={ctx}
          path={path}
        />
      );
    case "list": {
      const items = (w.items as string[]) ?? [];
      const style = s("style");
      if (style === "check") {
        return (
          <ul className={`space-y-3 ${ctx.center ? "mx-auto w-fit text-left" : ""}`}>
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[16px] leading-snug">
                <CheckRing className={`mt-px size-[18px] shrink-0 ${ctx.inverted ? "text-white" : "text-brand"}`} />
                <span {...field(ctx, `${path}.items.${i}`)}>{item}</span>
              </li>
            ))}
          </ul>
        );
      }
      const Tag = style === "number" ? "ol" : "ul";
      return (
        <Tag className={`space-y-2 pl-5 text-[16px] leading-relaxed ${style === "number" ? "list-decimal" : "list-disc"} ${ctx.center ? "mx-auto w-fit text-left" : ""}`}>
          {items.map((item, i) => (
            <li key={i} {...field(ctx, `${path}.items.${i}`)}>
              {item}
            </li>
          ))}
        </Tag>
      );
    }
    case "card": {
      const image = w.image as MediaValue;
      const cta = w.cta as { label: string; href: string };
      const brand = s("style") === "brand";
      const cardCtx = { ...ctx, inverted: brand || ctx.inverted, center: false };
      return (
        <article
          className={`flex h-full flex-col overflow-hidden rounded-[22px] text-left ${
            brand
              ? "bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white"
              : s("style") === "outline"
                ? "border border-line bg-white"
                : "bg-surface"
          }`}
        >
          {image?.src ? (
            <Media image={image} variant="plain" sizes="(max-width: 1024px) 100vw, 33vw" className="aspect-video w-full" />
          ) : null}
          <div className="flex flex-1 flex-col p-6">
            <h3 className={`text-[20px] font-medium tracking-[-0.01em] ${brand ? "text-white" : "text-ink"}`} {...field(cardCtx, `${path}.title`)}>
              {s("title")}
            </h3>
            <div className={`mt-2 [&_.prose-site]:text-[15px] ${brand ? "[&_.prose-site]:text-white/85" : "[&_.prose-site]:text-muted"}`}>
              <Prose markdown={s("body")} />
            </div>
            {cta?.label ? (
              <div className="mt-auto pt-5">
                <ButtonLink cta={cta} variant={brand ? "white" : "outline"} size="md" full={false} ctx={cardCtx} path={path} />
              </div>
            ) : null}
          </div>
        </article>
      );
    }
    case "stat":
      return (
        <div>
          <p className={`text-[44px] font-medium leading-none tracking-[-0.03em] ${ctx.inverted ? "text-white" : "text-ink"}`} {...field(ctx, `${path}.value`)}>
            {s("value")}
          </p>
          <p className={`mt-2 text-[15px] ${ctx.inverted ? "text-white/75" : "text-muted"}`} {...field(ctx, `${path}.label`)}>
            {s("label")}
          </p>
        </div>
      );
    case "features": {
      const items = (w.items as Entry[]) ?? [];
      const style = s("style");
      const bento = style === "bento";
      const spans = BENTO[items.length] ?? items.map(() => 2);
      let featured = 0;
      return (
        <div className={`grid gap-4 text-left ${bento ? "md:grid-cols-2 lg:grid-cols-6" : FEATURE_COLS[s("columns")] ?? FEATURE_COLS["3"]}`}>
          {items.map((item, i) => {
            const big = bento && spans[i] >= 4;
            const look = big ? (featured++ % 2 ? "gradient" : "dark") : style;
            const light = !big && !ctx.inverted;
            const skin = {
              dark: "bg-[#0E0E14] text-white",
              gradient: "bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white",
              cards: ctx.inverted ? "bg-white/10 ring-1 ring-white/15" : "border border-line bg-white",
              bento: ctx.inverted ? "bg-white/10 ring-1 ring-white/15" : "border border-line bg-white",
              plain: "",
            }[look] ?? "";
            const odd = items.length % 2 === 1 && i === items.length - 1;
            return (
              <article
                key={i}
                className={`relative flex flex-col overflow-hidden rounded-[22px] ${look === "plain" ? "" : "p-6 sm:p-7"} ${skin} ${
                  bento ? `${BENTO_SPAN[spans[i]] ?? "lg:col-span-2"} ${odd ? "md:col-span-2" : ""} ${big ? "lg:min-h-[240px]" : ""}` : ""
                }`}
              >
                {big ? (
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-24 -right-16 size-72 rounded-full ${
                      look === "dark" ? "bg-[radial-gradient(closest-side,rgba(51,0,234,0.6),transparent)]" : "bg-white/10"
                    }`}
                  />
                ) : null}
                <span
                  className={`relative grid size-11 shrink-0 place-items-center rounded-xl ${
                    light ? "bg-brand-soft text-brand" : "bg-white/10 text-white ring-1 ring-white/15"
                  }`}
                >
                  <Icon n={iconOf(item.icon)} className="size-[22px]" />
                </span>
                <h3
                  className={`relative mt-5 text-[19px] font-medium leading-snug tracking-[-0.01em] ${big ? "sm:text-[23px]" : ""} ${light ? "text-ink" : "text-white"}`}
                  {...field(ctx, `${path}.items.${i}.title`)}
                >
                  {String(item.title ?? "")}
                </h3>
                <div className={`relative mt-2 [&_.prose-site]:text-[15px] [&_.prose-site]:leading-[1.6] ${light ? "[&_.prose-site]:text-muted" : "[&_.prose-site]:text-white/75"}`}>
                  <Prose markdown={String(item.text ?? "")} />
                </div>
              </article>
            );
          })}
        </div>
      );
    }
    case "steps": {
      const items = (w.items as Entry[]) ?? [];
      const number = `grid size-11 shrink-0 place-items-center rounded-full text-[16px] font-medium ${
        ctx.inverted ? "bg-white text-brand" : "bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white shadow-[0_10px_24px_-10px_rgba(51,0,234,0.7)]"
      }`;
      const card = ctx.inverted ? "bg-white/10 ring-1 ring-white/15" : "border border-line bg-white";
      if (s("layout") === "timeline") {
        return (
          <ol className="mx-auto w-full max-w-[720px] text-left">
            {items.map((item, i) => (
              <li key={i} className="relative flex gap-5 pb-6 last:pb-0">
                {i < items.length - 1 ? (
                  <span aria-hidden="true" className={`absolute top-11 bottom-0 left-[21px] w-px ${ctx.inverted ? "bg-white/25" : "bg-brand/20"}`} />
                ) : null}
                <span className={`relative ${number}`}>{i + 1}</span>
                <div className={`min-w-0 flex-1 rounded-[20px] px-5 py-4 ${card}`}>
                  <h3 className={`text-[17px] font-medium ${ctx.inverted ? "text-white" : "text-ink"}`} {...field(ctx, `${path}.items.${i}.title`)}>
                    {String(item.title ?? "")}
                  </h3>
                  <div className={`mt-1 [&_.prose-site]:text-[15px] ${ctx.inverted ? "[&_.prose-site]:text-white/75" : "[&_.prose-site]:text-muted"}`}>
                    <Prose markdown={String(item.text ?? "")} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ol className={`grid gap-4 text-left sm:grid-cols-2 ${STEP_COLS[Math.min(items.length, 5)] ?? "lg:grid-cols-3"}`}>
          {items.map((item, i) => (
            <li key={i} className={`flex flex-col rounded-[20px] p-6 ${card}`}>
              <span className={number}>{i + 1}</span>
              <div className="mt-5">
                <h3 className={`text-[18px] font-medium ${ctx.inverted ? "text-white" : "text-ink"}`} {...field(ctx, `${path}.items.${i}.title`)}>
                  {String(item.title ?? "")}
                </h3>
                <div className={`mt-2 [&_.prose-site]:text-[15px] ${ctx.inverted ? "[&_.prose-site]:text-white/75" : "[&_.prose-site]:text-muted"}`}>
                  <Prose markdown={String(item.text ?? "")} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      );
    }
    case "faq": {
      const items = (w.items as Entry[]) ?? [];
      return (
        <div className="mx-auto grid w-full max-w-[860px] gap-3 text-left">
          {items.map((item, i) => (
            <details
              key={i}
              className={`group rounded-2xl px-6 ${ctx.inverted ? "bg-white/10 ring-1 ring-white/15" : "border border-line bg-white open:shadow-[0_20px_40px_-28px_rgba(14,14,20,0.35)]"}`}
            >
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium leading-snug ${ctx.inverted ? "text-white" : "text-ink hover:text-brand"}`}
              >
                <span {...field(ctx, `${path}.items.${i}.q`)}>{String(item.q ?? "")}</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-black/5 transition-colors group-open:bg-brand group-open:text-white">
                  <Chevron className="size-3.5 transition-transform duration-200 group-open:-rotate-180" />
                </span>
              </summary>
              <div className={`pb-6 [&_.prose-site]:text-[15.5px] ${ctx.inverted ? "[&_.prose-site]:text-white/80" : "[&_.prose-site]:text-muted"}`}>
                <Prose markdown={String(item.a ?? "")} />
              </div>
            </details>
          ))}
        </div>
      );
    }
    case "testimonial": {
      const image = w.image as MediaValue;
      const stars = Number(s("stars")) || 0;
      return (
        <figure
          className={`flex h-full flex-col rounded-[24px] p-7 text-left sm:p-8 ${ctx.inverted ? "bg-white/10 ring-1 ring-white/15" : "border border-line bg-white"}`}
        >
          {stars ? (
            <div className="flex gap-0.5 text-amber-400" aria-label={`${stars} out of 5 stars`}>
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="size-4" />
              ))}
            </div>
          ) : null}
          <blockquote
            className={`mt-4 flex-1 text-[19px] leading-[1.5] tracking-[-0.01em] ${ctx.inverted ? "text-white" : "text-ink"}`}
            {...field(ctx, `${path}.quote`)}
          >
            “{s("quote")}”
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            {image?.src ? <Media image={image} variant="plain" sizes="48px" className="size-12 shrink-0 rounded-full" /> : null}
            <span>
              <span className={`block text-[15px] font-medium ${ctx.inverted ? "text-white" : "text-ink"}`} {...field(ctx, `${path}.name`)}>
                {s("name")}
              </span>
              <span className={`block text-[13.5px] ${ctx.inverted ? "text-white/70" : "text-muted"}`} {...field(ctx, `${path}.role`)}>
                {s("role")}
              </span>
            </span>
          </figcaption>
        </figure>
      );
    }
    case "logos": {
      const logos = ((w.items as Entry[]) ?? []).map((item) => item.image as MediaValue).filter((image) => image?.src);
      return (
        <div className="flex flex-col items-center gap-6">
          {s("label") ? (
            <p className={`text-[13px] font-medium tracking-[0.08em] uppercase ${ctx.inverted ? "text-white/70" : "text-muted"}`} {...field(ctx, `${path}.label`)}>
              {s("label")}
            </p>
          ) : null}
          {logos.length ? (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {logos.map((image, i) => (
                <Media
                  key={i}
                  image={image}
                  variant="plain"
                  fit="contain"
                  sizes="140px"
                  className={`h-10 w-32 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 ${ctx.inverted ? "brightness-0 invert" : ""}`}
                />
              ))}
            </div>
          ) : ctx.preview ? (
            <Placeholder label="Logos — upload them in the Logos list" className="h-16 w-full max-w-[640px] rounded-2xl" />
          ) : null}
        </div>
      );
    }
    case "spacer":
      return <div aria-hidden="true" className={SPACER[s("size")] ?? SPACER.md} />;
    case "divider":
      return <hr className={ctx.inverted ? "border-white/20" : "border-line"} />;
    case "embed":
      // Admin-authored, same trust as every other CMS field. Browsers don't run
      // scripts inserted this way, which is why the help text asks for iframes.
      return s("html") ? (
        <div className="w-full overflow-hidden [&_iframe]:w-full [&_iframe]:border-0" dangerouslySetInnerHTML={{ __html: s("html") }} />
      ) : (
        <Placeholder label="Embed — paste an iframe" className="aspect-video w-full rounded-[20px]" />
      );
    default:
      return null;
  }
}

export function CustomSection({ data, preview = false }: { data: CustomProps; preview?: boolean }) {
  const inverted = data.background === "brand" || data.background === "dark";
  const center = data.textAlign === "center";
  const ctx: Ctx = { preview, inverted, center };
  const columns = data.columns ?? [];

  const grid = (
    <>
      {columns.map((column, ci) => (
        <div key={column.id} className={`flex min-w-0 flex-col gap-5 ${SPAN[column.width] ?? SPAN["12"]} ${center ? "items-center text-center" : ""}`}>
          {column.widgets.map((widget, wi) => (
            <div key={widget.id} className={center ? "w-full [&>*]:mx-auto" : "w-full"}>
              {renderWidget(widget, `columns.${ci}.widgets.${wi}`, ctx)}
            </div>
          ))}
        </div>
      ))}
    </>
  );

  // one track until columns sit side by side: twelve tracks on a phone would add eleven gaps (up to 704px) to its width
  const gridClass = `grid grid-cols-1 lg:grid-cols-12 ${GAP[data.gap] ?? GAP.md} ${VALIGN[data.verticalAlign] ?? VALIGN.center}`;

  return (
    <section id={data.anchor || undefined} className={`${BG[data.background] ?? ""} ${PT[data.paddingTop] ?? PT.lg} ${PB[data.paddingBottom] ?? PB.lg}`}>
      <div className={WIDTH[data.width] ?? WIDTH.normal}>
        {data.animate && !preview ? (
          <Reveal className={gridClass} stagger={0.08}>
            {grid}
          </Reveal>
        ) : (
          <div className={gridClass}>{grid}</div>
        )}
      </div>
    </section>
  );
}
