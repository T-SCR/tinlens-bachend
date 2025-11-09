import { CTASection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeatureShowcase } from "@/components/sections/feature-showcase"
import { SecuritySection } from "@/components/sections/security-section"
import { SocialProof } from "@/components/sections/social-proof"
import { StatStrip } from "@/components/sections/stat-strip"
import { TrendsAndTeams } from "@/components/sections/trends-teams"
import { UseCasesSection } from "@/components/sections/use-cases"

export function HomePageContent() {
  return (
    <>
      <HeroSection />
      <StatStrip />
      <FeatureShowcase />
      <HowItWorks />
      <UseCasesSection />
      <TrendsAndTeams />
      <SocialProof />
      <SecuritySection />
      <CTASection />
    </>
  )
}
