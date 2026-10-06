import Link from "next/link";
import { marked } from "marked";
import { highlightParts, type Item, type Section } from "@/lib/solution-page";
import { Reveal } from "../reveal";
import { Button, Chevron, Container } from "../ui";
import { Icon, iconFor, industryIcon } from "./icons";

/**
 * The solution page's sections. Each kind of content gets its own design —
 * features a bento grid, a comparison a highlighted column, steps a timeline,
 * sample texts chat bubbles — so a page reads like a landing page, not an
 * article. Which kind a section is comes from lib/solution-page.
 */

type Tone = "plain" | "white" | "dark";
/** Every section gets its content, its ground, and the phrases its heading paints. */
type Props = { s: Section; tone: Tone; hl: string[] };

/* ------------------------------------------------------------- building blocks */

/** "A → B → C" in a paragraph becomes stage chips, or a small timeline when the stages are long. */
function flows(html: string) {
  return html.replace(/<p>(?:<strong>)?([^<]*→[^<]*)(?:<\/strong>)?<\/p>/g, (all, text: string) => {
    const parts = text.split("→").map((s) => s.trim()).filter(Boolean);
    if (parts.length < 3) return all;
    return parts.some((p) => p.length > 26)
      ? `<ol class="sol-flow-v">${parts.map((p) => `<li>${p}</li>`).join("")}</ol>`
      : `<div class="sol-flow">${parts.map((p) => `<span>${p}</span>`).join('<i aria-hidden="true"></i>')}</div>`;
  });
}

/** Markdown written in the dashboard — same trust level as <Prose>. */
export function Md({ md, className = "" }: { md: string; className?: string }) {
  if (!md) return null;
  const html = flows(marked.parse(md, { async: false, gfm: true }) as string);
  return <div className={`sol-md ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** A title written in Markdown — "**Your team, or the [AI Conversation Assistant](…)**" keeps its link. */
function Inline({ text }: { text: string }) {
  return <span className="sol-md" dangerouslySetInnerHTML={{ __html: marked.parseInline(text, { async: false }) as string }} />;
}

/** A heading with the solution's name (and its highlight phrases) in the brand gradient. */
export function Hl({ text, terms = [], dark = false }: { text: string; terms?: string[]; dark?: boolean }) {
  return (
    <>
      {highlightParts(text, terms).map((part, i) =>
        part.hit ? (
          <span
            key={i}
            className={`bg-gradient-to-r bg-clip-text text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone] ${
              // the brand blue is too dark to read on the dark sections
              dark ? "from-[#7C9BFF] to-[#B49CFF]" : "from-[#052EFF] to-[#3300EA]"
            }`}
          >
            {part.text}
          </span>
        ) : (
          part.text
        ),
      )}
    </>
  );
}

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium tracking-[0.08em] uppercase ${
        dark ? "bg-white/10 text-white/85" : "bg-brand/8 text-brand"
      }`}
    >
      <span className={`size-1.5 rounded-full ${dark ? "bg-white/70" : "bg-brand"}`} />
      {children}
    </span>
  );
}

function Head({
  hl = [],
  eyebrow,
  title,
  intro,
  center = false,
  dark = false,
}: {
  hl?: string[];
  eyebrow: string;
  title: string;
  intro?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-[780px] text-center" : "max-w-[640px]"}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-5 text-balance text-[31px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[42px] ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        <Hl text={title} terms={hl} dark={dark} />
      </h2>
      {intro ? (
        <Md
          md={intro}
          className={`mt-5 text-[16.5px] leading-[1.65] ${dark ? "text-white/70" : "text-[#1E1E1E]/80"} ${
            center ? "mx-auto max-w-[62ch]" : ""
          }`}
        />
      ) : null}
    </div>
  );
}

function Shell({ id, tone, children }: { id: string; tone: Tone; children: React.ReactNode }) {
  const bg = { plain: "", white: "bg-white", dark: "bg-[#0E0E14] text-white" }[tone];
  return (
    // clip, not hidden: overflow:hidden makes the section its own scroll box, and the
    // sticky headings inside would stick to it (pushed down, never following the page)
    <section id={id} className={`relative scroll-mt-24 overflow-clip py-16 md:py-24 ${bg}`}>
      {tone === "dark" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(51,0,234,0.45),transparent)]"
        />
      ) : null}
      <Container className="relative">{children}</Container>
    </section>
  );
}

/** A card's ground against its section: white on the page colour, the page colour on white. */
const cardBg = (tone: Tone) => (tone === "white" ? "bg-[#F8F8F9]" : "bg-white");

function IconTile({ n, tone = "soft" }: { n: ReturnType<typeof iconFor>; tone?: "soft" | "solid" | "glass" }) {
  const look = {
    soft: "bg-brand-soft text-brand",
    solid: "bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white shadow-[0_8px_20px_-8px_rgba(51,0,234,0.6)]",
    glass: "bg-white/10 text-white ring-1 ring-white/15",
  }[tone];
  return (
    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${look}`}>
      <Icon n={n} className="size-[22px]" />
    </span>
  );
}

/** Paragraphs of a block, each its own string, for layouts that place them apart. */
const paragraphs = (md: string) => md.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

/* ------------------------------------------------------------------ problem */

/** The page's opening: what goes wrong today, as cards, and the answer picked out under them. */
function Problem({ s, tone, hl }: Props) {
  // a section of plain paragraphs: the first leads, the last is the fix, the ones between are the pains
  const prose = s.kind === "prose" ? paragraphs(s.intro) : null;
  const outro = paragraphs(s.outro);
  const answer = prose ? prose.pop() : outro.pop();
  const intro = prose ? prose.shift() : s.intro;
  const items: Item[] = prose ? prose.map((body) => ({ title: "", body })) : s.items;
  const questions = items.length > 0 && items.every((item) => !item.title && /\?["”]?$/.test(item.body));

  return (
    <Shell id={s.id} tone={tone}>
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <Head hl={hl} eyebrow="The problem" title={s.title} intro={intro} />
          {outro.length ? <Md md={outro.join("\n\n")} className="mt-5 max-w-[640px] text-[16.5px] leading-[1.65] text-[#1E1E1E]/80" /> : null}
        </div>

        <div>
          {questions ? (
            // the same questions every day — as the messages they arrive as
            <Reveal className="flex flex-col gap-3" stagger={0.06}>
              {items.map((item, i) => (
                <div key={item.body} className={`flex items-end gap-2.5 ${i % 2 ? "pl-10" : ""}`}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-[12px] font-medium text-muted">
                    {["AL", "JM", "SR", "TK", "EC", "MB", "RD"][i % 7]}
                  </span>
                  <p className="rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3 text-[15.5px] text-ink shadow-[0_1px_2px_rgba(14,14,20,0.04)]">
                    {item.body.replace(/^["“]|["”]$/g, "")}
                  </p>
                </div>
              ))}
            </Reveal>
          ) : (
            <Reveal className="grid gap-3" stagger={0.07}>
              {items.map((item) => (
                <div
                  key={item.title + item.body}
                  className={`flex gap-4 rounded-2xl border border-line p-5 shadow-[0_1px_2px_rgba(14,14,20,0.04)] ${cardBg(tone)}`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#FDECEC] text-[#D93636]">
                    <Icon n="x" className="size-4" sw={2.4} />
                  </span>
                  <div className="min-w-0 pt-1">
                    {item.title ? (
                      <p className="text-[17px] font-medium leading-snug text-ink">
                        <Inline text={item.title} />
                      </p>
                    ) : null}
                    <Md md={item.body} className={`text-[15.5px] leading-[1.6] ${item.title ? "mt-1 text-[#1E1E1E]/70" : "text-ink"}`} />
                  </div>
                </div>
              ))}
            </Reveal>
          )}

          {answer ? (
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#052EFF] to-[#3300EA] p-6 text-white shadow-[0_20px_40px_-20px_rgba(51,0,234,0.7)] sm:p-7">
              <span aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-16 size-48 rounded-full bg-white/10" />
              <span className="relative flex items-center gap-2 text-[12.5px] font-medium tracking-[0.08em] text-white/80 uppercase">
                <Icon n="sparkle" className="size-4" /> The fix
              </span>
              <Md md={answer} className="sol-md-light relative mt-2 text-[17px] leading-[1.6]" />
            </div>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}

/* ----------------------------------------------------------------- features */

/** Column spans on the six-column desktop grid that fill every row, by item count. */
const SPANS: Record<number, number[]> = {
  1: [6],
  2: [3, 3],
  3: [2, 2, 2],
  4: [4, 2, 2, 4],
  5: [4, 2, 2, 2, 2],
  6: [4, 2, 2, 4, 3, 3],
  7: [4, 2, 2, 2, 2, 2, 4],
  8: [4, 2, 2, 2, 2, 2, 2, 2],
};
const SPAN_CLASS: Record<number, string> = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4", 6: "lg:col-span-6" };

function Features({ s, tone, hl }: Props) {
  const spans = SPANS[s.items.length] ?? s.items.map(() => 2);
  let featured = 0;
  return (
    <Shell id={s.id} tone={tone}>
      <Head hl={hl} eyebrow="What you get" title={s.title} intro={s.intro} center />
      <Reveal className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6" stagger={0.06}>
        {s.items.map((item, i) => {
          const big = spans[i] >= 4;
          const look = big ? (featured++ % 2 ? "gradient" : "dark") : "card";
          const odd = s.items.length % 2 === 1 && i === s.items.length - 1;
          return (
            <article
              key={item.title}
              className={`relative flex flex-col overflow-hidden rounded-[24px] p-7 ${SPAN_CLASS[spans[i]]} ${odd ? "md:col-span-2" : ""} ${
                look === "dark"
                  ? "bg-[#0E0E14] text-white"
                  : look === "gradient"
                    ? "bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white"
                    : `border border-line ${cardBg(tone)}`
              } ${big ? "lg:min-h-[260px]" : ""}`}
            >
              {big ? (
                <>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-24 -right-16 size-72 rounded-full ${
                      look === "dark" ? "bg-[radial-gradient(closest-side,rgba(51,0,234,0.6),transparent)]" : "bg-white/10"
                    }`}
                  />
                  <Icon n={iconFor(item.title, item.body)} className="pointer-events-none absolute right-6 bottom-6 hidden size-32 text-white/[0.07] sm:block" sw={1.25} />
                </>
              ) : null}
              <IconTile n={iconFor(item.title, item.body)} tone={big ? "glass" : "soft"} />
              <h3 className={`relative mt-6 text-[20px] font-medium leading-snug tracking-[-0.01em] ${big ? "text-white sm:text-[24px]" : "text-ink"}`}>
                {item.title}
              </h3>
              <Md
                md={item.body}
                className={`relative mt-2.5 text-[15.5px] leading-[1.6] ${big ? "sol-md-light max-w-[52ch] text-white/75" : "text-[#1E1E1E]/70"}`}
              />
            </article>
          );
        })}
      </Reveal>
      {s.outro ? <Md md={s.outro} className="mx-auto mt-10 max-w-[680px] text-center text-[16px] leading-[1.65] text-[#1E1E1E]/75" /> : null}
    </Shell>
  );
}

/* -------------------------------------------------------------------- cards */

/** Industries: one card each, with its icon; a pipeline in the text shows as its stages. */
function Cards({ s, tone, hl }: Props) {
  return (
    <Shell id={s.id} tone={tone}>
      <Head hl={hl} eyebrow="By industry" title={s.title} intro={s.intro} />
      <Reveal className="mt-12 flex flex-wrap justify-center gap-4" stagger={0.06}>
        {s.items.map((item) => (
          <article
            key={item.title}
            className={`group flex w-full flex-col rounded-[24px] border border-line p-7 transition-[border-color,box-shadow] hover:border-brand/30 hover:shadow-[0_20px_40px_-24px_rgba(51,0,234,0.35)] md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] ${cardBg(tone)}`}
          >
            <IconTile n={industryIcon(item.title)} tone="solid" />
            <h3 className="mt-6 text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink">
              <Inline text={item.title} />
            </h3>
            <Md md={item.body} className="mt-2.5 text-[15.5px] leading-[1.6] text-[#1E1E1E]/70" />
          </article>
        ))}
      </Reveal>
      {s.outro ? <Md md={s.outro} className="mt-8 max-w-[680px] text-[16px] leading-[1.65] text-[#1E1E1E]/75" /> : null}
    </Shell>
  );
}

/* ------------------------------------------------------------------ compare */

const YES = /^(yes|built in|all of them|all channels|every call|instant)\b/i;
const NO = /^(no|n\/a)$/i;

function Value({ text, ours }: { text: string; ours: boolean }) {
  if (ours) {
    return (
      <span className="flex items-start gap-2.5 font-medium text-ink">
        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white">
          <Icon n="check" className="size-3" sw={3} />
        </span>
        {text}
      </span>
    );
  }
  if (NO.test(text)) {
    return (
      <span className="flex items-center gap-2.5 text-muted">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface text-muted">
          <Icon n="x" className="size-3" sw={2.6} />
        </span>
        {text}
      </span>
    );
  }
  if (YES.test(text)) {
    return (
      <span className="flex items-center gap-2.5 text-[#1E1E1E]">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface text-[#1E1E1E]">
          <Icon n="check" className="size-3" sw={2.6} />
        </span>
        {text}
      </span>
    );
  }
  return <span className="text-[#1E1E1E]/80">{text}</span>;
}

/** Two columns: the old way and ours, or a trigger and what follows, as before → after rows. */
function Pairs({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mx-auto mt-12 max-w-[960px]">
      <div className="hidden grid-cols-[1fr_56px_1fr] items-center px-2 pb-4 text-[13px] font-medium tracking-[0.08em] uppercase md:grid">
        <span className="text-muted">{head[0]}</span>
        <span />
        <span className="text-brand">{head[1]}</span>
      </div>
      <Reveal className="grid gap-3" stagger={0.05}>
        {rows.map(([from, to]) => (
          <div key={from} className="grid items-stretch gap-2 md:grid-cols-[1fr_56px_1fr]">
            <div className="flex items-center rounded-2xl border border-line bg-white px-5 py-4 text-[15.5px] text-[#1E1E1E]/75">
              <span className="mr-2 text-[12px] font-medium tracking-[0.08em] text-muted uppercase md:hidden">{head[0]} ·</span>
              {from}
            </div>
            <span className="grid place-items-center text-brand">
              <Icon n="arrowRight" className="hidden size-5 md:block" sw={2} />
              <Icon n="arrowDown" className="size-5 md:hidden" sw={2} />
            </span>
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#F1EEFF] to-[#F6F4FF] px-5 py-4 text-[15.5px] font-medium text-ink ring-1 ring-brand/15">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white">
                <Icon n="check" className="size-3.5" sw={3} />
              </span>
              {to}
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}

/** Three or more columns: a comparison with our column raised, and one card per row on a phone. */
function Grid({ head, rows }: { head: string[]; rows: string[][] }) {
  const ours = head.length - 1;
  const cols = { gridTemplateColumns: `minmax(0,1.35fr) repeat(${head.length - 1}, minmax(0,1fr))` };
  return (
    <>
      <div className="relative mt-12 hidden md:block">
        {/* our column, raised above the table, behind its cells */}
        <div className="pointer-events-none absolute -inset-y-3 inset-x-0 grid" style={cols}>
          <span style={{ gridColumn: `${head.length} / ${head.length + 1}` }} className="rounded-[24px] bg-gradient-to-b from-[#F1EEFF] to-[#F8F7FF] ring-1 ring-brand/15" />
        </div>
        <div className="relative">
          <div className="grid items-end" style={cols}>
            {head.map((h, i) => (
              <div key={i} className={`px-6 pt-4 pb-5 text-[15px] font-medium ${i === ours ? "text-brand" : "text-muted"}`}>
                {i === ours ? (
                  <span className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-lg bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white">
                      <Icon n="sparkle" className="size-3.5" sw={2} />
                    </span>
                    {h}
                  </span>
                ) : (
                  h
                )}
              </div>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row[0]} className="grid border-t border-line" style={cols}>
              {row.map((cell, i) => (
                <div key={i} className={`px-6 py-5 text-[15.5px] leading-snug ${i === 0 ? "font-medium text-ink" : ""}`}>
                  {i === 0 ? cell : <Value text={cell} ours={i === ours} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:hidden">
        {rows.map((row) => (
          <div key={row[0]} className="overflow-hidden rounded-2xl border border-line bg-white">
            <p className="bg-surface/70 px-5 py-3.5 text-[15.5px] font-medium text-ink">{row[0]}</p>
            {row.slice(1).map((cell, i) => (
              <div key={i} className={`border-t border-line px-5 py-3.5 text-[15px] ${i + 1 === ours ? "bg-[#F5F3FF]" : ""}`}>
                <p className={`mb-1 text-[12.5px] ${i + 1 === ours ? "text-brand" : "text-muted"}`}>{head[i + 1]}</p>
                <Value text={cell} ours={i + 1 === ours} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Compare({ s, tone, hl }: Props) {
  const t = s.table!;
  return (
    <Shell id={s.id} tone={tone}>
      <Head hl={hl} eyebrow="Compare" title={s.title} intro={s.intro} center />
      {t.head.length === 2 ? <Pairs head={t.head} rows={t.rows} /> : <Grid head={t.head} rows={t.rows} />}
      {s.outro ? (
        <div className="mx-auto mt-10 flex max-w-[780px] gap-4 rounded-2xl border border-line bg-white p-6">
          <span className="mt-0.5 shrink-0 text-brand">
            <Icon n="sparkle" className="size-5" />
          </span>
          <Md md={s.outro} className="text-[16px] leading-[1.65] text-[#1E1E1E]/80" />
        </div>
      ) : null}
    </Shell>
  );
}

/* -------------------------------------------------------------------- steps */

function TextBubble({ text }: { text: string }) {
  return (
    <div className="mt-3 max-w-[460px] rounded-2xl rounded-bl-md bg-[#F1EEFF] px-4 py-3 text-[15px] leading-[1.55] text-ink ring-1 ring-brand/10">
      <span className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-brand">
        <Icon n="sms" className="size-3.5" /> Text message
      </span>
      {text}
    </div>
  );
}

function Steps({ s, tone, hl }: Props) {
  const across = s.items.length <= 5 && s.items.every((item) => item.title && !item.quote);
  const cols = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" }[s.items.length] ?? "lg:grid-cols-4";

  if (across) {
    return (
      <Shell id={s.id} tone={tone}>
        <Head hl={hl} eyebrow="How it works" title={s.title} intro={s.intro} center />
        <div className="relative mt-14">
          <span aria-hidden="true" className="absolute top-6 right-[8%] left-[8%] hidden border-t-2 border-dashed border-brand/20 lg:block" />
          <Reveal className={`relative grid gap-4 sm:grid-cols-2 ${cols}`} stagger={0.08}>
            {s.items.map((item, i) => (
              <article key={item.title} className="flex flex-col items-start lg:items-center lg:text-center">
                <span
                  className={`grid size-12 place-items-center rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-[18px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(51,0,234,0.7)] ring-8 ${
                    tone === "white" ? "ring-white" : "ring-[#FAFAF9]"
                  }`}
                >
                  {i + 1}
                </span>
                <div className={`mt-5 w-full flex-1 rounded-[22px] border border-line p-6 ${cardBg(tone)}`}>
                  <h3 className="text-[18px] font-medium leading-snug text-ink">
                    <Inline text={item.title} />
                  </h3>
                  <Md md={item.body} className="mt-2 text-[15px] leading-[1.6] text-[#1E1E1E]/70 first-letter:uppercase" />
                </div>
              </article>
            ))}
          </Reveal>
        </div>
        {s.outro ? <Md md={s.outro} className="mx-auto mt-10 max-w-[680px] text-center text-[16px] leading-[1.65] text-[#1E1E1E]/75" /> : null}
      </Shell>
    );
  }

  return (
    <Shell id={s.id} tone={tone}>
      <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <Head hl={hl} eyebrow="How it works" title={s.title} intro={s.intro} />
          {s.outro ? <StepsOutro md={s.outro} className="mt-8 hidden lg:flex" /> : null}
        </div>
        <Reveal as="ul" className="relative" stagger={0.07}>
          {s.items.map((item, i) => (
            <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
              {i < s.items.length - 1 ? (
                <span aria-hidden="true" className="absolute top-12 bottom-0 left-[23px] w-px bg-gradient-to-b from-brand/30 to-brand/5" />
              ) : null}
              <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-white text-[17px] font-medium text-brand shadow-[0_6px_18px_-8px_rgba(14,14,20,0.25)] ring-1 ring-line">
                {i + 1}
              </span>
              <div className={`min-w-0 flex-1 rounded-[20px] border border-line px-5 py-4 ${cardBg(tone)}`}>
                {item.title ? (
                  <h3 className="text-[17px] font-medium leading-snug text-ink">
                    <Inline text={item.title} />
                  </h3>
                ) : null}
                {item.body ? (
                  <Md
                    md={item.body}
                    className={`text-[15.5px] leading-[1.6] first-letter:uppercase ${item.title ? "mt-1 text-[#1E1E1E]/70" : "text-ink"}`}
                  />
                ) : null}
                {item.quote ? <TextBubble text={item.quote} /> : null}
              </div>
            </li>
          ))}
        </Reveal>
        {/* the conclusion follows the steps on a phone; beside them on a desktop */}
        {s.outro ? <StepsOutro md={s.outro} className="flex lg:hidden" /> : null}
      </div>
    </Shell>
  );
}

function StepsOutro({ md, className }: { md: string; className: string }) {
  return (
    <div className={`max-w-[560px] gap-3 rounded-2xl bg-gradient-to-br from-[#052EFF] to-[#3300EA] p-5 text-white ${className}`}>
      <Icon n="sparkle" className="mt-0.5 size-5 shrink-0" />
      <Md md={md} className="sol-md-light text-[16px] leading-[1.6]" />
    </div>
  );
}

/* -------------------------------------------------------------------- chats */

const OURS = /^(ai|expert ai|assistant|bot)$/i;

function channelOf(label: string) {
  if (/instagram/i.test(label)) return { n: "instagram" as const, name: "Instagram" };
  if (/facebook|messenger/i.test(label)) return { n: "facebook" as const, name: "Messenger" };
  if (/chat/i.test(label)) return { n: "chat" as const, name: "Chat" };
  return { n: "sms" as const, name: "Text" };
}

function Chats({ s, hl }: { s: Section; hl: string[] }) {
  const cols = s.chats.length % 3 === 0 ? "lg:grid-cols-3" : s.chats.length % 2 === 0 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <Shell id={s.id} tone="dark">
      <Head hl={hl} eyebrow="See it in action" title={s.title} intro={s.intro} center dark />
      <Reveal className={`mx-auto mt-12 grid max-w-[1180px] gap-4 md:grid-cols-2 ${cols}`} stagger={0.08}>
        {s.chats.map((chat, i) => {
          const channel = channelOf(chat.label);
          const single = chat.lines.every((line) => !line.who);
          return (
            <article key={i} className="flex flex-col rounded-[24px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                <span className="grid size-8 place-items-center rounded-full bg-white/10 text-white">
                  <Icon n={channel.n} className="size-4" />
                </span>
                <p className="text-[14px] leading-snug font-medium text-white/85">{chat.label || channel.name}</p>
              </div>
              <div className="flex flex-1 flex-col gap-3 pt-5">
                {chat.lines.map((line, j) => {
                  const ours = single || OURS.test(line.who);
                  return (
                    <div key={j} className={`flex flex-col ${ours ? "items-end" : "items-start"}`}>
                      {line.who ? <span className="mb-1 px-1 text-[12px] text-white/45">{line.who}</span> : null}
                      <p
                        className={`max-w-[88%] px-4 py-2.5 text-[15px] leading-[1.5] ${
                          ours
                            ? "rounded-2xl rounded-br-md bg-gradient-to-br from-[#2C4BFF] to-[#5A2BFF] text-white"
                            : "rounded-2xl rounded-bl-md bg-white/10 text-white/90"
                        }`}
                      >
                        {line.text}
                      </p>
                    </div>
                  );
                })}
                {single ? (
                  <span className="flex items-center gap-1 self-end text-[12px] text-white/40">
                    <Icon n="check" className="size-3.5" sw={2.5} /> Sent automatically
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </Reveal>
      {s.outro ? <Md md={s.outro} className="sol-md-light mx-auto mt-10 max-w-[640px] text-center text-[16px] leading-[1.65] text-white/65" /> : null}
    </Shell>
  );
}

/* -------------------------------------------------------------------- links */

function Links({ s, tone, hl }: Props) {
  const cols = s.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <Shell id={s.id} tone={tone}>
      <Head hl={hl} eyebrow="Connected system" title={s.title} intro={s.intro} center />
      <Reveal className={`mt-12 grid gap-4 md:grid-cols-2 ${cols}`} stagger={0.07}>
        {s.items.map((item) => (
          <Link
            key={item.title}
            href={item.href!}
            className={`group flex flex-col rounded-[24px] border border-line p-7 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_20px_40px_-24px_rgba(51,0,234,0.4)] ${cardBg(tone)}`}
          >
            <IconTile n={iconFor(item.title)} tone="solid" />
            <h3 className="mt-6 text-[19px] font-medium tracking-[-0.01em] text-ink">{item.title}</h3>
            <Md md={item.body} className="mt-2 flex-1 text-[15.5px] leading-[1.6] text-[#1E1E1E]/70 first-letter:uppercase" />
            <span className="mt-6 flex items-center gap-1.5 text-[15px] font-medium text-brand">
              Explore
              <Icon n="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" sw={2} />
            </span>
          </Link>
        ))}
      </Reveal>
      {s.outro ? <Md md={s.outro} className="mt-10 text-center text-[18px] font-medium tracking-[-0.01em] text-ink" /> : null}
    </Shell>
  );
}

/* --------------------------------------------------------------------- list */

function List({ s, tone, hl }: Props) {
  const titled = s.items.some((item) => item.title);

  if (titled) {
    const four = s.items.length >= 7 || s.items.length === 4;
    return (
      <Shell id={s.id} tone={tone}>
        <Head hl={hl} eyebrow="Highlights" title={s.title} intro={s.intro} center />
        <Reveal className="mt-12 flex flex-wrap justify-center gap-4" stagger={0.05}>
          {s.items.map((item: Item) => (
            <article
              key={item.title}
              className={`flex w-full flex-col rounded-[22px] border border-line p-6 sm:w-[calc((100%-1rem)/2)] ${
                four ? "lg:w-[calc((100%-3rem)/4)]" : "lg:w-[calc((100%-2rem)/3)]"
              } ${cardBg(tone)}`}
            >
              <IconTile n={iconFor(item.title, item.body)} />
              <h3 className="mt-5 text-[18px] font-medium leading-snug text-ink">
                <Inline text={item.title} />
              </h3>
              {item.body ? <Md md={item.body} className="mt-1.5 text-[15px] leading-[1.6] text-[#1E1E1E]/70 first-letter:uppercase" /> : null}
            </article>
          ))}
        </Reveal>
        {s.outro ? <Md md={s.outro} className="mx-auto mt-10 max-w-[680px] text-center text-[16px] leading-[1.65] text-[#1E1E1E]/75" /> : null}
      </Shell>
    );
  }

  return (
    <Shell id={s.id} tone={tone}>
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Head hl={hl} eyebrow="Checklist" title={s.title} intro={s.intro} />
        <div className={`rounded-[28px] border border-line p-3 shadow-[0_30px_60px_-40px_rgba(14,14,20,0.35)] ${cardBg(tone)}`}>
          <Reveal as="ul" className="grid gap-1" stagger={0.05}>
            {s.items.map((item) => (
              <li key={item.body} className="flex items-start gap-3.5 rounded-2xl px-4 py-3.5 transition-colors hover:bg-brand/[0.04]">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white">
                  <Icon n="check" className="size-3.5" sw={3} />
                </span>
                <Md md={item.body} className="text-[16px] leading-[1.55] text-ink" />
              </li>
            ))}
          </Reveal>
          {s.outro ? <Md md={s.outro} className="mx-4 mt-2 mb-3 border-t border-line pt-4 text-[15.5px] leading-[1.6] text-[#1E1E1E]/75" /> : null}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------- prose */

/** A short section on its own: a statement card, heading on the left and the words on the right. */
function Statement({ s, tone, hl }: Props) {
  return (
    <Shell id={s.id} tone={tone}>
      <div className="relative overflow-hidden rounded-[32px] border border-brand/10 bg-gradient-to-br from-[#F3F0FF] via-white to-white p-7 sm:p-12 lg:p-16">
        <span aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-brand/[0.06]" />
        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <IconTile n={iconFor(s.title, s.intro)} tone="solid" />
            <h2 className="mt-6 text-balance text-[28px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[36px]">
              <Hl text={s.title} terms={hl} />
            </h2>
          </div>
          <Md md={s.intro} className="text-[17px] leading-[1.7] text-[#1E1E1E]/85 lg:pt-2" />
        </div>
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- dispatch */

export function SolutionSection({ s, index, hl }: { s: Section; index: number; hl: string[] }) {
  // the page alternates its ground so sections read apart; the chats are always dark
  const tone: Tone = index % 2 ? "white" : "plain";
  if (index === 0) return <Problem s={s} tone={tone} hl={hl} />;
  switch (s.kind) {
    case "features":
      return <Features s={s} tone={tone} hl={hl} />;
    case "cards":
      return <Cards s={s} tone={tone} hl={hl} />;
    case "compare":
      return <Compare s={s} tone={tone} hl={hl} />;
    case "steps":
      return <Steps s={s} tone={tone} hl={hl} />;
    case "chats":
      return <Chats s={s} hl={hl} />;
    case "links":
      return <Links s={s} tone={tone} hl={hl} />;
    case "list":
      return <List s={s} tone={tone} hl={hl} />;
    default:
      return <Statement s={s} tone={tone} hl={hl} />;
  }
}

/* ---------------------------------------------------------------------- faq */

export function SolutionFaq({
  title,
  items,
  demo,
  hl,
}: {
  title: string;
  items: { q: string; a: string }[];
  demo: { label: string; href: string };
  hl: string[];
}) {
  return (
    <Shell id="faq" tone="plain">
      <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <Head hl={hl} eyebrow="FAQ" title={title} />
          <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.65] text-[#1E1E1E]/75">
            Still wondering how it would work for your business? Ask us on a live demo.
          </p>
          <Button cta={demo} className="mt-7 px-8" />
        </div>
        <div className="grid gap-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-line bg-white px-6 transition-shadow open:shadow-[0_20px_40px_-28px_rgba(14,14,20,0.35)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium leading-snug text-ink transition-colors hover:text-brand">
                {item.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-muted transition-colors group-open:bg-brand group-open:text-white">
                  <Chevron className="size-3.5 transition-transform duration-200 group-open:-rotate-180" />
                </span>
              </summary>
              <Md md={item.a} className="pb-6 text-[15.5px] leading-[1.7] text-[#1E1E1E]/75" />
            </details>
          ))}
        </div>
      </div>
    </Shell>
  );
}
