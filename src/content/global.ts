// Everything that appears on every page: the brand mark, the top navigation
// and the footer. Kept out of the home-page document because those three are
// not the home page's — /blog and /services render the same header and footer.
//
// Live values come from site_content.global; this is the seed and the fallback.
// No imports on purpose — the seed script loads this file directly.

export type Cta = { label: string; href: string };
export type NavChild = {
  label: string;
  href: string;
  /** Only shown in mega layout — the plain dropdown is labels alone. */
  description?: string;
  icon?: Media;
};

export type NavItem = {
  label: string;
  href: string;
  /** A non-empty child list turns this into a dropdown. */
  children?: NavChild[];
  /** Wide multi-column panel with icons and descriptions instead of a list. */
  mega?: boolean;
};
/** An empty src renders the placeholder instead — see <Media>. */
export type Media = { src: string; alt: string };

export const defaultGlobal = {
  /** Where the header and footer show. all = every page; include/exclude list page keys. */
  visibility: {
    header: { mode: "all", pages: [] } as { mode: "all" | "include" | "exclude"; pages: string[] },
    footer: { mode: "all", pages: [] } as { mode: "all" | "include" | "exclude"; pages: string[] },
  },

  brand: {
    name: "SmartSyncLink",
    // Leave src empty to fall back to the built-in mark.
    logo: { src: "", alt: "SmartSyncLink" } as Media,
    logoHeight: 28,
  },

  nav: {
    items: [
      { label: "Home", href: "/", mega: false, children: [] },
      {
        label: "Solution",
        href: "#solutions",
        mega: true,
        children: [
          {
            label: "AI Voice Agent",
            href: "/solutions/ai-voice-agent",
            description:
              "Answer every call instantly, qualify leads, answer FAQs, and book appointments 24/7.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Unified Smart Inbox",
            href: "/solutions/unified-inbox",
            description:
              "Manage calls, SMS, email, Facebook, Instagram, Google Business Profile, and web chats from one organized inbox.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Smart Website",
            href: "/solutions/smart-website",
            description:
              "Launch a fast, high-converting website with integrated lead capture, booking, chat, and automation built in.",
            icon: { src: "", alt: "" },
          },
          {
            label: "AI Conversation Assistant",
            href: "/solutions/ai-conversation-assistant",
            description:
              "Engage customers across every touchpoint with intelligent, human-like conversations that convert more leads into customers.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Google Business Profile Leads",
            href: "/solutions/google-business-profile",
            description:
              "Turn calls, website clicks and booking taps from your Google Business Profile into leads your team follows up on.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Custom Automation Workflows",
            href: "/solutions/automation-workflows",
            description:
              "Automate repetitive tasks, lead nurturing, reminders, follow-ups, notifications, and customer journeys without manual work.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Expert AI",
            href: "/solutions/expert-ai",
            description:
              "An AI assistant trained on your business to answer questions, guide customers, and support your team around the clock.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Missed Call Text Back",
            href: "/solutions/missed-call-text-back",
            description:
              "Automatically text customers whenever your business misses a call, helping recover leads before they're lost.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Smart Sales Pipeline",
            href: "/solutions/sales-pipeline-crm",
            description:
              "Track every opportunity from first contact to closed deal with customizable pipelines and real-time visibility.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Website Chat Widget",
            href: "/solutions/website-chat-widget",
            description:
              "Convert more visitors into qualified leads with an AI-powered live chat experience available 24/7.",
            icon: { src: "", alt: "" },
          },
          {
            label: "Google Reviews Automation",
            href: "/solutions/google-review-automation",
            description:
              "Automatically request customer reviews after every interaction to build trust, improve rankings, and attract more customers.",
            icon: { src: "", alt: "" },
          },
        ],
      },
      { label: "Contractors", href: "/industries/contractors", mega: false, children: [] },
      { label: "Aesthetics", href: "#industries", mega: false, children: [] },
      { label: "Realtors", href: "/industries/realtors", mega: false, children: [] },
      { label: "Portfolio", href: "/portfolio", mega: false, children: [] },
      { label: "Blog", href: "/blog", mega: false, children: [] },
    ] as NavItem[],
    login: { label: "Login", href: "/login" } as Cta,
    /** The header call button: a small label over the number it dials. */
    call: { label: "Call Now", number: "+1 737 252-4262", href: "tel:+17372524262" },
    cta: { label: "Book An Appointment", href: "#contact" } as Cta,
  },

  footer: {
    about:
      "One intelligent platform to automate customer communication, manage leads, book appointments, and grow your business without the complexity of multiple tools.",
    socials: ["LinkedIn", "X", "Facebook", "YouTube", "Instagram"],
    columns: [
      {
        title: "Quick Links",
        links: [
          { label: "Home", href: "/" },
          { label: "Features", href: "#solutions" },
          { label: "Industries", href: "#industries" },
          { label: "Pricing", href: "#pricing" },
          { label: "Integrations", href: "#integrations" },
          { label: "Customer Stories", href: "#reviews" },
          { label: "About Us", href: "/about" },
          { label: "Contact", href: "#contact" },
        ] as NavItem[],
      },
      {
        title: "Solutions",
        links: [
          { label: "AI Voice Receptionist", href: "/solutions/ai-voice-agent" },
          { label: "Smart CRM", href: "/solutions/sales-pipeline-crm" },
          { label: "Unified Inbox", href: "/solutions/unified-inbox" },
          { label: "Appointment Scheduling", href: "#solutions" },
          { label: "Marketing Automation", href: "/solutions/automation-workflows" },
          { label: "Reputation Management", href: "/solutions/google-review-automation" },
          { label: "Workflow Automation", href: "/solutions/automation-workflows" },
          { label: "Business Analytics", href: "#solutions" },
        ] as NavItem[],
      },
      {
        title: "Resources",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Knowledge Base", href: "/kb" },
          { label: "Blog", href: "/blog" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "ROI Calculator", href: "/roi" },
          { label: "FAQs", href: "/faqs" },
          { label: "API Documentation", href: "/docs" },
          { label: "Release Notes", href: "/changelog" },
        ] as NavItem[],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms of Service", href: "/terms-and-conditions" },
          { label: "Cookie Policy", href: "/cookie-policy" },
          { label: "Security", href: "/security" },
          { label: "Compliance", href: "/compliance" },
          { label: "Data Processing Agreement", href: "/dpa" },
        ] as NavItem[],
      },
    ],
    newsletter: {
      heading: "Get Practical Automation Tips Delivered to Your Inbox",
      body: "Join thousands of business owners receiving proven strategies, product updates, and automation insights.",
      namePlaceholder: "Your Name",
      placeholder: "Email Address",
      phonePlaceholder: "Phone (optional)",
      businessPlaceholder: "Business name",
      industryPlaceholder: "Your industry",
      /** The industry choices; the one picked is tagged on the contact in GHL. */
      industries: ["Med Spa & Aesthetics", "Contractor & Home Services", "Real Estate", "Other"],
      note: "No spam — just practical tips. Unsubscribe anytime.",
      cta: { label: "Subscribe", href: "#subscribe" } as Cta,
      /** Shown in place of the form once the person is in GHL. */
      success: "Thanks — you're subscribed.",
    },
    contact: {
      phone: "+1 737 252-4262",
      whatsapp: "(555) 989-9218",
      email: "info@smartsynclink.com",
    },
    copyright: "© 2026 Smart Sync Link. All rights reserved.",
    badges: [
      "Enterprise-Grade Security",
      "99.9% Uptime",
      "Secure Cloud Infrastructure",
      "4.5/5 Average Rating",
    ],
  },
};

export type GlobalContent = typeof defaultGlobal;
