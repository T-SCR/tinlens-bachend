"use client";

import { useMemo } from "react";
import { Coins, ShieldCheck, Sparkles, Megaphone } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKS } from "@/lib/plans";

export default function CreditsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const creditsData = useQuery(
    api.credits.getUserCredits,
    isAuthenticated ? {} : undefined
  );

  const currentCredits = useMemo(() => creditsData?.credits ?? 0, [creditsData]);
  const currentPlanLabel = creditsData?.plan
    ? creditsData.plan.charAt(0).toUpperCase() + creditsData.plan.slice(1)
    : "Free";

  const handlePlanClick = () => {
    toast.info("Launch special", {
      description:
        "Every new signup is automatically upgraded to TinLens Pro for a limited time.",
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <section className="mx-auto max-w-3xl text-center space-y-4">
        <BadgeHeading />
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Manage your TinLens credits
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Credits power every real analysis—no demo modes, no synthetic answers.
          During launch, every new signup is automatically upgraded to TinLens
          Pro with unlimited verifications.
        </p>
        <div className="mx-auto flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
          <Megaphone className="h-4 w-4" />
          <span>Limited-time launch promo: Free Pro plan for new accounts.</span>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-[1.25fr_1fr]">
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Coins className="h-5 w-5" />
              Your balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Available credits
              </p>
              <p className="text-4xl font-bold text-primary">
                {isLoading
                  ? "—"
                  : currentCredits === -1
                    ? "∞"
                    : currentCredits}
              </p>
              {creditsData && (
                <p className="text-sm text-muted-foreground mt-1">
                  Current plan: {currentPlanLabel}
                </p>
              )}
            </div>
            <div className="rounded-xl border border-dashed border-primary/40 bg-background/80 p-4 text-sm text-muted-foreground">
              TinLens deducts one credit per verification request. Trend
              tracking, dashboards, and alerts are included in every paid plan.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Why credits?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Each credit covers full ingestion: transcription, retrieval,
              evidence scoring, verdict explanation, and share-card rendering.
            </p>
            <p>
              Credits never expire. Enterprise and newsroom teams can request
              invoices or auto top-ups. Contact us for Mumbai Hacks partner
              programmes.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {CREDIT_PACKS.map((plan) => (
          <Card
            key={plan.id}
            className={plan.highlight ? "border-primary shadow-lg" : ""}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.name}</span>
                {plan.highlight && (
                  <span className="text-xs uppercase tracking-widest text-primary">
                    Popular
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div>
                <p className="text-3xl font-semibold">{plan.priceLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {plan.planTier === "pro"
                    ? "Unlimited analyses"
                    : `${plan.credits} credits`}
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.highlight ? "default" : "outline"}
                onClick={handlePlanClick}
                disabled
              >
                {plan.planTier === "pro" ? "Included for now" : "Coming soon"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

function BadgeHeading() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
      <Sparkles className="h-3 w-3" />
      TinLens Credits
    </span>
  );
}
