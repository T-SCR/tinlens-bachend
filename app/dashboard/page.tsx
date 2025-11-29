"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart3,
  Eye,
  GaugeCircle,
  Heart,
  Link as LinkIcon,
  MessageSquare,
  Repeat2,
  Share2,
  ShieldCheck,
  Sparkles,
  Tags,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AIInputWithFile } from "@/components/ui/ai-input-with-file";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  

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
  const creditsRemaining = isUnlimited ? -1 : Math.max(0, user?.credits ?? 0);
  const displayCredits = isUnlimited ? "∞" : creditsRemaining.toString();

  const averageConfidence =
    savedAnalyses && savedAnalyses.length
      ? Math.round(
          savedAnalyses.reduce(
            (sum, analysis) => sum + (analysis.factCheck?.confidence ?? 0),
            0
          ) / savedAnalyses.length
        )
      : null;

  const uniqueHashtagCount =
    savedAnalyses?.reduce((acc, analysis) => {
      (analysis.metadata?.hashtags || []).forEach((tag) => acc.add(tag));
      return acc;
    }, new Set<string>()).size ?? 0;

  const shareReadyCount =
    savedAnalyses?.filter((analysis) => (analysis.factCheck?.confidence ?? 0) >= 80).length ?? 0;

  const trackedCreators =
    savedAnalyses?.reduce((acc, analysis) => {
      const key = `${analysis.metadata?.platform || "unknown"}:${analysis.metadata?.creator || ""}`;
      acc.add(key);
      return acc;
    }, new Set<string>()).size ?? 0;

  const statsCards = [
    {
      title: "Avg Confidence",
      metric: isLoading || averageConfidence === null ? "..." : `${averageConfidence}%`,
      icon: GaugeCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Unique Hashtags",
      metric: isLoading ? "..." : uniqueHashtagCount.toString(),
      icon: Tags,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Share-ready Cards",
      metric: isLoading ? "..." : shareReadyCount.toString(),
      icon: Share2,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      title: "Creators Tracked",
      metric: isLoading ? "..." : trackedCreators.toString(),
      icon: BarChart3,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  const formatStatNumber = (value?: number) => {
    if (!value || value <= 0) return null;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const getStatsEntries = (analysis: NonNullable<typeof savedAnalyses>[number]) => {
    const stats = analysis.metadata?.stats;
    if (!stats) return [];
    const config: Array<{ key: keyof typeof stats; label: string; icon: ReactNode }> = [
      { key: "views", label: "Views", icon: <Eye className="h-3 w-3" /> },
      { key: "likes", label: "Likes", icon: <Heart className="h-3 w-3" /> },
      { key: "comments", label: "Comments", icon: <MessageSquare className="h-3 w-3" /> },
      { key: "shares", label: "Shares", icon: <Repeat2 className="h-3 w-3" /> },
    ];
    return config
      .map(({ key, label, icon }) => {
        const formatted = formatStatNumber(stats[key]);
        return formatted ? { label, value: formatted, icon } : null;
      })
      .filter((entry): entry is { label: string; value: string; icon: ReactNode } => !!entry);
  };

  const formatDomain = (url?: string | null) => {
    if (!url) return "";
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const openShareCard = (analysis: NonNullable<typeof savedAnalyses>[number]) => {
    if (typeof window === "undefined") return;
    const verdict = (() => {
      const verdictText = analysis.factCheck?.verdict?.toLowerCase();
      if (verdictText === "true") return "verified";
      if (verdictText === "false") return "false";
      return verdictText || "unverifiable";
    })();
    const confidence = analysis.factCheck?.confidence ?? 0;
    const params = new URLSearchParams({
      title: analysis.metadata?.title || "TinLens Analysis",
      verdict,
      confidence: String(Math.round(confidence)),
      creator: analysis.metadata?.creator || "Unknown",
      platform: analysis.metadata?.platform || "web",
      domain: formatDomain(analysis.metadata?.originalUrl),
    });
    window.open(`/api/share?${params.toString()}`, "_blank");
  };

  const handleAnalyze = (message: string, file?: File) => {
    if (!message.trim() && !file) {
      toast.error("Please paste a URL or upload an image");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay for animation
    setTimeout(() => {
      if (message.trim()) {
        router.push(`/verify?link=${encodeURIComponent(message.trim())}`);
      } else if (file) {
        // Handle file upload - for now just show message
        toast.info("Image analysis coming soon!");
        setIsProcessing(false);
      }
    }, 1000);
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Redirecting to sign in?
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="p-4 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Welcome back, {clerkUser?.firstName || user?.firstName || "there"}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here&apos;s what&apos;s happening with your verifications today.
              </p>
            </div>
            <div className="flex w-full max-w-xl">
              <Card className="w-full border border-primary/30 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                        Verification Credits
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Each verification deducts 1 credit automatically
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-amber-600 shadow-sm dark:bg-neutral-900/60 dark:text-amber-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
                      <Zap className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                      <span className="text-xs uppercase text-muted-foreground">Credits left</span>
                      {isLoading ? (
                        <Skeleton className="mt-2 h-10 w-24" />
                      ) : (
                        <div className="mt-1">
                          <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                            {displayCredits}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isUnlimited ? "Unlimited plan active" : "Remaining balance"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/40 px-6 py-4 text-sm text-neutral-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/40 dark:text-neutral-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
                        1 credit = 1 verification
                      </p>
                      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">
                        We auto-deduct a single credit every time you run TinLens verification.
                      </p>
                      <Link
                        href="/credits"
                        className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
                      >
                        Manage credits
                      </Link>
                      {totalAnalyses > 0 && (
                        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                          You have completed {totalAnalyses} lifetime verifications.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={cn("border", stat.borderColor)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={cn("rounded-full p-2", stat.bgColor)}>
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.metric}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Quick Verification */}
          <Card className="lg:col-span-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Quick Verification
              </CardTitle>
              <CardDescription>
                Paste URL, add context details, or upload an image to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <TextShimmerWave className="text-lg font-medium" duration={0.8}>
                    Analyzing content...
                  </TextShimmerWave>
                  <p className="text-xs text-muted-foreground mt-2">
                    Processing your request with AI
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AIInputWithFile 
                    onSubmit={handleAnalyze}
                    placeholder="Paste URL or describe what to check..."
                    accept="image/*"
                    maxFileSize={10}
                  />
                  <p className="text-xs text-muted-foreground px-2">
                    Supports TikTok, X (Twitter), YouTube, Instagram Reels, web articles, and image analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Context Check */}
          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Context Check
              </CardTitle>
              <CardDescription>
                Recycled media detections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Detected this week</span>
                  <span className="text-3xl font-bold text-purple-500">19</span>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Auto-linked to WHO + PIB resources
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Recent Analyses
            </CardTitle>
            <CardDescription>
              Your latest verifications with confidence scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : savedAnalyses && savedAnalyses.length > 0 ? (
              <div className="space-y-3">
                {savedAnalyses.slice(0, 5).map((analysis) => (
                  <div
                    key={analysis._id}
                    className="rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/50 hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {analysis.requiresFactCheck ? "Needs Review" : "Processed"}
                          </Badge>
                          {analysis.metadata?.platform && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {analysis.metadata.platform}
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold text-sm">
                          {analysis.metadata?.title || "Untitled analysis"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {analysis.metadata?.description ||
                            analysis.transcription?.text?.slice(0, 140) ||
                            "No description available"}
                        </p>
                        {analysis.metadata?.hashtags && analysis.metadata.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {analysis.metadata.hashtags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary">
                                #{tag.replace(/^#/, "")}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {analysis.factCheck?.confidence !== undefined && (
                          <>
                            <span className="text-2xl font-bold text-blue-500">
                              {analysis.factCheck.confidence}
                            </span>
                            <span className="text-xs text-muted-foreground">Confidence</span>
                          </>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {formatDomain(analysis.metadata?.originalUrl)}
                        </span>
                      </div>
                    </div>

                    {getStatsEntries(analysis).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {getStatsEntries(analysis).map((entry, idx) => (
                          <div
                            key={`${entry.label}-${idx}`}
                            className="flex items-center gap-1 rounded-full border px-2 py-0.5"
                          >
                            {entry.icon}
                            <span className="font-semibold text-foreground">{entry.value}</span>
                            <span>{entry.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline" className="gap-2">
                        <Link href={`/news/${analysis._id}`}>
                          <ShieldCheck className="h-4 w-4" />
                          Open report
                        </Link>
                      </Button>
                      {analysis.metadata?.originalUrl && (
                        <Button asChild size="sm" variant="ghost" className="gap-2">
                          <Link
                            href={analysis.metadata.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Share2 className="h-4 w-4" />
                            Source
                          </Link>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2"
                        onClick={() => openShareCard(analysis)}
                      >
                        <Share2 className="h-4 w-4" />
                        Share card
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 p-12 text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  No analyses yet. Start verifying content above!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
