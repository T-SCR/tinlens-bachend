"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { BarChart3, Activity, AlertTriangle, TrendingUp } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllAnalyses, useAllAnalysisStats } from "@/lib/hooks/use-all-analyses";

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const stats = useAllAnalysisStats();
  const { analyses, isLoading } = useAllAnalyses();

  if (!authLoading && !isAuthenticated) {
    router.replace("/sign-in");
    return null;
  }

  const totalAnalyses = stats?.totalAnalyses ?? 0;
  const requiresFactCheck = stats?.requiresFactCheck ?? 0;
  const hasNewsContent = stats?.hasNewsContent ?? 0;

  const factSummary = stats?.factCheckSummary ?? {
    verifiedTrue: 0,
    verifiedFalse: 0,
    misleading: 0,
    unverifiable: 0,
    needsVerification: 0,
  };

  const topViral = (analyses || [])
    .slice()
    .sort((a, b) => {
      const aViews = a.metadata?.stats?.views ?? 0;
      const bViews = b.metadata?.stats?.views ?? 0;
      return bViews - aViews;
    })
    .slice(0, 5);

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
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : topViral.length === 0 ? (
                <p className="text-sm text-muted-foreground">No analyses with view stats yet.</p>
              ) : (
                topViral.map((analysis) => {
                  const views = analysis.metadata?.stats?.views ?? 0;
                  const platform = analysis.metadata?.platform ?? "web";
                  const title = analysis.metadata?.title || "Content analysis";
                  return (
                    <div
                      key={analysis._id}
                      className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium line-clamp-1">{title}</span>
                        <span className="text-xs text-muted-foreground">
                          {platform} · {views.toLocaleString()} views
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {analysis.factCheck?.verdict ?? "pending"}
                      </Badge>
                    </div>
                  );
                })
              )}
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
