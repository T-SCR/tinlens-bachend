import HeroSection from "@/components/hero-section";
import { EnhancedHero } from "@/components/enhanced-hero";
import { RedesignedHowItWorks } from "@/components/redesigned-how-it-works";
import { FinalCTA } from "@/components/final-cta";
import { FeaturesSection } from "@/components/features-section";
import { TrustedSourcesSection } from "@/components/trusted-sources-section";
import { StatStrip } from "@/components/sections/stat-strip";
import { FeatureShowcase } from "@/components/sections/feature-showcase";
import { UseCasesSection } from "@/components/sections/use-cases";
import { ShareCardLab } from "@/components/sections/share-card-lab";
import { DocsPreviewSection } from "@/components/sections/docs-preview";
import { DatabaseWithRestAPI } from "@/components/ui/database-with-rest-api";
import { RedirectAuthenticated } from "@/components/redirect-authenticated";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ link?: string }>;
}) {
  const { link } = await searchParams;
  
  // If there's a link in params, show the original hero with analysis
  // Otherwise show the enhanced animated hero
  const showEnhancedHero = !link;
  
  return (
    <div>
      <RedirectAuthenticated />
      {showEnhancedHero ? (
        <EnhancedHero />
      ) : (
        <HeroSection initialUrl={link} />
      )}
      <div className="px-4">
        <div className="mx-auto max-w-7xl">
          <StatStrip />
        </div>
      </div>
      <TrustedSourcesSection />
      <FeatureShowcase />
      <ShareCardLab />
      <section className="bg-muted/20 py-24" id="stack">
        <div className="container mx-auto max-w-6xl px-4">
          <DatabaseWithRestAPI />
        </div>
      </section>
      <FeaturesSection />
      <UseCasesSection />
      <RedesignedHowItWorks />
      <DocsPreviewSection />
      <FinalCTA />
    </div>
  );
}
