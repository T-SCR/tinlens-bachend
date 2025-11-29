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

  const hasUnlimited =
    creditsData.hasUnlimitedCredits ||
    creditsData.credits === -1 ||
    creditsData.plan === "pro";

  const normalizedPlan = creditsData.plan ?? "free";
  const planLabel = normalizedPlan.toUpperCase();
  const creditsValue = hasUnlimited ? "∞" : (creditsData.credits ?? 0).toString();

  return (
    <Link
      href="/credits"
      className={cn(
        "flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10",
        className
      )}
    >
      <Coins className="h-4 w-4" />
      <span className="flex items-center gap-1.5">
        <span className={cn("font-bold", hasUnlimited && "text-base")}>{creditsValue}</span>
        <span className="text-xs">credits</span>
        <span className="ml-1 text-xs font-bold uppercase tracking-wide">{planLabel}</span>
      </span>
    </Link>
  );
}
