"use client";
import { FeatureStep } from "@/components/feature-step";
import { useLanguage } from "@/components/language-provider";
import {
  LinkIcon,
  AudioWaveformIcon,
  SearchIcon,
  ShieldCheckIcon,
  FileTextIcon,
} from "lucide-react";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      step: 1,
      title: "Paste or Highlight Content",
      description:
        "Paste any post, link, or video URL from social media, news sites, or YouTube into our secure analyzer.",
      icon: LinkIcon,
      features: [
        "Works with YouTube, Instagram, X (Twitter), articles",
        "Secure URL processing",
        "No account required",
      ],
      isReversed: false,
    },
    {
      step: 2,
      title: "AI Extraction & Claim Detection",
      description:
        "TinLens extracts text from posts and transcribes video/audio, then normalizes content into atomic claims.",
      icon: AudioWaveformIcon,
      features: [
        "OpenAI Whisper for video/audio",
        "Extracts claims from any content type",
        "Multi-language support",
      ],
      isReversed: true,
    },
    {
      step: 3,
      title: "Semantic Retrieval & Verification",
      description:
        "Verifies claims via semantic search across trusted sources, fact-check databases, and official resources.",
      icon: SearchIcon,
      features: [
        "AI-powered semantic retrieval",
        "Cross-references fact-check APIs",
        "Ranks by trust, recency, and fit",
      ],
      isReversed: false,
    },
    {
      step: 4,
      title: "Veracity Judge & Confidence Score",
      description:
        "Assigns a verdict (True/False/Misleading/Unverifiable) with a 0–100 confidence score based on evidence strength.",
      icon: ShieldCheckIcon,
      features: [
        "Evidence-based scoring",
        "Safe Mode for low confidence",
        "Source reliability weighting",
      ],
      isReversed: true,
    },
    {
      step: 5,
      title: "Share the Explanation",
      description:
        "Get a clear verdict with citations and export a myth-vs-fact card to share on any platform.",
      icon: FileTextIcon,
      features: [
        "True/False/Misleading/Unverifiable verdicts",
        "Linked credible sources with timestamps",
        "One-tap shareable cards",
        "Bilingual explanations (EN/HI)",
      ],
      isReversed: false,
      showArrow: false,
    },
  ];

  return (
    <section className="py-24">
      <div>
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {t.howItWorksTitle}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {steps.map((step) => (
            <FeatureStep
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
              icon={step.icon}
              features={step.features}
              isReversed={step.isReversed}
              showArrow={step.showArrow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
