"use client";

import { useMemo, type ReactNode } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Bookmark,
  Clock,
  Eye,
  Heart,
  Loader2,
  MessageSquare,
  Repeat2,
  ShieldCheck,
  Share2,
  Sparkles,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const analyses = useQuery(
    api.tiktokAnalyses.getUserTikTokAnalyses,
    isAuthenticated ? {} : undefined
  );

  const timeline = useMemo(() => {
    if (!analyses) {
      return [];
    }
    return [...analyses].sort((a, b) => b._creationTime - a._creationTime);
  }, [analyses]);

  const totalVerifications = timeline.length;
  const lastVerification = timeline[0]?._creationTime;

  const formatStatNumber = (value?: number) => {
    if (!value || value <= 0) return null;
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const getStatsEntries = (analysis: (typeof timeline)[number]) => {
    const stats = analysis.metadata?.stats;
    if (!stats) return [];
    const mapEntries: Array<{ key: keyof typeof stats; label: string; icon: ReactNode }> = [
      { key: "views", label: "Views", icon: <Eye className="h-3 w-3" /> },
      { key: "likes", label: "Likes", icon: <Heart className="h-3 w-3" /> },
      { key: "comments", label: "Comments", icon: <MessageSquare className="h-3 w-3" /> },
      { key: "shares", label: "Shares", icon: <Repeat2 className="h-3 w-3" /> },
    ];

    return mapEntries
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

  const openShareCard = (analysis: (typeof timeline)[number]) => {
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

  const verdictStats = useMemo(() => {
    return timeline.reduce(
      (acc, item) => {
        const verdict = (item.factCheck?.verdict || "pending").toLowerCase();
        acc[verdict] = (acc[verdict] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [timeline]);

  const buildTags = (analysis: (typeof timeline)[number]) => {
    const tags = new Set<string>();

    const verdict = analysis.factCheck?.verdict;
    if (verdict) {
      tags.add(verdict);
    }

    const platform = analysis.metadata?.platform;
    if (platform) {
      tags.add(platform);
    }

    const domain = (analysis.metadata as { domain?: string })?.domain;
    if (domain) {
      tags.add(domain);
    }

    if (analysis.requiresFactCheck) {
      tags.add("Needs review");
    }

    const contentType = analysis.newsDetection?.contentType;
    if (contentType) {
      tags.add(contentType);
    }

    (analysis.metadata?.hashtags || []).forEach((tag) =>
      tags.add(`#${tag.replace(/^#/, "")}`)
    );

    return Array.from(tags);
  };

  const renderContent = () => {
    if (authLoading || analyses === undefined) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          Sign in to view your verification history.
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-8">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/40 text-primary">
                History
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {totalVerifications} verifications
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Memory of everything you have fact-checked
            </CardTitle>
            <CardDescription>
              TinLens stores your transcripts, verdicts, and tags so you can revisit any investigation instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Last verification</p>
              <p className="text-lg font-semibold">
                {lastVerification
                  ? formatDistanceToNow(new Date(lastVerification), { addSuffix: true })
                  : "No history yet"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Top verdict</p>
              <p className="text-lg font-semibold">
                {Object.entries(verdictStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([label]) => label)
                  .at(0) || "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Share cards published</p>
              <p className="text-lg font-semibold">
                {timeline.filter((item) => (item.factCheck?.confidence ?? 0) >= 80).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline
            </CardTitle>
            <CardDescription>
              Every verification with verdict, confidence, and quick actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {timeline.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8" />
                Start by verifying a reel or article to build your archive.
              </div>
            )}

            {timeline.map((analysis) => (
              <div key={analysis._id} className="grid gap-4 rounded-2xl border border-border/60 p-4 md:grid-cols-4">
                <div className="md:col-span-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {analysis.factCheck?.verdict || "Pending"}
                    </Badge>
                    {analysis.metadata?.platform && (
                      <Badge variant="secondary" className="text-xs">
                        {analysis.metadata.platform}
                      </Badge>
                    )}
                    {analysis.requiresFactCheck && (
                      <Badge variant="destructive" className="text-xs">
                        Needs review
                      </Badge>
                    )}
                  </div>
                  <p className="font-semibold">
                    {analysis.metadata?.title || "Untitled analysis"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analysis.metadata?.description?.slice(0, 140) || "No description"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase text-muted-foreground">Score</p>
                  <p className="text-xl font-semibold">
                    {analysis.factCheck?.confidence !== undefined ? `${analysis.factCheck.confidence}%` : "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(analysis._creationTime), { addSuffix: true })}
                  </p>

                  {getStatsEntries(analysis).length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2 text-xs text-muted-foreground">
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
                </div>

                <div className="flex flex-col justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {buildTags(analysis)
                      .slice(0, 3)
                      .map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                        ))}
                  </div>
                  {analysis.metadata?.hashtags && analysis.metadata.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {analysis.metadata.hashtags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag.replace(/^#/, "")}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Button asChild size="sm" variant="outline" className="justify-center gap-2">
                      <Link href={`/news/${analysis._id}`}>
                        <ShieldCheck className="h-4 w-4" />
                        View report
                      </Link>
                    </Button>
                    {analysis.metadata?.originalUrl && (
                      <Button asChild size="sm" variant="ghost" className="justify-center gap-2">
                        <Link href={analysis.metadata.originalUrl} target="_blank" rel="noopener noreferrer">
                          <Share2 className="h-4 w-4" />
                          Open source
                        </Link>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-center gap-2"
                      onClick={() => openShareCard(analysis)}
                    >
                      <Share2 className="h-4 w-4" />
                      Share card
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                Saved snippets
              </CardTitle>
              <CardDescription>
                High-signal transcriptions and context flags you&rsquo;ve bookmarked
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coming soon: pin context notes, export JSON, auto-sync to newsroom briefs.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-500" />
                Share-ready cards
              </CardTitle>
              <CardDescription>
                Download any past verdict card in light or dark themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Every verification stores a PNG + QR shortlink version. Re-open any report to regenerate instantly.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard">
                  <Share2 className="h-4 w-4" />
                  Go to dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return <DashboardShell>{renderContent()}</DashboardShell>;
}
