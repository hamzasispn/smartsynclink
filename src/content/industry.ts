// Shape + seed data for an industry landing page.
// Each industry is one row in `industries`; this file is the template every
// row is merged over, so a field added here shows up on existing rows before
// anyone re-saves them.
// No imports beyond the home types on purpose — the seed script loads it directly.

import type { Cta, Media } from "./home";

export type ProblemCard = { icon: Media; title: string; body: string };

export type JourneyStep = {
  step: string;
  title: string;
  body: string;
  image: Media;
  /** Paints the tile in brand blue, as the design alternates them. */
  highlight: boolean;
  /** Half the row instead of a quarter — the design's bento rhythm is
   *  3-6-3 then 3-3-6 on a twelve column grid. Kept per step rather than
   *  derived from the index so a seventh step cannot break the pattern. */
  wide: boolean;
};

export const defaultIndustry = {
  hero: {
    badge: "SMARTSYNCLINK FOR AESTHETICS",
    heading: "Turn Treatment Interest Into More Consultations & Booked Appointments.",
    body: "From Botox and HydraFacials to body contouring and other aesthetic treatments, your prospects have questions before they're ready to book.",
    body2:
      "SmartSyncLink helps capture that interest, answer questions, qualify leads, automate follow-up, and guide prospects toward the right appointment.",
    primary: { label: "Get More Booking", href: "#contact" } as Cta,
    secondary: { label: "See How It Works", href: "#journey" } as Cta,
    stats: [
      "Funnels",
      "AI Booking",
      "Lead Qualification",
      "Follow-Up",
      "Reviews",
      "Campaigns",
    ],
    background: { src: "", alt: "Treatment room illustration" } as Media,
  },

  problem: {
    image: { src: "", alt: "Client after an aesthetic treatment" } as Media,
    heading: "Interest Is Easy To Generate. Turning It Into An Appointment Is The Hard Part.",
    bullets: [
      "A prospect sees your ad.",
      "They visit your page.",
      "They ask about pricing.",
      "They wonder whether a treatment is right for them.",
      "Then they leave.",
      "Without the right experience and follow-up, that interested prospect can disappear before they ever book.",
    ],
    cta: { label: "Get More Booking", href: "#contact" } as Cta,
    cards: [
      {
        icon: { src: "", alt: "" } as Media,
        title: "Treatment Questions",
        body: "Prospects often need answers before they're comfortable scheduling.",
      },
      {
        icon: { src: "", alt: "" } as Media,
        title: "Slow Responses",
        body: "A lead searching for a treatment today may not still be looking tomorrow.",
      },
      {
        icon: { src: "", alt: "" } as Media,
        title: "Abandoned Interest",
        body: "Visitors can show strong buying intent without ever completing a booking.",
      },
      {
        icon: { src: "", alt: "" } as Media,
        title: "No-Shows",
        body: "A booked appointment isn't the end of the journey. Reminders and follow-up matter.",
      },
      {
        icon: { src: "", alt: "" } as Media,
        title: "Unqualified Leads",
        body: "Your team shouldn't spend hours answering questions from prospects who aren't ready or aren't a fit.",
      },
      {
        icon: { src: "", alt: "" } as Media,
        title: "Missed Follow-Up",
        body: "Without consistent follow-up, valuable leads can quietly disappear.",
      },
    ] as ProblemCard[],
  },

  journey: {
    badge: "A BETTER EXPERIENCE FROM AD TO APPOINTMENT",
    heading: "Give Every Prospect A Clear Path To The Right Treatment.",
    body: "SmartSyncLink combines conversion-focused funnels, AI conversations, lead qualification, booking, and automated follow-up to create a smoother journey from first click to consultation.",
    steps: [
      {
        step: "01",
        title: "Attract",
        body: "Send paid traffic into a focused treatment-specific experience.",
        image: { src: "", alt: "" } as Media,
        highlight: true,
        wide: false,
      },
      {
        step: "02",
        title: "Educate",
        body: "Answer common questions and help prospects understand the next step.",
        image: { src: "", alt: "" } as Media,
        highlight: false,
        wide: true,
      },
      {
        step: "03",
        title: "Qualify",
        body: "Collect information about their needs, treatment interests, and goals.",
        image: { src: "", alt: "" } as Media,
        highlight: true,
        wide: false,
      },
      {
        step: "04",
        title: "Recommend",
        body: "Guide prospects toward the appropriate service or consultation path.",
        image: { src: "", alt: "" } as Media,
        highlight: false,
        wide: false,
      },
      {
        step: "05",
        title: "Book",
        body: "Make scheduling the next step simple.",
        image: { src: "", alt: "" } as Media,
        highlight: true,
        wide: false,
      },
      {
        step: "06",
        title: "Follow Up",
        body: "Stay connected with prospects who aren't ready to book immediately.",
        image: { src: "", alt: "" } as Media,
        highlight: false,
        wide: true,
      },
    ] as JourneyStep[],
  },
};

export type IndustryContent = typeof defaultIndustry;
