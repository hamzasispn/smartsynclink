/**
 * Instagram and Facebook, pinned to the lower left of an industry page.
 *
 * Lower left because the booking chat widget owns the lower right. Plain links
 * with no JavaScript; each only renders when its URL is filled in the admin,
 * so an industry without a profile shows nothing rather than a dead button.
 */
export function FloatingSocial({ instagram, facebook }: { instagram?: string; facebook?: string }) {
  const links = [
    instagram && {
      href: instagram,
      label: "Follow us on Instagram",
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
        </>
      ),
    },
    facebook && {
      href: facebook,
      label: "Like us on Facebook",
      icon: (
        <path
          fill="currentColor"
          d="M13.6 21.5v-8.3h2.8l.4-3.3h-3.2V7.8c0-.9.3-1.6 1.6-1.6h1.7V3.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.3h2.8v8.3z"
        />
      ),
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  if (!links.length) return null;

  return (
    <ul className="fixed bottom-6 left-4 z-[60] flex flex-col gap-3 sm:left-6">
      {links.map((link, i) => (
        <li key={link.href} className="rise" style={{ "--i": i + 6 } as React.CSSProperties}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white shadow-lift ring-4 ring-white/70 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-brand"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              {link.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
