import { CTASection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeatureShowcase } from "@/components/sections/feature-showcase"
import { SecuritySection } from "@/components/sections/security-section"
import { SocialProof } from "@/components/sections/social-proof"
import { StatStrip } from "@/components/sections/stat-strip"
import { UseCasesSection } from "@/components/sections/use-cases"
import { FactCheckerLogos } from "@/components/sections/fact-checker-logos"

export function HomePageContent() {
  return (
    <>
      <HeroSection />
      <StatStrip />
      <FeatureShowcase />
      <HowItWorks />
      <FactCheckerLogos />
      <UseCasesSection />
      <SocialProof />
      <SecuritySection />
      <CTASection />
    </>
  )
}
