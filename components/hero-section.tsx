"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Compass,
  FlaskConical,
  ShieldCheckIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"
import { CardCanvas, Card } from "@/components/ui/animated-glow-card"
import { GlowCard } from "@/components/ui/spotlight-card"
import { ShinyButton } from "@/components/ui/shiny-button"
import { TextRotate } from "@/components/ui/text-rotate"
import { XCard } from "@/components/ui/x-gradient-card"
import { Button } from "@/components/ui/button"

const trustLogos = [
  "CivicSignal",
  "Global Newsroom Lab",
  "OpenFact Commons",
  "CrisisWatch",
]

const heroCard = {
  authorName: "TinLens Alerts",
  authorHandle: "tinlens",
  authorImage:
    "https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=200&q=80",
  content: [
    "🚨 Rumor surge: “Water is unsafe in Sector 12.”",
    "Verdict: Misleading · Confidence 82",
  ],
  timestamp: "2m ago",
  reply: {
    authorName: "Civic Response",
    authorHandle: "civic_response",
    authorImage:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80",
    content:
      "Confirmed w/ utilities dept. Pressure drop only. Sharing TinLens card.",
    timestamp: "moments ago",
  },
}

export function HeroSection() {
  return (
    <section className="relative mt-12 overflow-hidden rounded-[32px] border border-white/15 bg-slate-950 text-white shadow-2xl">
      <AnimatedGradientBackground
        Breathing
        gradientColors={[
          "rgba(14,165,233,0.35)",
          "rgba(59,130,246,0.35)",
          "rgba(45,212,191,0.25)",
          "rgba(255,255,255,0.15)",
        ]}
        gradientStops={[25, 45, 65, 100]}
        startingGap={110}
        containerClassName="opacity-80"
      />

      <div className="relative z-10 grid gap-12 px-6 py-16 md:px-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <Sparkles className="h-4 w-4 text-sky-300" />
            Know before you share
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Verify Content with{" "}
              <span className="inline-block bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                TinLens
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Paste any TikTok, X (Twitter), blog, or news URL to get instant
              transcription, analysis, and credibility assessment powered by
              advanced AI.
            </p>
            <div className="flex flex-wrap gap-2 text-base font-medium text-white/80">
              Verdicts:
              <TextRotate
                texts={[
                  "True",
                  "False",
                  "Misleading",
                  "Unverifiable",
                  "Safe Mode engaged",
                ]}
                rotationInterval={1700}
                mainClassName="rounded-full bg-white/10 px-4 py-1 text-base font-semibold text-white"
                splitLevelClassName="text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/news">
              <ShinyButton className="text-base font-semibold px-8 py-6">
                Analyze Content
              </ShinyButton>
            </Link>
            <Link href="/news">
              <Button
                variant="outline"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-6 py-6 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 hover:text-white"
              >
                <FlaskConical className="h-5 w-5" />
                Try Mock Demo (Free!)
              </Button>
            </Link>
          </div>
          
          <div className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/80">
              <span className="font-semibold text-cyan-300">💡 Try it with any TikTok/Twitter(X) video URL</span> to see the magic happen
            </p>
            <p className="mt-2 text-xs text-white/60">
              💡 The mock demo simulates the full analysis process with realistic data—perfect for testing without API costs!
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Trusted by safety-first teams
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-6 text-white/60">
              {trustLogos.map((logo) => (
                <span key={logo} className="text-sm font-semibold tracking-wide">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <CardCanvas className="bg-white/5">
            <Card className="bg-slate-900/70 p-4 text-left text-sm text-slate-100">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                <span>Live verdict</span>
                <span>Unsafe forward</span>
              </div>
              <div className="mt-4">
                <XCard
                  authorName={heroCard.authorName}
                  authorHandle={heroCard.authorHandle}
                  authorImage={heroCard.authorImage}
                  content={heroCard.content}
                  timestamp={heroCard.timestamp}
                  reply={heroCard.reply}
                />
              </div>
            </Card>
          </CardCanvas>

          <GlowCard className="custom-gradient-border !aspect-auto rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="space-y-4 text-slate-100">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-300" />
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Confidence score
                </p>
              </div>
              <div className="flex items-end gap-4">
                <p className="text-6xl font-bold text-white">
                  92<span className="text-2xl text-white/70">/100</span>
                </p>
                <div className="text-sm text-white/60">
                  <p>
                    Verdict: <span className="text-white">True</span>
                  </p>
                  <p>Tags: Veracity · Modality · Domain</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm text-white/80 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 p-3">
                  <p className="text-xs text-white/60">Safe Mode</p>
                  <p className="font-semibold">Auto when confidence &lt; 50</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-3">
                  <p className="text-xs text-white/60">Share card</p>
                  <p className="font-semibold">1080×1080 & 1080×1920</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                <span>Detector → Retriever → Judge</span>
                <span>Live ⟳ 24/7</span>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-xs text-white/60 md:px-12">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>Trends hub surfaces crisis alerts + velocity</span>
        </div>
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4" />
          <span>EN · HI today — more languages in progress</span>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/Untitled (200 x 50 mm) (5).png"
            alt="TinLens"
            width={120}
            height={32}
            className="h-6 w-auto dark:hidden"
          />
          <Image
            src="/Untitled (200 x 50 mm) (4).png"
            alt="TinLens"
            width={120}
            height={32}
            className="hidden h-6 w-auto dark:block"
          />
        </div>
      </div>
    </section>
  )
}
