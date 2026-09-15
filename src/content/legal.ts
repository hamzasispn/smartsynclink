// Shape + seed copy for /privacy-policy, /terms-and-conditions and /cookie-policy.
// Live content lives in Postgres (site_content.privacy / site_content.terms);
// this is the fallback when the row is missing or the DB is unreachable.
// Text is the published policy word for word — edit the wording in the admin,
// not here, so the legal copy has one source of truth.
// No imports here on purpose — the seed script loads this file directly.

export type LegalDoc = {
  badge: string;
  title: string;
  updated: string;
  /** Optional lead paragraph above the numbered sections. */
  intro: string;
  tocLabel: string;
  /** Markdown. ## for numbered sections, ### for lettered sub-sections. */
  body: string;
};

export const defaultPrivacy: LegalDoc = {
  badge: "LEGAL",
  title: "Privacy Policy",
  updated: "Last Updated: March 2, 2026",
  intro: "",
  tocLabel: "On this page",
  body: `## 1. Introduction

Smart SyncLink (“we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website, digital platforms, automation systems, and communication services, including SMS and email messaging.

## 2. Information We Collect

We may collect the following types of information:

### a. Contact Information

We collect personal details such as your name, email address, phone number, and mailing address when you:

- Submit forms
- Book appointments
- Request information or services

### b. Communication and Consent Data

If you opt in to receive communications, we collect and maintain:

- Your messaging preferences
- Records of consent (opt-in)
- Opt-out requests and activity

### c. Usage and Device Information

We may collect data automatically through cookies, pixels, and analytics tools, including:

- IP address
- Browser type and device information
- Website interactions and behavior

### d. Service and Appointment Data

We collect details related to your interactions with our services, including:

- Appointment scheduling information
- Service inquiries and requests
- Customer support interactions

## 3. How We Use Your Information

We use your information for the following purposes:

- To provide, operate, and maintain our services
- To communicate with you regarding appointments, services, and support
- To send SMS and email communications you have explicitly opted in to receive
- To manage and document consent for compliance purposes
- To improve our website, systems, and user experience
- To ensure compliance with applicable laws, regulations, and messaging requirements

## 4. SMS and Email Communications Compliance

By providing your contact information and opting in, you consent to receive SMS and email communications from Smart SyncLink.

- Consent is not a condition of purchase
- Message frequency may vary
- Message and data rates may apply

You may opt out at any time:

- SMS: Reply STOP to unsubscribe
- SMS Help: Reply HELP for assistance
- Email: Click the unsubscribe link in any email

We maintain records of all consent and opt-out actions in accordance with applicable communication regulations.

## 5. Cookies and Tracking Technologies

We use cookies and similar technologies to:

- Enhance user experience
- Analyze website performance
- Understand user behavior

You can manage or disable cookies through your browser settings.

## 6. How We Share Your Information

We do not sell your personal information.

### a. Non-Sharing of Mobile Data

No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.

### b. Consent Protection

Text messaging originator opt-in data and consent will not be shared with any third parties under any circumstances.

### c. Service Providers

We may share information with trusted service providers who assist in operating our business (e.g., customer support tools, communication systems). These providers are only authorized to use your information as necessary to perform services on our behalf.

### d. Legal Requirements

We may disclose your information if required by law or to protect our rights, users, or business operations.

## 7. Data Security

We implement appropriate administrative, technical, and physical safeguards to protect your personal information.

While we strive to protect your data, no method of transmission over the internet or electronic storage is completely secure.

## 8. Data Retention

We retain your information only as long as necessary to:

- Provide our services
- Maintain compliance records (including communication consent)
- Resolve disputes and enforce agreements

## 9. Your Rights and Choices

You have the right to:

- Access or update your personal information
- Opt out of marketing communications at any time
- Request deletion of your data where applicable

To make a request, contact us using the information below.

## 10. Children’s Privacy

Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children.

By using our services or opting into communications, you confirm that you are at least 18 years old.

## 11. Updates to This Policy

We may update this Privacy Policy to reflect changes in our practices, legal requirements, or communication regulations. Updates will be posted with a revised “Last Updated” date.

Your continued use of our services constitutes acceptance of any updates.

## 12. Contact Information

If you have any questions about this Privacy Policy or your data, please contact:

**Smart SyncLink**

Address: 8911 N Capital of Texas Hwy, Suite 4200-349, Austin, Texas, United States, 78759

Phone: [+1 737-252-4262](tel:+17372524262)

Email: [info@smartsynclink.com](mailto:info@smartsynclink.com)
`,
};

export const defaultTerms: LegalDoc = {
  badge: "LEGAL",
  title: "Our Terms & Conditions",
  updated: "Last Updated: March 2, 2026",
  intro:
    "These Terms and Conditions (“Terms”) govern your use of Smart SyncLink services, including our website, digital platforms, automation systems, AI-powered tools, and our SMS and email communication programs. By accessing our services or opting into our communications, you agree to these Terms and our Privacy Policy.",
  tocLabel: "On this page",
  body: `## 1. Program Description

Smart SyncLink provides digital solutions including but not limited to marketing automation, customer communication systems, website development, AI-powered tools, and related support services.

As part of these services, users may receive SMS and email communications including:

- Appointment confirmations and reminders
- Service updates and account notifications
- Customer support messages
- Marketing and promotional offers (if explicitly opted in)

Message frequency varies depending on user interaction, service engagement, and communication preferences.

## 2. User Eligibility

By using our services, you confirm that:

- You are at least 18 years old
- You are legally capable of entering into binding agreements
- You are providing accurate and truthful information

Users under 18 years of age are not permitted to use our services or opt into messaging programs.

## 3. Consent to Communications

By submitting your contact information through our website, funnels, forms, or other communication channels, you expressly consent to receive communications from Smart SyncLink, including SMS, email, and automated messages.

- Consent is not a condition of purchase
- Messaging may be sent using automated systems or AI-powered tools
- Message frequency may vary
- Standard message and data rates may apply

You may opt in separately for:

- Service-related communications (required for service delivery)
- Marketing/promotional communications (optional)

## 4. Opt-Out Instructions

You may opt out of SMS communications at any time by replying:

**STOP**

After sending "STOP," you will receive a confirmation message and will no longer receive SMS messages unless you re-subscribe.

For email communications, you may unsubscribe using the link provided in any email.

## 5. Re-Subscription

To rejoin SMS communications, you may:

- Re-submit your information through our forms, or
- Opt in again through any of our official channels

Once re-subscribed, messaging will resume based on your preferences.

## 6. Help and Support

For assistance:

- Reply HELP to any SMS message
- Email: [info@smartsynclink.com](mailto:info@smartsynclink.com)
- Phone: [+1 737-252-4262](tel:+17372524262)

We aim to respond to all inquiries within a reasonable timeframe.

## 7. Message Frequency and Charges

Message frequency varies depending on:

- Your engagement with our services
- Active workflows, automations, or campaigns

Message and data rates may apply. Please contact your mobile carrier for details regarding your plan.

## 8. Carrier Disclaimer

Mobile carriers are not responsible for delayed or undelivered messages.

## 9. Data Usage and Privacy

Your information will be handled in accordance with our Privacy Policy. We use your data to:

- Deliver services
- Operate our systems and automation tools
- Provide customer support
- Improve user experience

We do not sell or share your personal data with third parties for their marketing purposes.

For full details, please review our Privacy Policy:

[https://smartsynclink.com/privacy-policy](/privacy-policy)

## 10. Acceptable Use

You agree not to:

- Use our services for unlawful, fraudulent, or abusive activities
- Attempt to disrupt or interfere with our systems or platforms
- Send unauthorized, misleading, or spam communications

Violation of these terms may result in suspension or termination of services.

## 11. Modifications to Terms

We reserve the right to update these Terms at any time to comply with legal, regulatory, or carrier requirements. Updates will be reflected with a revised “Last Updated” date.

Continued use of our services constitutes acceptance of the updated Terms.

## 12. Contact Information

If you have any questions regarding these Terms, please contact:

**Smart SyncLink**

Address: 8911 N Capital of Texas Hwy, Suite 4200-349, Austin, Texas, United States, 78759

Phone: [+1 737-252-4262](tel:+17372524262)

Email: [info@smartsynclink.com](mailto:info@smartsynclink.com)
`,
};

export const defaultCookies: LegalDoc = {
  badge: "LEGAL",
  title: "Cookie Policy",
  updated: "Last Updated: September 15, 2026",
  intro: "",
  tocLabel: "On this page",
  body: `## 1. What Are Cookies

Cookies are small text files a website stores in your browser. They help a site work properly, keep you signed in, and remember choices you make. Similar technologies, such as local storage, work the same way and are covered by this policy too.

## 2. How We Use Cookies

Smart SyncLink keeps cookie use to a minimum. We do not currently use cookies for advertising, analytics, or tracking you across other websites.

### a. Strictly Necessary Cookies

Some parts of our website need a small cookie to work — for example, keeping an authorized account securely signed in. These cookies are essential, contain no advertising data, and cannot be switched off in our systems.

### b. Third-Party Services

Some features on our website are provided by trusted partners and load inside our pages, such as our appointment booking calendar and forms, or embedded videos. When you use these features, the provider may set its own cookies to run the service, remember your selections, and prevent spam. Those cookies are governed by the provider's own privacy and cookie policies.

## 3. Cookies We Do Not Use

We do not use advertising or retargeting cookies, and we do not sell or share cookie information with advertisers.

## 4. Managing Cookies

You can control and delete cookies at any time through your browser settings, including blocking all cookies or only third-party cookies. Please note that blocking strictly necessary cookies may stop some features, such as the booking calendar, from working correctly.

## 5. Changes to This Policy

If we begin using additional cookies — such as analytics to improve our website — we will update this page with a revised “Last Updated” date and, where required by law, ask for your consent first.

## 6. Contact Information

If you have any questions about this Cookie Policy, please contact:

Smart SyncLink

Address: 8911 N Capital of Texas Hwy, Suite 4200-349, Austin, Texas, United States, 78759

Phone: [+1 737-252-4262](tel:+17372524262)

Email: [info@smartsynclink.com](mailto:info@smartsynclink.com)
`,
};
