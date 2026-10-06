// Shape + seed copy for /solutions.
// Live content lives in Postgres (site_content.solutions); this is the fallback
// the page renders when the row is missing or the DB is unreachable.
// No imports here on purpose — the seed script loads this file directly.

export type Cta = { label: string; href: string };
export type Media = { src: string; alt: string };

export type SolutionCard = {
  title: string;
  tagline: string;
  body: string;
  bullets: string[];
  cta: Cta;
  /** the solution's own page, linked from the title and "Learn more" */
  href: string;
  image: Media;
};

const card = (
  title: string,
  tagline: string,
  body: string,
  bullets: string[],
  label: string,
  slug: string,
): SolutionCard => ({
  title,
  tagline,
  body,
  bullets,
  cta: { label, href: "#contact" },
  href: `/solutions/${slug}`,
  image: { src: "", alt: title },
});

export const defaultSolutions = {
  badge: "THE SMARTSYNCLINK SYSTEM",
  heading: "Every Customer Interaction. Connected, Automated, And Built To Convert.",
  body: "SmartSyncLink brings AI, communication, websites, automation, and sales management together in one connected system.",
  body2:
    "Capture the lead. Respond instantly. Start the conversation. Follow up automatically. Move the opportunity forward.",

  /** Sits above the bullets in every card. */
  bestForLabel: "Best for:",

  cards: [
    card(
      "AI Voice Agent",
      "Never Leave A Customer Talking To Silence.",
      "An AI voice agent can answer calls instantly, qualify leads, answer frequently asked questions, and help book appointments around the clock.",
      [
        "Incoming calls",
        "Lead qualification",
        "FAQs",
        "Appointment booking",
        "After-hours inquiries",
      ],
      "Book AI Voice Agent",
      "ai-voice-agent",
    ),
    card(
      "AI Conversation Assistant",
      "Keep Every Conversation Moving.",
      "Engage customers across touchpoints with intelligent, human-like conversations designed to answer questions, follow up, and move prospects toward the next step.",
      [
        "Lead conversations",
        "Follow-up",
        "Customer questions",
        "Qualification",
        "Appointment opportunities",
      ],
      "Book AI Conversation Assistant",
      "ai-conversation-assistant",
    ),
    card(
      "Expert AI",
      "AI That Understands Your Business.",
      "Give your AI the knowledge it needs to answer questions, guide customers, and support your team with responses tailored around your business.",
      [
        "Business knowledge",
        "Customer support",
        "FAQs",
        "Internal assistance",
        "Consistent answers",
      ],
      "Book Expert AI",
      "expert-ai",
    ),
    card(
      "Website Chat Widget",
      "Turn Website Visitors Into Conversations.",
      "Give visitors an immediate way to ask questions, get assistance, and connect with your business without waiting for someone to respond manually.",
      [
        "Website visitors",
        "Lead capture",
        "Customer questions",
        "Qualification",
        "24/7 engagement",
      ],
      "Book Website Chat",
      "website-chat-widget",
    ),
    card(
      "Unified Smart Inbox",
      "Every Conversation. One Place.",
      "Manage calls, SMS, email, Facebook, Instagram, Google Business Profile, and website conversations from one connected inbox.",
      [
        "Multi-channel communication",
        "Team collaboration",
        "Lead management",
        "Customer conversations",
        "Faster responses",
      ],
      "Book Smart Inbox",
      "unified-inbox",
    ),
    card(
      "Google Business Profile Leads",
      "Turn Google Searches Into Leads.",
      "When someone finds you on Google Search or Maps and taps call, website or book, SmartSyncLink answers, captures the lead and follows up — so your Google Business Profile brings in customers, not just views.",
      [
        "Google Search & Maps",
        "Calls from your profile",
        "Local businesses",
        "Lead capture",
        "Faster follow-up",
      ],
      "Book Google Profile Leads",
      "google-business-profile",
    ),
    card(
      "Missed Call Text Back",
      "A Missed Call Shouldn't Mean A Lost Customer.",
      "When your team can't answer, SmartSyncLink can automatically send a text so the conversation can continue instead of ending with a missed call.",
      [
        "Missed calls",
        "Lead recovery",
        "After-hours inquiries",
        "Service businesses",
        "Faster follow-up",
      ],
      "Book Missed Call Text Back",
      "missed-call-text-back",
    ),
    card(
      "Google Reviews Automation",
      "Turn Customer Experiences Into More Reviews.",
      "Make review requests part of your customer journey by automatically reaching out after interactions and encouraging customers to share their experience.",
      [
        "Review requests",
        "Reputation building",
        "Customer follow-up",
        "Google reviews",
        "Social proof",
      ],
      "Book Review Automation",
      "google-review-automation",
    ),
    card(
      "Smart Website",
      "A Website That Does More Than Look Good.",
      "Launch a fast, high-converting website with lead capture, booking, chat, and automation built into the experience.",
      [
        "Lead generation",
        "Service businesses",
        "Booking",
        "Conversion",
        "Customer experience",
      ],
      "Book Smart Websites",
      "smart-website",
    ),
    card(
      "Custom Automation Workflows",
      "Make Repetitive Work Happen Automatically.",
      "Connect the steps your team repeats every day and build workflows around lead nurturing, reminders, follow-ups, notifications, and customer journeys.",
      [
        "Lead nurturing",
        "Follow-up",
        "Reminders",
        "Notifications",
        "Customer workflows",
      ],
      "Book Automation",
      "automation-workflows",
    ),
    card(
      "Smart Sales Pipeline",
      "Know Where Every Opportunity Stands.",
      "Track opportunities from first contact to closed deal with customizable pipelines and real-time visibility into your sales process.",
      [
        "Lead tracking",
        "Opportunity management",
        "Sales pipelines",
        "Team visibility",
        "Conversion tracking",
      ],
      "Book Sales Pipeline",
      "sales-pipeline-crm",
    ),
  ] as SolutionCard[],
};

export type SolutionsContent = typeof defaultSolutions;
