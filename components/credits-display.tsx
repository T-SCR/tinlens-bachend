"use client";

import Link from "next/link";
import { Coins } from "lucide-react";
import { useQuery, useConvexAuth } from "convex/react";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface CreditsDisplayProps {
  className?: string;
}

export function CreditsDisplay({ className }: CreditsDisplayProps) {
  const { isAuthenticated } = useConvexAuth();
  const creditsData = useQuery(
    api.credits.getUserCredits,
    isAuthenticated ? {} : undefined
  );

  if (!isAuthenticated) {
    return null;
  }

  if (!creditsData) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-muted-foreground",
          className
        )}
      >
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
        <span>Loading credits…</span>
      </div>
    );
  }

  const label = creditsData.hasUnlimitedCredits
    ? "Unlimited"
    : `${creditsData.credits} credits`;
  const planLabel = creditsData.plan
    ? creditsData.plan.charAt(0).toUpperCase() + creditsData.plan.slice(1)
    : "Free";

  return (
    <Link
      href="/credits"
      className={cn(
        "flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10",
        className
      )}
    >
      <Coins className="h-4 w-4" />
      <span className="flex flex-col leading-tight">
        <span>{label}</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {planLabel} plan
        </span>
      </span>
    </Link>
  );
}
