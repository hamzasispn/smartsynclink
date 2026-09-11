import type { TocItem } from "@/lib/toc";

/**
 * The article's table of contents.
 *
 * Plain anchors, so it works before any JavaScript runs and every entry is a
 * real link a reader can copy. Numbering is worked out up front rather than
 * inside the map — the reference numbers sections 1, 1.1, 1.2, 2, which an
 * <ol> cannot do across two levels, and counting during render is a reassign
 * the linter rightly objects to.
 */
function numbered(items: TocItem[]) {
  let major = 0;
  let minor = 0;
  return items.map((item) => {
    if (item.level === 2) {
      major += 1;
      minor = 0;
    } else {
      minor += 1;
    }
    return { ...item, number: item.level === 2 ? `${major}.` : `${major}.${minor}.` };
  });
}

export function TableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={label}
      className="overflow-hidden rounded-[12px] border border-line bg-white"
    >
      <p className="border-b border-line px-5 py-4 text-[20px] font-semibold leading-[28px] text-ink">
        {label}
      </p>
      <ul className="max-h-[420px] overflow-y-auto overscroll-contain px-5 py-4">
        {numbered(items).map((item) => (
          <li
            key={item.id}
            className={`flex gap-3 text-[16px] leading-[24px] ${
              item.level === 3 ? "mt-2 pl-6" : "mt-3 first:mt-0"
            }`}
          >
            <span className="shrink-0 text-muted">{item.number}</span>
            <a href={`#${item.id}`} className="text-brand-blue hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
