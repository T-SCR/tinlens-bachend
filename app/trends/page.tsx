"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { TrendingUp, Flame, AlertTriangle, BarChart3, Globe } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Mock trending clusters for demo
const MOCK_CLUSTERS = [
  {
    id: "1",
    label: "Health misinformation trends",
    size: 45,
    growth: 12,
    platforms: ["TikTok", "Twitter/X"],
    verdicts: { true: 5, false: 28, misleading: 12 },
  },
  {
    id: "2", 
    label: "Political claims cluster",
    size: 38,
    growth: 8,
    platforms: ["Twitter/X", "YouTube"],
    verdicts: { true: 12, false: 15, misleading: 11 },
  },
  {
    id: "3",
    label: "Viral video fact-checks",
    size: 29,
    growth: 25,
    platforms: ["TikTok", "Instagram"],
    verdicts: { true: 8, false: 14, misleading: 7 },
  },
  {
    id: "4",
    label: "Financial scam alerts",
    size: 22,
    growth: 18,
    platforms: ["Twitter/X", "Facebook"],
    verdicts: { true: 2, false: 18, misleading: 2 },
  },
];

// Mock platform distribution for demo
const MOCK_PLATFORMS = [
  { platform: "Twitter/X", count: 45 },
  { platform: "TikTok", count: 38 },
  { platform: "YouTube", count: 22 },
  { platform: "Instagram", count: 18 },
  { platform: "Facebook", count: 12 },
];

export default function TrendsPage() {
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
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Using mock data for demo
  const totalAnalyses = 135;
  const requiresFactCheck = 47;
  const topPlatforms = MOCK_PLATFORMS.map(p => [p.platform, p.count] as [string, number]);

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trends & Clusters</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor emerging misinformation patterns, viral content clusters, and platform activity.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Active Clusters</span>
                <Globe className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_CLUSTERS.length}</div>
              <p className="text-xs text-muted-foreground">
                Similar claims grouped
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Trending Now</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                Total analyses tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Needs Review</span>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requiresFactCheck}</div>
              <p className="text-xs text-muted-foreground">
                Flagged for fact-check
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Viral Velocity</span>
                <Flame className="h-4 w-4 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{Math.floor(Math.random() * 20 + 5)}%</div>
              <p className="text-xs text-muted-foreground">
                Growth this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Claim Clusters */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Claim Clusters
              </CardTitle>
              <CardDescription>
                Groups of similar misinformation patterns detected across platforms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_CLUSTERS.map((cluster) => (
                <div
                  key={cluster.id}
                  className="rounded-lg border border-border/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cluster.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {cluster.size} items
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cluster.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                    <Badge className="text-xs bg-emerald-500/15 text-emerald-500">
                      +{cluster.growth}% growth
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-500">{cluster.verdicts.true}</span>
                      <span className="text-muted-foreground">True</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-500">{cluster.verdicts.false}</span>
                      <span className="text-muted-foreground">False</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">{cluster.verdicts.misleading}</span>
                      <span className="text-muted-foreground">Misleading</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Platform Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Platform Activity
              </CardTitle>
              <CardDescription>
                Content distribution across social platforms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPlatforms.map(([platform, count]) => (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{platform}</span>
                    <span className="text-muted-foreground">{count} analyses</span>
                  </div>
                  <Progress 
                    value={(count / totalAnalyses) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
              
              {/* Mock geographic data */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm font-medium mb-3">Top Regions (Demo)</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">India</span>
                    <Progress value={45} className="w-24 h-1.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">United States</span>
                    <Progress value={28} className="w-24 h-1.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">United Kingdom</span>
                    <Progress value={15} className="w-24 h-1.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Malaysia</span>
                    <Progress value={12} className="w-24 h-1.5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Viral Content Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              Viral Content Detection
            </CardTitle>
            <CardDescription>
              High-velocity content that&apos;s spreading rapidly and may need urgent fact-checking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Operation Sindoor viral video claims", views: 2300000, velocity: 45, verdict: "misleading", platform: "Twitter/X" },
                { title: "Health misinformation about vaccines", views: 1500000, velocity: 38, verdict: "false", platform: "TikTok" },
                { title: "Political speech edited clip", views: 980000, velocity: 32, verdict: "misleading", platform: "YouTube" },
                { title: "Breaking news verification", views: 750000, velocity: 28, verdict: "verified", platform: "Twitter/X" },
                { title: "Celebrity fake endorsement", views: 520000, velocity: 22, verdict: "false", platform: "Instagram" },
                { title: "Financial scam alert", views: 380000, velocity: 18, verdict: "false", platform: "Facebook" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {item.verdict}
                    </Badge>
                    <Badge className="text-xs bg-red-500/15 text-red-500">
                      +{item.velocity}% velocity
                    </Badge>
                  </div>
                  <p className="font-medium text-sm line-clamp-2">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span>{item.views.toLocaleString()} views</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Demo data shown for illustration. Real data from your analyses will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
