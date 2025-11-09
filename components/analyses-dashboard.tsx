"use client";

import { useAllAnalyses } from "@/lib/hooks/use-all-analyses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Link as LinkIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function AnalysesDashboard() {
  const { analyses, isLoading } = useAllAnalyses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
            <p className="text-muted-foreground mb-4">
              Start analyzing content to see your saved results here
            </p>
            <Link href="/">
              <Button>Analyze Content</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {analyses.map((analysis) => {
        const getVerdictColor = (verdict?: string) => {
          switch (verdict?.toLowerCase()) {
            case "verified":
            case "true":
              return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "misleading":
            case "partially true":
              return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            case "false":
            case "unverified":
              return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            default:
              return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
          }
        };

        return (
          <Card key={analysis._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">
                  {analysis.metadata?.title || "Untitled Analysis"}
                </CardTitle>
                {analysis.factCheck?.verdict && (
                  <Badge className={getVerdictColor(analysis.factCheck.verdict)}>
                    {analysis.factCheck.verdict}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Confidence Score */}
              {analysis.factCheck?.confidence !== undefined && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold">{analysis.factCheck.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        analysis.factCheck.confidence >= 70
                          ? "bg-green-500"
                          : analysis.factCheck.confidence >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${analysis.factCheck.confidence}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {analysis._creationTime
                      ? formatDistanceToNow(new Date(analysis._creationTime), {
                          addSuffix: true,
                        })
                      : "Recently"}
                  </span>
                </div>
              </div>

              {/* Creator */}
              {analysis.metadata?.creator && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Creator: </span>
                  <span className="font-medium">{analysis.metadata.creator}</span>
                </div>
              )}

              {/* Description */}
              {analysis.metadata?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {analysis.metadata.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/news/${analysis._id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </Link>
                {analysis.metadata?.originalUrl && (
                  <a
                    href={analysis.metadata.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
