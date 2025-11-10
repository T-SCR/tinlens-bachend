"use client";

import { GradientHeading } from "@/components/ui/gradient-heading";
import { Features8 } from "@/components/ui/features-8";

export function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <GradientHeading size="xl" className="mb-4">
            Core TinLens capabilities
          </GradientHeading>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Confidence scores with transparent sub-metrics, Safe Mode fallbacks, tags, crisis
            alerts, and share cards—available across the web app, Chrome extension, and mobile
            app.
          </p>
        </div>

        <Features8 />
      </div>
    </section>
  );
}
