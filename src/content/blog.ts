// Shape + seed copy for the blog index and the single post page.
// Live content lives in Postgres (site_content.blog); this is the fallback the
// pages render when the row is missing or the DB is unreachable.
// No imports here on purpose — the seed script loads this file directly.

export const defaultBlog = {
  badge: "BLOGS",
  heading: "Ideas, Strategies & Insights To Help You Capture More Leads.",
  subheading:
    "Practical insights on AI, automation, lead generation, conversion funnels, websites, and follow-up strategies designed to help businesses turn more opportunities into customers.",

  /** Sits above the "All" pill; the rest of the row comes from post tags. */
  allLabel: "All",
  relatedLabel: "Related blog post",
  tocLabel: "Table of Contents",
  updatedLabel: "Updated:",
  readTimeLabel: "min read",

  /** Author byline. Posts have no author column, so one name covers the site. */
  byline: "admin",

  /** Posts per page on the listing. */
  perPage: 10,

  /** How many cards sit above the newsletter band. The rest follow below it. */
  beforeNewsletter: 4,

  newsletter: {
    heading: "Don't want to miss anything?",
    body: "Get SmartSyncLink updates, tutorials and tips right in your mailbox.",
    // the form itself is the footer's (Footer → Newsletter), so the two never drift apart
    note: "By entering your email, you agree to our",
    noteLink: { label: "Privacy Policy.", href: "/privacy" },
    image: { src: "", alt: "" },
  },

  search: {
    placeholder: "Search",
  },
};

export type BlogContent = typeof defaultBlog;
