"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Loader2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

// Fallback component for when analyses can't load
function AnalysesFallback() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
          <p className="text-muted-foreground mb-4">
            Start analyzing content to see your saved results here
          </p>
          <Link href="/verify">
            <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90">
              Analyze Content
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalysesPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  if (!isAuthenticated) {
    router.replace("/sign-in");
    return null;
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
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <AnalysesFallback />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
