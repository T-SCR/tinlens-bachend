"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { AnalysesDashboard } from "@/components/analyses-dashboard";
import { Loader2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AnalysesPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">
            Saved Analyses
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Access your past verifications, context notes, and share cards at any time.
          </p>
        </div>
        <AnalysesDashboard />
      </div>
    </DashboardShell>
  );
}
