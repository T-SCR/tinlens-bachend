"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { Coins, Megaphone, ShieldCheck, Sparkles } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "pro",
    name: "TinLens Pro",
    price: "∞ credits",
    description: "Unlimited verifications during launch. Perfect for teams that need full access.",
    features: [
      "Unlimited verifications & share cards",
      "Live Trends + crisis alerts",
      "Dashboard + Safe Mode overrides",
      "Priority support via Signal & email",
    ],
    highlight: true,
    cta: "Included (limited time)",
  },
  {
    id: "newsroom",
    name: "Newsroom Pack",
    price: "500 credits",
    description: "Bundle credits for small teams. Auto top-ups launch soon.",
    features: [
      "5 editor seats",
      "Weekly claim digests",
      "Webhook notifications",
      "Custom share-card themes",
    ],
    cta: "Coming soon",
  },
  {
    id: "enterprise",
    name: "Enterprise / Govt",
    price: "Custom",
    description: "On-prem deployments, invoices, SLAs, and regional hosting.",
    features: [
      "Dedicated enclave",
      "Role-based dashboards",
      "Offline cache for crisis response",
      "Training + implementation support",
    ],
    cta: "Contact us",
  },
];

export default function CreditsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const creditsData = useQuery(
    api.credits.getUserCredits,
    isAuthenticated ? {} : undefined
  );

  const currentCredits = useMemo(() => {
    if (!creditsData) return undefined;
    if (creditsData.credits === -1 || creditsData.hasUnlimitedCredits || creditsData.plan === "pro") {
      return "∞";
    }
    return creditsData.credits ?? 0;
  }, [creditsData]);

  const currentPlanLabel = creditsData?.plan
    ? creditsData.plan.charAt(0).toUpperCase() + creditsData.plan.slice(1)
    : "Free";

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <section className="mx-auto max-w-3xl text-center space-y-4">
        <Badge className="gap-2 border border-primary/30 bg-primary/5 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          TinLens Credits & Plans
        </Badge>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Credits unlock the full verification pipeline
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Every credit covers ingestion, Whisper transcription, retrieval, Veracity Judge scoring, bilingual
          explanations, share-card rendering, and Safe Mode monitoring. During launch, every new TinLens account is
          upgraded to Pro with unlimited credits.
        </p>
        <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 px-5 py-3 text-sm font-medium text-amber-900 dark:text-amber-100">
          <Megaphone className="h-5 w-5 animate-pulse" />
          <span><span className="font-bold">🎉 Mumbai Hacks Special:</span> TinLens Pro (∞ credits) FREE for all participants!</span>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-[1.25fr_1fr]">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Coins className="h-5 w-5" />
              Your balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Available credits</p>
              <p className="text-5xl font-semibold text-primary">
                {authLoading ? "…" : currentCredits ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Current plan: {currentPlanLabel}</p>
            </div>
            <div className="rounded-2xl border border-dashed border-primary/40 bg-background/80 p-4 text-sm text-muted-foreground">
              TinLens deducts one credit per verification. Trends, dashboards, and alerts are bundled with any paid plan.
              Credits never expire, and we’ll roll out invoicing + auto top-ups soon.
            </div>
            {!isAuthenticated && (
              <Button asChild className="w-full">
                <Link href="/sign-up">Create a free account</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Why credits?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Credits guarantee that every verification runs the full agentic workflow instead of a demo shortcut. That
              means consistent ingestion, reasoning, and shareable outputs across the web app, Chrome extension, and mobile app.
            </p>
            <p>
              Newsrooms and civic teams can request custom terms&mdash;invoices, role-based dashboards, Signal/WhatsApp alerts,
              or on-prem deployments for sensitive missions.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn("flex flex-col", plan.highlight && "border-primary shadow-lg shadow-primary/20")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.highlight && (
                  <Badge variant="secondary" className="border border-primary/30 text-primary">
                    Launch promo
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div>
                <p className="text-3xl font-semibold">{plan.price}</p>
              </div>
              <ul className="flex-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button disabled={!plan.highlight} variant={plan.highlight ? "default" : "outline"} className="w-full">
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
