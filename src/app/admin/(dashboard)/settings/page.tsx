import { PageHeader } from "@/components/admin/ui";
import { AiConnection } from "@/components/admin/ai-connection";
import { GlobalForm } from "@/components/admin/global-form";
import { getAiStatus } from "@/lib/ai-settings";
import { getGlobalContent } from "@/lib/content";

export default async function SettingsPage() {
  const [global, ai] = await Promise.all([getGlobalContent(), getAiStatus()]);

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Brand, the navigation and footer every page shares, and the AI connection."
      />

      <div className="space-y-8">
        <AiConnection status={ai} />

        <section>
          <h2 className="mb-1.5 text-[16px] font-medium text-[#1e1e1e]">
            Brand, navigation & footer
          </h2>
          <p className="mb-4 text-[15px] text-muted">
            These render on every page — home, services and blog alike.
          </p>
          <GlobalForm initial={global} />
        </section>
      </div>
    </>
  );
}
