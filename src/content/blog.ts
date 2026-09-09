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
  featuredLabel: "Featured Article",
  recentLabel: "Recent post",
  relatedLabel: "Related blog post",
  readLabel: "Read Article",

  /** Author byline. Posts have no author column, so one name covers the site. */
  byline: "admin",

  /** Articles in the featured column per page. */
  perPage: 4,

  newsletter: {
    label: "Newsletter",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    placeholder: "Your email address",
    cta: "Sign Up",
  },

  search: {
    label: "Search",
    placeholder: "search",
  },
};

export type BlogContent = typeof defaultBlog;
