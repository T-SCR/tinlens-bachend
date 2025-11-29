"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  BarChart2,
  Bookmark,
  FileCheck2,
  Shield,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";

export function AnalysisShowcaseSection() {
  return (
    <section id="results" className="bg-slate-925 py-24 text-white">
      <div className="container mx-auto space-y-10 px-4">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-white/30 text-white">
            Fact-check results
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            See exactly how TinLens presents verdicts, creators, and saved analyses.
          </h2>
          <p className="text-white/70">
            Landing stays public, but here’s a peek at the dashboard views you’ll unlock once you sign in.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-emerald-300" />
                Fact-check dashboard
              </CardTitle>
              <p className="text-sm text-white/70">
                Every analysis returns a credibility score, Safe Mode banner, citations, creator credibility, and the option
                to export a myth-vs-fact card.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/80">
              <div className="rounded-2xl border border-white/15 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">Credibility score</p>
                    <p className="text-4xl font-semibold text-emerald-300">82 / 100</p>
                  </div>
                  <div className="text-right text-xs text-white/60">
                    <p>Safe Mode</p>
                    <p>Off</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <TagRow icon={<Shield className="h-4 w-4" />} label="Tags">
                    Misleading · Old footage · Disaster
                  </TagRow>
                  <TagRow icon={<Activity className="h-4 w-4" />} label="Sources">
                    Reuters · PIB India · WHO
                  </TagRow>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/70">
                  <span className="rounded-full border border-white/30 px-3 py-1">Download share card</span>
                  <span className="rounded-full border border-white/30 px-3 py-1">Open creator profile</span>
                  <span className="rounded-full border border-white/30 px-3 py-1">View timeline</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-sky-300" />
                Detailed analysis view
              </CardTitle>
              <p className="text-sm text-white/70">
                Transcription, sentiment, and extracted claims appear alongside the verdict explanation so teams can audit
                the reasoning.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <div className="space-y-3 rounded-2xl border border-white/15 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Transcript</p>
                <p className="line-clamp-4">
                  “BREAKING: A video claims that a current cyclone is destroying Mumbai. TinLens detected that the footage
                  matches a 2019 storm clip uploaded by local news outlets…”
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TagRow icon={<TagIcon />} label="Identified claims">
                  3 factual claims · 1 sentiment mention
                </TagRow>
                <TagRow icon={<Sparkles className="h-4 w-4" />} label="Memory">
                  Linked to existing debunk from 2022
                </TagRow>
              </div>
              <p className="text-xs text-white/60">
                Want this level of detail? Sign in → Verify a link → Tap “View analysis” for every saved case.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-300" />
                Creator credibility profile
              </CardTitle>
              <p className="text-sm text-white/70">
                TinLens tracks historical credibility, analyses, and community votes for every creator you’ve reviewed.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <div className="rounded-2xl border border-white/15 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">@stormwatchindia</p>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">Web · last checked 3 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-semibold text-emerald-300">8.7</p>
                    <p className="text-xs text-white/60">Credibility rating</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                  <span className="rounded-full border border-white/25 px-3 py-1">Top claims</span>
                  <span className="rounded-full border border-white/25 px-3 py-1">Community feedback</span>
                  <span className="rounded-full border border-white/25 px-3 py-1">Escalation log</span>
                </div>
              </div>
              <p className="text-xs text-white/60">
                Use the dashboard to compare credibility trends and review community comments before publishing.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-purple-300" />
                Saved analyses & history
              </CardTitle>
              <p className="text-sm text-white/70">
                Every verdict you run is stored for reference. Quickly filter by verdict, platform, or creator and jump back
                into the case file.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              {[
                { title: "Cyclone video is old footage", verdict: "Misleading", date: "Jun 22" },
                { title: "Celebrity quote fabricated", verdict: "False", date: "Jun 20" },
                { title: "Vaccine rumor lacks evidence", verdict: "Unverifiable", date: "Jun 18" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/15 bg-black/30 p-3 text-xs text-white/80"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <Badge variant="outline" className="border-white/30 text-white">
                      {item.verdict}
                    </Badge>
                  </div>
                  <p className="text-white/50">{item.date}</p>
                </div>
              ))}
              <ButtonLink href="/dashboard">Go to dashboard history</ButtonLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TagRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/30 p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm text-white">{children}</p>
    </div>
  );
}

function TagIcon() {
  return <Star className="h-4 w-4 text-amber-300" />;
}

function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
