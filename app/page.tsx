import { NewHeroSection } from "@/components/new-hero-section";
import { RedesignedHowItWorks } from "@/components/redesigned-how-it-works";
import { FinalCTA } from "@/components/final-cta";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ link?: string }>;
}) {
  const { link } = await searchParams;
  return (
    <div>
      <NewHeroSection initialUrl={link} />
      <RedesignedHowItWorks />
      <FinalCTA />
    </div>
  );
}
