"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { ShieldCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const user = useQuery(api.users.getCurrentUser);
  const savedAnalyses = useQuery(api.tiktokAnalyses.getUserTikTokAnalyses);

  const isLoading = user === undefined || savedAnalyses === undefined;

  // Calculate stats
  const totalAnalyses = savedAnalyses?.length || 0;
  const creditsRemaining = user?.credits || 0;
  const isUnlimited = user?.plan === "pro" || user?.credits === -1;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <GradientHeading size="xl" className="mb-2">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
        </GradientHeading>
        <p className="text-muted-foreground">
          Here&apos;s your verification dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Analyses */}
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Analyses
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{totalAnalyses}</div>
            )}
          </CardContent>
        </Card>

        {/* Credits Remaining */}
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Credits
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-3xl font-bold">
                {isUnlimited ? "Unlimited" : creditsRemaining}
              </div>
            )}
            {!isUnlimited && (
              <Link href="/credits">
                <Button variant="link" className="px-0 h-auto mt-2">
                  Add more →
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Plan */}
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Plan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold capitalize">{user?.plan || "Free"}</div>
            )}
            {user?.plan === "free" && (
              <Link href="/credits">
                <Button variant="link" className="px-0 h-auto mt-2">
                  Upgrade →
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Verified Claims */}
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Quick Verify</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Paste a link to verify content instantly
            </p>
            <Link href="/verify">
              <Button className="w-full">
                Start Verification <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See what&apos;s being fact-checked right now
            </p>
            <Link href="/trends">
              <Button variant="outline" className="w-full">
                View Trends <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Analyses</h2>
          <Link href="/analyses">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : savedAnalyses && savedAnalyses.length > 0 ? (
          <div className="space-y-4">
            {savedAnalyses.slice(0, 5).map((analysis) => (
              <Card key={analysis._id} className="hover:shadow-md transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        {analysis.metadata?.title || "Untitled Analysis"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {analysis.metadata?.platform || "web"}
                        </Badge>
                        {analysis.factCheck && (
                          <Badge
                            variant={
                              analysis.factCheck.verdict === "true"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {analysis.factCheck.verdict}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/analyses#${analysis._id}`}>
                      <Button variant="ghost" size="sm">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">
                No analyses yet. Start verifying content!
              </p>
              <Link href="/verify">
                <Button>Verify Your First Content</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
