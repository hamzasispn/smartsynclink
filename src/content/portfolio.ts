// Shape + seed copy for /portfolio.
// Live content lives in Postgres (site_content.portfolio); this is the fallback
// the page renders when the row is missing or the DB is unreachable.
// No imports here on purpose — the seed script loads this file directly.

export type Cta = { label: string; href: string };
export type Media = { src: string; alt: string };

export type CaseStudy = {
  /** Small label above the title — the industry. */
  eyebrow: string;
  title: string;
  summary: string;
  /** The parts of the system this build leans on — real service names. */
  tags: string[];
  /** What was built and turned on — deliverables, not invented metrics. */
  highlights: string[];
  image: Media;
  /** Optional link to the matching industry page, when one exists. */
  href?: string;
};

export const defaultPortfolio = {
  badge: "OUR WORK",
  heading: "One connected system, built around how each business runs.",
  subheading:
    "AI on the phones, one inbox for every message, funnels that convert and follow-up that never stops — assembled and tuned for the trade, then handed over live.",

  /** The credibility line under the hero — honest capability, no invented stats. */
  meta: [
    "Built on GoHighLevel",
    "Live in days, not months",
    "Set up for your trade",
  ],

  cases: [
    {
      eyebrow: "Aesthetics · Med Spa",
      title: "A front desk that never misses a call.",
      summary:
        "An AI receptionist answers every call, books consultations straight into the calendar, and the one-click campaign runs a year of reviews, rebookings and referrals from the moment a client checks out.",
      tags: ["AI Voice Agent", "Unified Smart Inbox", "One-Click Campaigns"],
      highlights: [
        "AI voice agent on every incoming call",
        "SMS, Instagram and web chat in one inbox",
        "Year-long review and referral campaign",
      ],
      image: { src: "/images/aesthetics.webp", alt: "Med spa client" } as Media,
      href: "/industries/aesthetics",
    },
    {
      eyebrow: "Contractors · Home Services",
      title: "Every lead answered before it goes cold.",
      summary:
        "Missed-call text-back and instant replies keep quote requests moving, while a guided funnel qualifies the job before it ever reaches the owner's phone.",
      tags: ["Missed Call Text Back", "Smart Website", "Smart Sales Pipeline"],
      highlights: [
        "Missed-call text-back on every line",
        "Quote-request funnel with instant follow-up",
        "Jobs and estimates in one pipeline",
      ],
      image: { src: "/images/contractors.webp", alt: "Contractor at work" } as Media,
    },
    {
      eyebrow: "Real Estate · Realtors",
      title: "From first enquiry to booked viewing.",
      summary:
        "Enquiries from every portal land in one inbox, the AI qualifies and schedules viewings, and long-term nurture keeps quiet leads warm until they are ready to move.",
      tags: ["AI Conversation Assistant", "Custom Automation Workflows", "Google Reviews Automation"],
      highlights: [
        "Unified inbox across every portal",
        "AI qualification and viewing scheduling",
        "Long-term nurture for slow-moving leads",
      ],
      image: { src: "/images/real-estate.webp", alt: "Real estate property" } as Media,
    },
  ] as CaseStudy[],

  /** The strip that ties the work back to the service list. */
  capabilities: {
    heading: "Every system we build includes",
    items: [
      "AI Voice Agent",
      "Unified Smart Inbox",
      "Smart Website",
      "AI Conversation Assistant",
      "Missed Call Text Back",
      "Custom Automation Workflows",
      "Smart Sales Pipeline",
      "Google Reviews Automation",
    ],
  },

  cta: {
    heading: "Want this built for your business?",
    body: "Book a demo and we will walk you through the exact system, set up for the way you work.",
    primary: { label: "Book A Demo", href: "#call" } as Cta,
  },
};

export type PortfolioContent = typeof defaultPortfolio;
