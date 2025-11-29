"use client";

import { useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { UserProfile } from "@clerk/nextjs";
import { Loader2, Bell, Key, ShieldCheck, Sparkles } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : undefined);
  const credits = useQuery(api.credits.getUserCredits, isAuthenticated ? {} : undefined);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [betaEnabled, setBetaEnabled] = useState(false);

  const planLabel = user?.plan ? user.plan.toUpperCase() : "FREE";
  const creditsLabel = credits?.hasUnlimitedCredits ? "∞" : credits?.credits ?? 0;

  const renderContent = () => {
    if (authLoading || (isAuthenticated && user === undefined)) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          Sign in to manage your TinLens workspace.
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-10">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/40 text-primary">
                Settings
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {planLabel} plan
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Control your TinLens workspace
            </CardTitle>
            <CardDescription>
              Manage account preferences, threat alerts, and share-ready outputs tied to your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Credits remaining</p>
              <p className="text-3xl font-semibold">{creditsLabel}</p>
              <p className="text-xs text-muted-foreground">
                Includes share-card renders & context lookups
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Account email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                Synced via Clerk + Convex
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase text-muted-foreground">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Upgrade plan
                </Button>
                <Button size="sm" variant="ghost" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Request features
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications & alerts
              </CardTitle>
              <CardDescription>
                Stay notified when TinLens finds recycled footage or high-risk signals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3">
                <div>
                  <p className="font-medium">Threat alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Email + webhook ping when confidence dips or recycled media surfaces.
                  </p>
                </div>
                <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3">
                <div>
                  <p className="font-medium">Beta features</p>
                  <p className="text-xs text-muted-foreground">
                    Early access to memory graph, newsroom CMS sync, and stream ingest.
                  </p>
                </div>
                <Switch checked={betaEnabled} onCheckedChange={setBetaEnabled} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-500" />
                API tokens
              </CardTitle>
              <CardDescription>
                Programmatic access to TinLens transcription + fact-check pipelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                API tokens are issued per newsroom workspace. Rotate keys every 30 days for best practices.
              </div>
              <Button variant="outline" className="gap-2">
                <Key className="h-4 w-4" />
                Generate new token
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account management</CardTitle>
            <CardDescription>Update profile, password, and connected identities.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="rounded-2xl border border-border/60 p-4">
              <UserProfile
                appearance={{
                  elements: {
                    card: "bg-transparent shadow-none border-none",
                    headerTitle: "text-lg font-semibold",
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return <DashboardShell>{renderContent()}</DashboardShell>;
}
