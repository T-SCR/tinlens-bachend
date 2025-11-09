"use client"

import {
  ArrowRight,
  Link as LinkIcon,
  MessageSquare,
  Microscope,
  Database,
  FileCheck,
} from "lucide-react"

const steps = [
  {
    title: "Step 1: Paste Twitter/X Link/Article/Video/Insta/YouTube",
    description:
      "Paste any public TikTok or Twitter/X video URL into our secure analyzer. Works with TikTok & Twitter/X. Secure URL processing.",
    icon: LinkIcon,
    badge: "Step 1",
  },
  {
    title: "Step 2: AI Transcription & Extraction",
    description:
      "AI extracts text from posts and transcribes video/audio using OpenAI Whisper. Extracts post and video text. Multi-language support.",
    icon: MessageSquare,
    badge: "Step 2",
  },
  {
    title: "Step 3: News & Claim Detection",
    description:
      "Detects news, opinions, and factual claims in the content for both platforms. AI-powered claim extraction. News vs. opinion detection.",
    icon: Microscope,
    badge: "Step 3",
  },
  {
    title: "Step 4: Fact-Checking & Source Analysis",
    description:
      "Verifies claims using web search, databases, and evaluates source credibility. Web & database verification. Checks claim credibility. Source reliability analysis.",
    icon: Database,
    badge: "Step 4",
  },
  {
    title: "Step 5: Credibility & Creator Report",
    description:
      "Get a detailed report with verdicts, sources, and creator credibility rating. Truth/misleading/unverifiable verdicts. Linked credible sources. Creator credibility rating. Easy-to-read summary.",
    icon: FileCheck,
    badge: "Step 5",
  },
]

const expandedFlow = [
  "Detector",
  "Claimifier",
  "Retriever",
  "Veracity Judge",
  "Explainer",
  "Publisher",
  "Feedback & Memory",
]

export function HowItWorks() {
  return (
    <section className="py-20" id="how-it-works">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Our 5-step process ensures comprehensive fact-checking
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          From URL to verified report in seconds
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(({ title, description, icon: Icon, badge }) => (
          <div
            key={title}
            className="group rounded-3xl border border-foreground/5 bg-card/80 p-6 shadow-xl shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-8 w-8 text-primary" />
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {badge}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-[32px] border border-foreground/5 bg-muted/40 p-6 text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Expanded agentic flow
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
          {expandedFlow.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-primary/30 px-3 py-1 text-primary">
                {step}
              </span>
              {index !== expandedFlow.length - 1 && (
                <ArrowRight className="h-4 w-4 text-primary/80" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Safe Mode triggers automatically when confidence &lt; 50, replacing verdicts with official resources until stronger evidence appears.
        </p>
      </div>
    </section>
  )
}
