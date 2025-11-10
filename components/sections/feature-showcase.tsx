'use client'

import {
  BadgeCheck,
  Cpu,
  Layers,
  Radio,
  Shield,
  Share2,
  Sparkles,
} from "lucide-react"

import { AnimatedHero } from "@/components/ui/animated-hero"

const features = [
  {
    title: "Confidence Score (0-100)",
    description:
      "Blends source credibility, evidence coverage, semantic fit, and freshness. Safe Mode lights up automatically below 50.",
    icon: BadgeCheck,
  },
  {
    title: "Structured Tags",
    description:
      "Veracity, modality, domain, and source type tags make verdicts scannable for editors and communities.",
    icon: Layers,
  },
  {
    title: "Misinformation Trends",
    description:
      "Live rumor clusters with velocity, risk, region, and language filters. Trigger crisis banners in seconds.",
    icon: Radio,
  },
  {
    title: "Context Check",
    description:
      "Detects recycled footage, surfaces original publish date, and links to official resources automatically.",
    icon: Sparkles,
  },
  {
    title: "Safe Mode",
    description:
      "When evidence is thin, TinLens stops the rumor from spreading and shows trusted guidance instead of a verdict.",
    icon: Shield,
  },
  {
    title: "Share-ready Myth vs Fact cards",
    description:
      "Export WCAG-compliant square, portrait, and landscape cards that embed citations and timestamps.",
    icon: Share2,
  },
  {
    title: "Cross-platform coverage",
    description:
      "Web app, Chrome extension, and mobile app share one secure backend with unified analytics.",
    icon: Cpu,
  },
]

const pipeline = [
  "Detector",
  "Claimifier",
  "Retriever",
  "Veracity Judge",
  "Explainer",
  "Publisher",
  "Feedback & Memory",
]

export function FeatureShowcase() {
  return (
    <section className="py-20" id="features">
      <div className="mb-10 flex flex-col gap-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          What you get
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Fast verification. Transparent receipts. Shareable truth.
        </h2>
        <p className="mx-auto max-w-3xl text-base text-muted-foreground">
          Every verdict includes structured metadata, citations, Safe Mode fallbacks, and a myth-vs-fact card.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-foreground/5 bg-card/80 p-6 shadow-xl shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/30"
            >
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[32px] border border-primary/20 bg-gradient-to-b from-primary/10 via-card to-card p-1 shadow-[0_20px_80px_-40px] shadow-primary/70">
          <div className="rounded-[30px] bg-background/90 p-6">
            <AnimatedHero />
            <div className="mt-8 space-y-4 rounded-2xl border border-foreground/5 bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-5 w-5" />
                Agentic workflow
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {pipeline.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-foreground">{step}</span>
                    {index !== pipeline.length - 1 && (
                      <span className="text-muted-foreground">-&gt;</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Detector catches spikes, Claimifier generates atomic claims, Retriever gathers trusted evidence, Judge issues verdict, Explainer writes bilingual context, Publisher sends cards, Feedback loop tunes weights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
