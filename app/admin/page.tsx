"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ShieldAlert, Users, ListOrdered } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useTopCreatorsByCredibility } from "@/lib/hooks/use-saved-analyses";

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const moderationQueue = useQuery(api.analyses.getModerationQueue, {
    limit: 20,
  });
  const allUsers = useQuery(api.users.getAllUsers, {});
  const topCredibleCreators = useTopCreatorsByCredibility(undefined, 5);

  if (!authLoading && !isAuthenticated) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lightweight admin tools for monitoring analyses, users, and creator credibility.
            </p>
          </div>
          {clerkUser && (
            <div className="text-xs text-muted-foreground">
              Signed in as {clerkUser.primaryEmailAddress?.emailAddress}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Moderation queue */}
          <Card className="border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Moderation queue
              </CardTitle>
              <CardDescription>
                Analyses that require fact-checking, have low confidence, or sensitive verdicts.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              {!moderationQueue ? (
                <p className="text-sm text-muted-foreground">Loading queue…</p>
              ) : moderationQueue.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing in the queue right now. New, low-confidence or unverifiable items will appear here.
                </p>
              ) : (
                moderationQueue.map((item) => {
                  const verdict = item.factCheck?.verdict ?? "pending";
                  const confidence = item.factCheck?.confidence ?? 0;
                  const title =
                    item.factCheck?.content || item.metadata?.title || "Content analysis";
                  const createdAt = new Date(item.createdAt).toLocaleString();
                  const email = item.user?.email ?? item.user?.username ?? "Unknown user";

                  return (
                    <div
                      key={item._id as string}
                      className="rounded-lg border border-border/60 px-3 py-2 text-sm flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium line-clamp-1">{title}</span>
                        <Badge variant="outline" className="text-xs uppercase">
                          {verdict}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{email}</span>
                        <span>·</span>
                        <span>{createdAt}</span>
                        {confidence > 0 && (
                          <span>· {Math.round(confidence)}% confidence</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Sidebar: users & creators */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Users
                </CardTitle>
                <CardDescription>Basic list for quick inspection.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-4 space-y-2 text-xs text-muted-foreground">
                {!allUsers ? (
                  <p>Loading users…</p>
                ) : allUsers.length === 0 ? (
                  <p>No users yet.</p>
                ) : (
                  allUsers.slice(0, 8).map((u) => (
                    <div
                      key={u._id as string}
                      className="flex items-center justify-between py-1 border-b border-border/40 last:border-0"
                    >
                      <span className="truncate mr-2">
                        {u.firstName} {u.lastName}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ListOrdered className="h-4 w-4" />
                  Top credible creators
                </CardTitle>
                <CardDescription>Highest-rated creators by credibility score.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-4 space-y-2 text-xs text-muted-foreground">
                {!topCredibleCreators ? (
                  <p>Loading creators…</p>
                ) : topCredibleCreators.length === 0 ? (
                  <p>No creators scored yet.</p>
                ) : (
                  topCredibleCreators.map((creator) => (
                    <div
                      key={creator._id as string}
                      className="flex items-center justify-between py-1 border-b border-border/40 last:border-0"
                    >
                      <span className="truncate mr-2">
                        {creator.creatorName || creator.creatorId}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Badge variant="secondary" className="text-[10px] px-1">
                          {creator.platform}
                        </Badge>
                        <span>{creator.credibilityRating.toFixed(1)}/10</span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Separator />
            <p className="text-[11px] text-muted-foreground">
              This is a minimal admin shell. You can expand it later with actions (ban users, mark
              items as reviewed, system health, etc.).
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
