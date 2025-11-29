"use client";

import Link from "next/link";
import { Chrome, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BrowserExtensionSection() {
  const highlights = [
    "Highlight any paragraph to open an inline verdict popover.",
    "See verdict, score, tags, and citations without leaving the page.",
    "Tap “Open full case” to jump straight into the TinLens dashboard.",
  ];

  return (
    <section id="extension" className="bg-slate-950 py-24 text-white">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
            Browser extension
          </span>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Verify content directly on social platforms and news sites.
          </h2>
          <p className="text-base text-white/70">
            The TinLens Chrome extension mirrors the full dashboard pipeline. Highlight any text or paste a link to see
            verdicts, Safe Mode banners, citations, and share-card shortcuts without leaving the page.
          </p>
          <ul className="space-y-3 text-sm text-white/80">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-sky-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2 bg-white text-slate-900 hover:bg-white/90">
              <Link href="/download">
                <Chrome className="h-4 w-4" />
                Install the extension
              </Link>
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/dashboard">
                Open dashboard
                <Zap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
              <span>Inline verdict</span>
              <span>Chrome</span>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/40 p-4">
              <p className="text-sm text-white/70">
                “BREAKING: a recycled video of a previous storm is circulating. TinLens flagged it as Old Footage with 78
                confidence.”
              </p>
              <div className="mt-4 grid gap-3 text-xs text-white/80 sm:grid-cols-2">
                <div className="rounded-xl border border-white/15 bg-black/30 p-3">
                  <p className="text-white/60">Confidence</p>
                  <p className="text-xl font-semibold text-emerald-300">78 / 100</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-3">
                  <p className="text-white/60">Tags</p>
                  <p>Old Footage · Disaster · WhatsApp</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/20 px-3 py-1">View sources</span>
                <span className="rounded-full border border-white/20 px-3 py-1">Open full case</span>
                <span className="rounded-full border border-white/20 px-3 py-1">Share card</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-10 bottom-4 h-16 rounded-3xl bg-gradient-to-r from-sky-500/20 to-purple-500/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
