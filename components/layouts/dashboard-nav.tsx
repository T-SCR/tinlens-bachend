"use client";

import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { Coins } from "lucide-react";

export function DashboardNav() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Verify", href: "/verify" },
    { label: "Trends", href: "/trends" },
    { label: "Analyses", href: "/analyses" },
    { label: "Credits", href: "/credits" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl">TinLens</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu & Credits */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {user.plan === "pro" || user.credits === -1
                    ? "Unlimited"
                    : `${user.credits} credits`}
                </span>
              </div>
            )}
            {isAuthenticated && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </div>
    </nav>
  );
}
