import type { ReactNode } from "react";
import type { Media as MediaValue } from "@/content/home";
import type { Column, CustomProps, Widget } from "@/lib/builder/widgets";
import { Prose } from "../prose";
import { Reveal } from "../reveal";
import { CheckRing, Media, Placeholder } from "../ui";

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
        <div key={column.id} className={`col-span-12 flex flex-col gap-5 ${SPAN[column.width] ?? SPAN["12"]} ${center ? "items-center text-center" : ""}`}>
          {column.widgets.map((widget, wi) => (
            <div key={widget.id} className={center ? "w-full [&>*]:mx-auto" : "w-full"}>
              {renderWidget(widget, `columns.${ci}.widgets.${wi}`, ctx)}
            </div>
          ))}
        </div>
      ))}
    </>
  );

  const gridClass = `grid grid-cols-12 ${GAP[data.gap] ?? GAP.md} ${VALIGN[data.verticalAlign] ?? VALIGN.center}`;

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
