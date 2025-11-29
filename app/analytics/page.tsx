"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { BarChart3, Activity, AlertTriangle, TrendingUp } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for demo
const MOCK_STATS = {
  totalAnalyses: 156,
  requiresFactCheck: 42,
  hasNewsContent: 89,
  factCheckSummary: {
    verifiedTrue: 45,
    verifiedFalse: 38,
    misleading: 28,
    unverifiable: 15,
    needsVerification: 30,
  },
};

const MOCK_VIRAL = [
  { title: "Viral health claim about vaccines", views: 2300000, verdict: "false" },
  { title: "Political speech analysis", views: 1800000, verdict: "misleading" },
  { title: "Breaking news verification", views: 1200000, verdict: "verified" },
  { title: "Celebrity endorsement check", views: 890000, verdict: "false" },
  { title: "Financial advice analysis", views: 650000, verdict: "unverifiable" },
];

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();

  if (!authLoading && !isAuthenticated) {
    router.replace("/sign-in");
    return null;
  }

  if (authLoading) {
    return (
      <DashboardShell>
        <div className="space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Using mock data for demo
  const totalAnalyses = MOCK_STATS.totalAnalyses;
  const requiresFactCheck = MOCK_STATS.requiresFactCheck;
  const hasNewsContent = MOCK_STATS.hasNewsContent;
  const factSummary = MOCK_STATS.factCheckSummary;
  const topViral = MOCK_VIRAL;

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Usage stats, verdict trends, and high-impact content across your workspace.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Total analyses</span>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardTitle>
              <CardDescription className="mt-2 text-2xl font-bold">
                {totalAnalyses}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Needs fact-check</span>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardTitle>
              <CardDescription className="mt-2 text-2xl font-bold">
                {requiresFactCheck}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>News content</span>
                <Activity className="h-4 w-4 text-emerald-500" />
              </CardTitle>
              <CardDescription className="mt-2 text-2xl font-bold">
                {hasNewsContent}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Viral signals</span>
                <TrendingUp className="h-4 w-4 text-sky-500" />
              </CardTitle>
              <CardDescription className="mt-2 text-2xl font-bold">
                {topViral.length}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Verdict distribution</CardTitle>
              <CardDescription>
                Aggregate fact-check outcomes across all analyses.
              </CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
              <StatPill label="True" value={factSummary.verifiedTrue} tone="success" />
              <StatPill label="False" value={factSummary.verifiedFalse} tone="destructive" />
              <StatPill label="Misleading" value={factSummary.misleading} tone="warning" />
              <StatPill label="Unverifiable" value={factSummary.unverifiable} tone="muted" />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top viral items</CardTitle>
              <CardDescription>
                Ranked by views using platform stats where available.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              {topViral.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium line-clamp-1">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.views.toLocaleString()} views
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.verdict}
                  </Badge>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                Demo data shown for illustration.
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top rumor clusters</CardTitle>
            <CardDescription>
              Groups of similar claims detected across your analyses.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 space-y-3">
            {[
              { label: "Health misinformation", size: 23, growth: "+12%" },
              { label: "Political claims", size: 18, growth: "+8%" },
              { label: "Financial scams", size: 12, growth: "+25%" },
            ].map((cluster) => (
              <div
                key={cluster.label}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
              >
                <div>
                  <span className="font-medium text-sm">{cluster.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {cluster.size} items
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs text-emerald-500">
                  {cluster.growth}
                </Badge>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">
              Demo data shown. Real clustering uses vector embeddings.
            </p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "destructive" | "warning" | "muted";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-500"
      : tone === "destructive"
      ? "bg-red-500/10 text-red-500"
      : tone === "warning"
      ? "bg-amber-500/10 text-amber-500"
      : "bg-muted text-muted-foreground";

  return (
    <div className="rounded-xl border border-border/60 px-4 py-3 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
      <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ${toneClass}`}>
        {label}
      </span>
    </div>
  );
}
