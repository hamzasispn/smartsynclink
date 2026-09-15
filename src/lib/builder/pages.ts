import { listIndustries } from "../industries";

/** A page the builder can open. `key` is what layouts are stored under. */
export type BuilderPage = {
  key: string;
  label: string;
  path: string;
  group: "Pages" | "Industries" | "Legal";
};

export const STATIC_PAGES: BuilderPage[] = [
  { key: "home", label: "Home", path: "/", group: "Pages" },
  { key: "solutions", label: "Solutions", path: "/solutions", group: "Pages" },
  { key: "blog", label: "Blog", path: "/blog", group: "Pages" },
  { key: "usage-pricing", label: "Transparent pricing", path: "/transparent-pricing", group: "Pages" },
  { key: "pricing-table", label: "Pricing table", path: "/pricing-table", group: "Pages" },
  { key: "privacy", label: "Privacy Policy", path: "/privacy-policy", group: "Legal" },
  { key: "terms", label: "Terms & Conditions", path: "/terms-and-conditions", group: "Legal" },
];

export const industryKey = (slug: string) => `industry:${slug}`;

/** Every page the builder offers, industries included (drafts too — they can be built before going live). */
export async function listBuilderPages(): Promise<BuilderPage[]> {
  const industries = await listIndustries(true);
  return [
    ...STATIC_PAGES,
    ...industries.map((i) => ({
      key: industryKey(i.slug),
      label: i.name,
      path: `/industries/${i.slug}`,
      group: "Industries" as const,
    })),
  ];
}

export async function findBuilderPage(key: string) {
  return (await listBuilderPages()).find((p) => p.key === key) ?? null;
}
