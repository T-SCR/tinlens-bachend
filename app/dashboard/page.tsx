"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  FileText,
  GaugeCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Tags,
  TrendingUp,
  Zap,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DatabaseWithRestAPI } from "@/components/ui/database-with-rest-api";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [authLoading, isAuthenticated, router]);

  const user = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : undefined);
  const savedAnalyses = useQuery(
    api.tiktokAnalyses.getUserTikTokAnalyses,
    isAuthenticated ? {} : undefined
  );

  const isLoading = authLoading || user === undefined || savedAnalyses === undefined;
  const totalAnalyses = savedAnalyses?.length ?? 0;
  const isUnlimited = user?.plan === "pro" || user?.credits === -1;
  const creditsRemaining = isUnlimited ? -1 : (user?.credits ?? 0);
  const planLabel = user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Free";

  const quickActions = useMemo(
    () => [
      {
        title: "Verify a claim",
        description: "Paste any URL, caption, or Reel to run the full agentic pipeline.",
        href: "/verify",
        icon: ShieldCheck,
      },
      {
        title: "View live trends",
        description: "See clusters rising fastest, risk bands, and flagged geographies.",
        href: "/trends",
        icon: TrendingUp,
      },
      {
        title: "Saved analyses",
        description: `${totalAnalyses} saved verdict${totalAnalyses === 1 ? "" : "s"} ready to review.`,
        href: "/analyses",
        icon: FileText,
      },
    ],
    [totalAnalyses]
  );

  const capabilityCards = [
    {
      title: "Confidence Score (0–100)",
      description: "Average score across your latest verdicts.",
      metric: isLoading ? "…" : "82",
      subtext: "Safe Mode tripped 2 times this week.",
      icon: GaugeCircle,
    },
    {
      title: "Structured Tags",
      description: "Veracity, modality, domain, and source type tags applied.",
      metric: isLoading ? "…" : "64",
      subtext: "Auto-tagged Old Footage 5× in last 24h.",
      icon: Tags,
    },
    {
      title: "Trends + Upvotes",
      description: "Community votes and newsroom escalations.",
      metric: isLoading ? "…" : "+318",
      subtext: "Highest spike: Cyclone rumor cluster.",
      icon: Activity,
    },
    {
      title: "Share-ready cards",
      description: "Myth vs Fact cards exported in the past week.",
      metric: isLoading ? "…" : "47",
      subtext: "Most shared format: Portrait / WhatsApp.",
      icon: Share2,
    },
    {
      title: "Context Check",
      description: "Recycled media detections with original timestamps.",
      metric: isLoading ? "…" : "19",
      subtext: "Auto-linked to WHO + PIB resources.",
      icon: Sparkles,
    },
    {
      title: "Velocity Alerts",
      description: "High-risk clusters escalated to your inbox.",
      metric: isLoading ? "…" : "8",
      subtext: "3 are still open for review.",
      icon: TrendingUp,
    },
  ];

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Redirecting to sign in…
      </div>
    );
  }

  return (
    <div className="space-y-10 px-4 py-12 lg:px-8">
      <div className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,_#101828,_#050607)] p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit border-white/20 bg-white/10 text-white">
            Personal dashboard
          </Badge>
          <Badge variant="outline" className="w-fit border-amber-200/40 bg-amber-100/10 text-amber-100">
            TinLens Pro launch promo: unlimited credits
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Hi {user?.firstName ?? "there"},</h1>
          <p className="text-sm text-white/70">
            Run verifications, track misinformation trends, and export evidence from one console. Landing stays public,
            but everything here is yours.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between text-white/70">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em]">
                <Zap className="h-4 w-4 text-amber-300" />
                Your balance
              </div>
              <span className="text-xs font-medium">{planLabel} plan</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-12 w-32 bg-white/20" />
            ) : (
              <p className="text-5xl font-semibold">
                {isUnlimited || creditsRemaining === -1 ? (
                  <span className="text-7xl">∞</span>
                ) : (
                  <>
                    {creditsRemaining}
                    <span className="ml-2 text-base font-normal uppercase text-white/60">credits</span>
                  </>
                )}
              </p>
            )}
            <p className="mt-1 text-sm uppercase tracking-[0.4em] text-white/50">Available credits</p>
            <div className="mt-6 rounded-2xl border border-dashed border-white/30 bg-white/5 p-4 text-sm text-white/80">
              TinLens deducts one credit per verification. Trends, dashboards, and alerts are bundled with every paid
              plan. Credits never expire.
            </div>
            {!isUnlimited && !isLoading && (
              <Button asChild size="sm" className="mt-6 bg-white text-slate-900 hover:bg-white/90">
                <Link href="/credits">
                  Top up credits <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              <BarChart2 className="h-4 w-4 text-sky-300" />
              Why credits?
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Each credit covers ingestion, Whisper transcription, semantic retrieval, veracity scoring, bilingual
              explanations, and share-card rendering. Enterprise teams can request invoices, on-prem enclaves, or auto
              top-ups.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
              Need unlimited seats or newsroom bundles? Email{" "}
              <Link href="mailto:hello@tinlens.ai" className="underline">
                hello@tinlens.ai
              </Link>{" "}
              for TinLens Pro.
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <div
            key={action.title}
            className="group rounded-3xl border border-border/50 bg-card/80 p-6 shadow-lg transition hover:-translate-y-1 hover:border-primary/40"
          >
            <action.icon className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold">{action.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
            <Button asChild variant="link" className="px-0 text-primary group-hover:text-primary/80">
              <Link href={action.href}>
                Go now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {capabilityCards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-border/40 bg-gradient-to-b from-slate-900/80 via-slate-950/50 to-slate-900/80 p-5 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <card.icon className="h-6 w-6 text-sky-300" />
              <span className="text-3xl font-semibold">{card.metric}</span>
            </div>
            <h4 className="mt-4 text-lg font-semibold">{card.title}</h4>
            <p className="mt-2 text-sm text-white/70">{card.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">{card.subtext}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-border bg-card/70 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Recent analyses</h3>
            <p className="text-sm text-muted-foreground">
              Your last {Math.min(totalAnalyses, 5)} saved verdicts with verdict tags and platform context.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/analyses">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} className="h-16 w-full" />)
          ) : savedAnalyses && savedAnalyses.length > 0 ? (
            savedAnalyses.slice(0, 5).map((analysis) => (
              <div
                key={analysis._id}
                className="rounded-2xl border border-border/60 bg-background/40 p-4 transition hover:border-primary/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {analysis.metadata?.title || "Untitled analysis"}{" "}
                      <span className="text-xs text-muted-foreground">
                        · {analysis.metadata?.platform?.toUpperCase() ?? "WEB"}
                      </span>
                    </p>
                    {analysis.factCheck && (
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Verdict: {analysis.factCheck.verdict}
                      </p>
                    )}
                  </div>
                  <Link href={`/analyses#${analysis._id}`} className="text-sm text-primary hover:underline">
                    Open case →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-6 text-center text-sm text-muted-foreground">
              No analyses yet. Run your first verification to populate this list.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[40px] border border-border/80 bg-card/80 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-semibold">System status</p>
            <p className="text-xs text-muted-foreground">All pipelines healthy. Safe Mode auto-review active.</p>
          </div>
        </div>
        <div className="mt-6">
          <DatabaseWithRestAPI />
        </div>
      </div>
    </div>
  );
}
