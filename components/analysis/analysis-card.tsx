/**
 * AnalysisCard - Component for displaying individual analysis items
 * Used in the analyses feed to show content analysis results
 */

"use client";

import { MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Repeat2,
  Share2,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

/**
 * Analysis data interface
 */
interface Analysis {
  _id: string;
  createdAt: number;
  metadata?: {
    creator?: string;
    title?: string;
    description?: string;
    platform?: string;
    originalUrl?: string;
    hashtags?: string[];
    stats?: {
      views?: number;
      likes?: number;
      comments?: number;
      shares?: number;
      saves?: number;
      plays?: number;
    };
  };
  transcription?: {
    text?: string;
  };
  factCheck?: {
    verdict?: string;
    confidence?: number;
  };
  creatorCredibilityRating?: number;
}

/**
 * Props for the AnalysisCard component
 */
interface AnalysisCardProps {
  /** Analysis data to display */
  analysis: Analysis;
  /** Optional CSS class name */
  className?: string;
}

/**
 * CreatorCredibilityBadge - Component for displaying creator credibility rating
 */
interface CreatorCredibilityBadgeProps {
  rating: number;
}

const CreatorCredibilityBadge = ({ rating }: CreatorCredibilityBadgeProps) => {
  const getBadgeClass = () => {
    if (rating > 7) {
      return "bg-green-100 text-green-800";
    } else if (rating >= 4) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeClass()}`}
    >
      Creator Credibility: {rating.toFixed(1)}
    </span>
  );
};

/**
 * AnalysisActions - Component for analysis action buttons
 */
interface AnalysisActionsProps {
  analysisId: string;
  onShare?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const AnalysisActions = ({ analysisId, onShare }: AnalysisActionsProps) => (
  <div className="flex flex-wrap justify-end items-center gap-2 mt-4">
    <Link href={`/news/${analysisId}`} passHref>
      <Button variant="outline" size="sm">
        View Details
      </Button>
    </Link>
    {onShare && (
      <Button variant="ghost" size="sm" className="gap-2" onClick={onShare}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    )}
  </div>
);

const formatStatNumber = (value?: number) => {
  if (!value || value <= 0) return null;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
};

const getStatsEntries = (analysis: Analysis) => {
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
    return url || "";
  }
};

/**
 * Formats timestamp to readable date string
 */
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * AnalysisCard component displays a single analysis item in a card format
 *
 * @example
 * ```tsx
 * <AnalysisCard analysis={analysisData} />
 * ```
 */
export const AnalysisCard = ({ analysis, className }: AnalysisCardProps) => {
  const statsEntries = getStatsEntries(analysis);

  const handleShare = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
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
    if (typeof window !== "undefined") {
      window.open(`/api/share?${params.toString()}`, "_blank");
    }
  };

  return (
    <Link href={`/news/${analysis._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.005 }}
      >
      <Card
        className={`rounded-none border-x-0 border-t-0 first:border-t hover:bg-muted/50 cursor-pointer ${className || ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Creator Avatar */}
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header with creator info and actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {analysis.metadata?.creator || "Anonymous"}
                  </span>

                  {/* Special verification badge for specific analysis */}
                  {analysis._id === "k97cr8dzekgww62mg1ktwkwbjd7jb6b9" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href="https://www.rmp.gov.my/soal_selidik.html"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Badge
                            variant="outline"
                            className="ml-1 border-blue-500 text-blue-500"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            Govt Verified
                          </Badge>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This creator is a verified government source.</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <span className="text-sm text-muted-foreground">
                    @{analysis.metadata?.creator?.toLowerCase() || "user"}·{" "}
                    {formatDate(analysis.createdAt)}
                  </span>
                </div>

                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Content Title */}
              <p className="text-sm text-foreground my-2">
                {analysis.metadata?.title || "Content analysis"}
              </p>

              {/* Transcription Preview */}
              {analysis.transcription?.text && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {analysis.transcription.text}
                </p>
              )}

              {analysis.metadata?.hashtags && analysis.metadata.hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.metadata.hashtags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag.replace(/^#/, "")}
                    </Badge>
                  ))}
                </div>
              )}

              {statsEntries.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {statsEntries.map((entry, index) => (
                    <span key={`${entry.label}-${index}`} className="flex items-center gap-1 rounded-full border px-2 py-0.5">
                      {entry.icon}
                      <span className="font-semibold text-foreground">{entry.value}</span>
                      <span>{entry.label}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Analysis Badges */}
              <div className="flex items-center gap-3 mt-2">
                {analysis.factCheck?.verdict && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                    {analysis.factCheck.verdict.charAt(0).toUpperCase() +
                      analysis.factCheck.verdict.slice(1)}
                  </span>
                )}

                {typeof analysis.creatorCredibilityRating === "number" && (
                  <CreatorCredibilityBadge
                    rating={analysis.creatorCredibilityRating}
                  />
                )}
              </div>

              {/* Actions */}
              <AnalysisActions analysisId={analysis._id} onShare={handleShare} />
            </div>
          </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};
