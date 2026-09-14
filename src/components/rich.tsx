import Link from "next/link";

/**
 * Inline rich text for short admin-edited strings: **bold** and [label](href).
 *
 * ponytail: a two-token regex, not Markdown. These are one-line notes on the
 * pricing pages; a full renderer (Prose) would wrap them in <p> and bring block
 * spacing they must not have. Anything longer belongs in a Prose field.
 */
export function Rich({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {bold[1]}
            </strong>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          return (
            <Link key={i} href={link[2]} className="font-medium text-brand underline underline-offset-4">
              {link[1]}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

/** A heading with the named part painted in the brand gradient. */
export function GradientText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-[#052EFF] to-[#3300EA] bg-clip-text text-transparent">
        {highlight}
      </span>
      {after}
    </>
  );
}
