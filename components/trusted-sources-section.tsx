"use client";

import { LogoCarousel } from "@/components/ui/logo-carousel";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { trustedSourceLogos } from "@/components/trusted-sources-logos";

export function TrustedSourcesSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <GradientHeading size="lg" variant="secondary" className="mb-2">
            Trusted by fact-checkers worldwide
          </GradientHeading>
          <p className="text-muted-foreground">
            We verify against the most credible sources
          </p>
        </div>

        <div className="flex justify-center">
          <LogoCarousel columnCount={4} logos={trustedSourceLogos} />
        </div>
      </div>
    </section>
  );
}
