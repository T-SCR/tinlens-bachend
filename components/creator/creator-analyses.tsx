/**
 * CreatorAnalyses - Component for displaying a creator's content analyses
 *
 * Shows a list of analyses performed on content from a specific creator,
 * including verdicts, confidence scores, and analysis details.
 */

"use client";

import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Eye, Heart, MessageSquare, Repeat2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/components/language-provider";
import { LoadingSpinner } from "@/components/analysis";

/**
 * Props for the CreatorAnalyses component
 */
interface CreatorAnalysesProps {
  /** Creator ID to fetch analyses for */
  creatorId: string;
  /** Platform to filter analyses by */
  platform: string;
  /** Maximum number of analyses to display */
  limit?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * CreatorAnalyses component displays analyses for a specific creator
 *
 * @example
 * ```tsx
 * <CreatorAnalyses creatorId="creator123" platform="tiktok" limit={10} />
 * ```
 */
export const CreatorAnalyses = ({
  creatorId,
  platform,
  limit = 10,
  className,
}: CreatorAnalysesProps) => {
  const { t } = useLanguage();
  const analyses = useQuery(api.tiktokAnalyses.getAnalysesByCreator, {
    creatorId,
    platform,
    limit,
  });

  const formatStatNumber = (value?: number) => {
    if (!value || value <= 0) return null;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const getStatsEntries = (
    analysis: NonNullable<typeof analyses>[number]
  ) => {
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

  /**
   * Gets the appropriate color class for fact-check verdicts
   */
  const getVerdictColor = (verdict?: string): string => {
    switch (verdict) {
      case "true":
        return "text-green-600 bg-green-100";
      case "false":
        return "text-red-600 bg-red-100";
      case "misleading":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (analyses === undefined) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t.contentAnalyses}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner message="Loading analyses..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {t.contentAnalyses} ({analyses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyses.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t.noAnalysesFound}
          </p>
        ) : (
          <div className="space-y-4 max-w-full">
            {analyses.map((analysis) => (
              <div
                key={analysis._id}
                className="border rounded-lg p-4 space-y-3 w-full overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {analysis.metadata?.title || t.untitledVideo}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {analysis.factCheck?.verdict && (
                    <Badge
                      variant="secondary"
                      className={`${getVerdictColor(analysis.factCheck.verdict)} border-0 shrink-0`}
                    >
                      {analysis.factCheck.verdict}
                    </Badge>
                  )}
                </div>

                {analysis.factCheck?.explanation && (
                  <div className="max-w-full overflow-hidden">
                    <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                      {analysis.factCheck.explanation}
                    </p>
                  </div>
                )}

                {analysis.metadata?.hashtags && analysis.metadata.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {analysis.metadata.hashtags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag.replace(/^#/, "")}
                      </Badge>
                    ))}
                  </div>
                )}

                {getStatsEntries(analysis).length > 0 && (
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {getStatsEntries(analysis).map((entry, index) => (
                      <span
                        key={`${entry.label}-${index}`}
                        className="flex items-center gap-1 rounded-full border px-2 py-0.5"
                      >
                        {entry.icon}
                        <span className="font-semibold text-foreground">{entry.value}</span>
                        <span>{entry.label}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <span className="whitespace-nowrap">
                      {t.confidence}: {analysis.factCheck?.confidence || 0}%
                    </span>
                    {analysis.creatorCredibilityRating && (
                      <span className="whitespace-nowrap">
                        {t.rating}:{" "}
                        {analysis.creatorCredibilityRating.toFixed(1)}/10
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
