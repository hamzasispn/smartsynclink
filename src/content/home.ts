// Shape + seed data for the home page.
// Live content lives in Postgres (site_content.home); this is the fallback the
// page renders when the row is missing or the DB is unreachable.
// No imports here on purpose — the seed script loads this file directly.

export type Cta = { label: string; href: string };
export type Bullet = { title: string; body?: string };
/** An empty src renders the placeholder instead — see <Media>. */
export type Media = { src: string; alt: string };

export const defaultHomeContent = {
  hero: {
    heading: "Never Lose Another Lead Again.",
    subheading:
      "AI answers calls, replies to messages, books appointments, follows up automatically and helps your business close more customers without hiring more staff.",
    image: { src: "/images/hero-img.png", alt: "Business owner working on a laptop" } as Media,
    // More than one turns the hero backdrop into a slow crossfade.
    backgrounds: [
      { src: "/images/hero-bg.png", alt: "" },
    ] as Media[],
    backgroundSeconds: 7,
    primary: { label: "Book Your Free Strategy Call", href: "#contact" } as Cta,
    secondary: { label: "Watch 3-Minute Demo", href: "#demo" } as Cta,
    stats: [
      "Trusted By 3,000+ Businesses",
      "250,000+ Leads Managed",
      "500K+ Appointments Booked",
      "92.9% Uptime",
      "4.5/5 Average Rating",
    ],
  },

  heroVideo: {
    label: "Intro video",
    video: { src: "", alt: "" } as Media,
  },

  showcaseVideo: {
    label: "Product walkthrough",
    video: { src: "", alt: "" } as Media,
  },

  intro: {
    heading: "Lorem Ipsum is simply dummy text of the printing",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1968, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets.",
    bullets: [
      "Lorem Ipsum is simply dummy text of the printing.",
      "Lorem Ipsum is simply dummy text of the printing.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    ],
    body2:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1968, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets.",
    primary: { label: "Book Your Free Strategy Call", href: "#contact" } as Cta,
    secondary: { label: "Learn more about funnel", href: "#funnel" } as Cta,
    image: { src: "", alt: "Websites built with Smart Sync Link" } as Media,
  },

  bento: {
    intro: {
      eyebrow: "The Complete Solution",
      heading: "Simple systems that actually work",
      body: "Smart Sync Link automates every stage of your customer journey, from the first phone call to the final follow-up, so your team can focus on growing the business instead of managing repetitive tasks.",
      image: { src: "", alt: "AI assistant illustration" } as Media,
    },
    voice: {
      heading: "Smart Voice AI",
      body: "Get an AI receptionist that instantly answers calls, routes them, and books appointments directly to your calendar.",
      bullets: [
        {
          title: "Never Miss A Call",
          body: "If a customer calls your business and you can't answer, our AI will handle it naturally.",
        },
        {
          title: "Intelligent Routing",
          body: "The AI knows who to forward urgent calls to and who to schedule for later.",
        },
        {
          title: "24/7 Availability",
          body: "Missed a call after hours? No worries, we'll make sure everyone gets helped while you sleep.",
        },
      ] as Bullet[],
      cta: { label: "Watch 3-Minute Demo", href: "#demo" } as Cta,
    },
    inbox: {
      heading: "All-In-One Smart Inbox",
      body: "Stop checking five different apps. We combine SMS, Email, and Social DMs into one clean interface.",
      bullets: [
        {
          title: "Centralized Communication",
          body: "Facebook messages, Instagram DMs, SMS, and Emails all flow into one easy-to-use inbox.",
        },
        {
          title: "Team Collaboration",
          body: "Assign conversations to team members so nothing falls through the cracks.",
        },
        {
          title: "Quick Responses",
          body: "Use templates and AI-suggested replies to handle common questions instantly.",
        },
      ] as Bullet[],
      cta: { label: "Watch 3-Minute Demo", href: "#demo" } as Cta,
      image: { src: "", alt: "Smart inbox interface" } as Media,
    },
    campaigns: {
      heading: "One-Click Marketing Campaigns",
      body: "You know it, and we know it... Referrals and repeat customers are the best. Let's get you both!",
      cta: { label: "Watch 3-Minute Demo", href: "#demo" } as Cta,
      image: { src: "/images/campaigns.webp", alt: "Team reviewing a campaign" } as Media,
    },
  },

  industries: {
    heading: "Specialized systems for your industry",
    subheading:
      "We've built custom, battle-tested solutions specifically designed for these core industries.",
    cards: [
      {
        title: "Real Estate",
        body: "Automate lead follow-ups, schedule showings, and keep your pipeline full without lifting a finger.",
        image: { src: "/images/real-estate.png", alt: "Modern multi-storey home" } as Media,
        cta: { label: "Book Now", href: "#contact" } as Cta,
      },
      {
        title: "Aesthetics & Medspas",
        body: "Fill your booking calendar, handle patient inquiries 24/7, and run automated reactivation campaigns.",
        image: { src: "/images/med-spa.png", alt: "Medspa client after treatment" } as Media,
        cta: { label: "Book Now", href: "#contact" } as Cta,
      },
      {
        title: "Contractors",
        body: "Never miss an estimate request. Our AI answers calls from the job site and books appointments instantly.",
        image: { src: "/images/constrution.png", alt: "Contractor holding blueprints" } as Media,
        cta: { label: "Book Now", href: "#contact" } as Cta,
      },
    ],
  },

  steps: {
    badge: "HOW IT WORKS",
    heading: "From Strategy to Automation in Just 3 Simple Steps",
    subheading:
      "Getting started is simple. Our team handles the heavy lifting while you focus on running your business.",
    items: [
      {
        step: "Step 1",
        title: "Discovery Call",
        duration: "20 mins",
        body: "It's actually a strategy call. We'll answer all your questions, show you how our AI works, and look at live client accounts & results.",
      },
      {
        step: "Step 2",
        title: "We Build Your System",
        duration: "7-10 days",
        body: "Fill out a basic onboarding form with your details. After we have the info, we get to work building your custom AI & marketing system.",
      },
      {
        step: "Step 3",
        title: "Launch Call",
        duration: "25 mins",
        body: "We'll walk you through your new system, show you how everything works... And by everything, we're really just talking about pressing two buttons.",
      },
    ],
  },

  pricing: {
    badge: "Pricing",
    heading: "Simple, transparent pricing",
    subheading:
      "Choose the package that fits your business needs. No hidden fees, no long-term contracts.",
    watermark: "PRICING",
    period: "/month",
    plans: [
      {
        name: "Sync Starter",
        price: "$197",
        tagline: "Capture leads and respond instantly.",
        featured: false,
        badge: "",
        features: [
          "Mobile App Access",
          "A2P Direct Phone Verification",
          "Conversation AI",
          "Unified Inbox",
          "Missed Call Text-Back",
          "AI Web Widget",
          "Smart Website",
        ],
        cta: { label: "Book A Call Now", href: "#contact" } as Cta,
      },
      {
        name: "Smart Site Link",
        price: "$297",
        tagline: "Dominate Google and grow your brand.",
        featured: true,
        badge: "Most Popular",
        features: [
          "Mobile App Access",
          "A2P Direct Phone Verification",
          "Conversation AI",
          "Unified Inbox",
          "Missed Call Text-Back",
          "GMB AI Messenger",
          "Google Reviews System",
          "CRM & Pipeline Management",
          "Custom Website / Update Current Site",
          "Fully Hosted Ecosystem",
        ],
        cta: { label: "Book A Call Now", href: "#contact" } as Cta,
      },
      {
        name: "Elite Link",
        price: "$497",
        tagline: "Full AI automation that runs your business.",
        featured: false,
        badge: "",
        features: [
          "Mobile App Access",
          "A2P Direct Phone Verification",
          "Conversation AI",
          "Unified Inbox",
          "Missed Call Text-Back",
          "GMB AI Messenger",
          "Google Reviews System",
          "Social Media Planner",
          "CRM & Pipeline Management",
          "Custom High-Converting Website",
          "24/7 Voice AI Agent",
          "Expert AI Assistant",
          "Advanced Workflow Automations",
        ],
        cta: { label: "Book A Call Now", href: "#contact" } as Cta,
      },
    ],
  },

  testimonials: {
    eyebrow: "TRUSTED BY GROWING BUSINESSES",
    heading: "Real Businesses. Real Growth. Real Results.",
    subheading:
      "See how businesses are capturing more leads, and saving hours every week with Smart Sync Link.",
    avatars: ["a1", "a2", "a3", "a4", "a5"],
    reviews: [
      {
        rating: 5,
        quote:
          "If you are looking for someone to get that phone ringing, they're the right fit for you! I'm so happy with them!",
        author: "Cody",
      },
      {
        rating: 5,
        quote:
          "They are the absolute best at what they do. They built me a new system and within 10 days I got my first unpaid for lead! Best money spent.",
        author: "Armando",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ's",
    heading: "Everything You Need to Know Before Getting Started",
    items: [
      {
        q: "When am I going to start seeing results?",
        a: "Most clients see their first automated bookings within the first two weeks of launch, once the system is live and answering calls.",
      },
      {
        q: "How long does implementation take?",
        a: "Typically 7-10 business days from the completed onboarding form to a fully live system.",
      },
      {
        q: "Will it work for my industry?",
        a: "We have battle-tested builds for real estate, aesthetics and medspas, and contractors, and the platform adapts to most service businesses.",
      },
      {
        q: "Can I keep my existing phone number?",
        a: "Yes. We port or forward your existing number so your customers never notice a change.",
      },
      {
        q: "Can the AI answer calls after business hours?",
        a: "Yes. The voice agent runs 24/7, books appointments, and escalates urgent calls based on rules you set.",
      },
      {
        q: "Does Smart Sync Link integrate with my existing tools?",
        a: "We connect to most calendars, CRMs, and payment tools, and offer an API for anything custom.",
      },
      {
        q: "Is my customer data secure?",
        a: "All data is encrypted in transit and at rest on enterprise-grade cloud infrastructure.",
      },
      {
        q: "Will my team receive training?",
        a: "Every plan includes a live onboarding walkthrough plus recorded training for new staff.",
      },
      {
        q: "What kind of support do you offer?",
        a: "Email and chat support on every plan, with priority response and a dedicated manager on Elite Link.",
      },
      {
        q: "Do I need technical experience?",
        a: "None. We build, configure, and launch the whole system for you.",
      },
      {
        q: "What happens if I decide to cancel?",
        a: "There are no long-term contracts. Cancel any time and we will export your data for you.",
      },
    ],
  },

  finalCta: {
    heading: "Every Day You Wait Is Another Day of Missed Leads and Lost Revenue.",
    body: "Stop relying on manual processes. Let Smart Sync Link automate your customer journey, capture every opportunity, and help your business grow with confidence.",
    cta: { label: "Book A Call Now", href: "#contact" } as Cta,
    orbLabel: "Smart AI Assistant",
    pill: { label: "Try Now", href: "#contact" } as Cta,
    chips: [
      "AI answers calls",
      "AI replies to messages",
      "AI books appointments",
      "AI follows up automatically",
    ],
  },
};

export type HomeContent = typeof defaultHomeContent;
