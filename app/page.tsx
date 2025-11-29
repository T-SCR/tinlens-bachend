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
import { BrowserExtensionSection } from "@/components/sections/browser-extension";
import { AnalysisShowcaseSection } from "@/components/sections/analysis-showcase";
import { DocsPreviewSection } from "@/components/sections/docs-preview";
import { RedirectAuthenticated } from "@/components/redirect-authenticated";
import { Header } from "@/components/ui/header-2";

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
    <div className="relative">
      <RedirectAuthenticated />
      <Header />
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
      <AnalysisShowcaseSection />
      <BrowserExtensionSection />
      <ShareCardLab />
      <FeaturesSection />
      <UseCasesSection />
      <RedesignedHowItWorks />
      <DocsPreviewSection />
      <FinalCTA />
    </div>
  );
}
