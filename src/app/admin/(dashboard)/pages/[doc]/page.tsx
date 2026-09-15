import { notFound } from "next/navigation";
import { BtnLink, PageHeader } from "@/components/admin/ui";
import { DocForm } from "@/components/admin/doc-form";
import type { DocKey } from "@/app/admin/actions";
import { defaultCookies, defaultPrivacy, defaultTerms } from "@/content/legal";
import { defaultPricingTable, defaultUsagePricing } from "@/content/pricing-pages";
import {
  getCookieContent,
  getPricingTableContent,
  getPrivacyContent,
  getTermsContent,
  getUsagePricingContent,
} from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * Editors for the standalone documents. home, blog and solutions keep their
 * own folders next to this one — a static segment wins over [doc], so they are
 * untouched.
 */
const DOCS: Record<DocKey, { title: string; subtitle: string; load: () => Promise<object>; shape: object }> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "The policy text is Markdown: ## for a numbered section, ### for a lettered sub-section. Headings feed the contents list automatically.",
    load: getPrivacyContent,
    shape: defaultPrivacy,
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "The terms text is Markdown: ## for a numbered section, ### for a lettered sub-section. Headings feed the contents list automatically.",
    load: getTermsContent,
    shape: defaultTerms,
  },
  cookies: {
    title: "Cookie Policy",
    subtitle: "The policy text is Markdown: ## for a numbered section, ### for a lettered sub-section. Headings feed the contents list automatically.",
    load: getCookieContent,
    shape: defaultCookies,
  },
  "usage-pricing": {
    title: "Transparent pricing",
    subtitle: "Every rate table: add a row, change a price, edit the note under a table. **bold** works in notes.",
    load: getUsagePricingContent,
    shape: defaultUsagePricing,
  },
  "pricing-table": {
    title: "Pricing table",
    subtitle: "Quick-start packages, platform plans, add-ons, standard features and the SEO packages.",
    load: getPricingTableContent,
    shape: defaultPricingTable,
  },
};

export default async function DocEditor({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const entry = DOCS[doc as DocKey];
  if (!entry) notFound();

  const initial = await entry.load();

  return (
    <>
      <PageHeader
        title={entry.title}
        subtitle={entry.subtitle}
        action={
          <BtnLink href="/admin/pages" variant="outline">
            Back
          </BtnLink>
        }
      />
      <DocForm docKey={doc as DocKey} initial={initial} shape={entry.shape} />
    </>
  );
}
