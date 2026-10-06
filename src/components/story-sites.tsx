import type { ComponentType } from "react";
import type { Story } from "@/lib/stage-intro";
import { CONTRACTOR_CALL, ContractorSite, ContractorSiteMobile } from "./contractor-site";
import { REALTOR_CALL, RealtorSite, RealtorSiteMobile } from "./realtor-site";
import { MEDSPA_CALL, type SiteMode, VisitorSite, VisitorSiteMobile } from "./site-mockup";

/**
 * The drawn website each story opens on, desktop and phone, and where its call
 * button is. All three put the form, the phone's call button and the chat in
 * the same places, so the Suite intro and the Site section's pins fit any of
 * them; only the desktop call button moves.
 */
export const SITES: Record<
  Story,
  { Desktop: ComponentType<{ mode?: SiteMode }>; Mobile: ComponentType<{ mode?: SiteMode }>; call: [number, number] }
> = {
  medspa: { Desktop: VisitorSite, Mobile: VisitorSiteMobile, call: MEDSPA_CALL },
  contractor: { Desktop: ContractorSite, Mobile: ContractorSiteMobile, call: CONTRACTOR_CALL },
  realtor: { Desktop: RealtorSite, Mobile: RealtorSiteMobile, call: REALTOR_CALL },
};
