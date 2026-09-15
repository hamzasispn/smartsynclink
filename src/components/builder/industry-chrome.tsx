import type { GlobalContent } from "@/content/global";
import type { Industry } from "@/lib/industries";
import { FloatingSocial } from "../floating-social";

/**
 * What an industry page adds around its layout: its own logo when it has one
 * (the site's otherwise), and its floating social buttons. Shared by the live
 * page and the builder preview so both show the same chrome.
 */
export function industryChrome(industry: Industry, siteBrand: GlobalContent["brand"]) {
  const mark = industry.data.brand?.logo;
  const brand = mark?.src
    ? { ...siteBrand, logo: mark, logoHeight: industry.data.brand.logoHeight || siteBrand.logoHeight }
    : siteBrand;

  return {
    brand,
    after: <FloatingSocial instagram={industry.data.social.instagram} facebook={industry.data.social.facebook} />,
  };
}
