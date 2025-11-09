"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { AnalysesDashboard } from "@/components/analyses-dashboard";
import { Loader2 } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-[family-name:var(--font-space-grotesk)]">
          My Analyses
        </h1>
        <p className="text-muted-foreground text-lg">
          View and manage your saved fact-check analyses
        </p>
      </div>
      <AnalysesDashboard />
    </div>
  );
}
