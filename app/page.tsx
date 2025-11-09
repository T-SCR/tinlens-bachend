import HeroSection from "@/components/hero-section";
import { EnhancedHero } from "@/components/enhanced-hero";
import { RedesignedHowItWorks } from "@/components/redesigned-how-it-works";
import { FinalCTA } from "@/components/final-cta";
import { FeaturesSection } from "@/components/features-section";
import { TrustedSourcesSection } from "@/components/trusted-sources-section";

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
      {showEnhancedHero ? (
        <EnhancedHero />
      ) : (
        <HeroSection initialUrl={link} />
      )}
      <TrustedSourcesSection />
      <FeaturesSection />
      <RedesignedHowItWorks />
      <FinalCTA />
    </div>
  );
}
