import HeroSection from "@/components/hero-section";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ link?: string }>;
}) {
  const { link } = await searchParams;
  
  return (
    <div className="min-h-screen">
      <HeroSection initialUrl={link} />
    </div>
  );
}
