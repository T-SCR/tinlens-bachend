"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ActivitySquare,
  BookCheck,
  Brain,
  MessageSquare,
  Newspaper,
  Share2,
  Workflow,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Detector",
    description:
      "Watches public feeds and user submissions for spikes, keywords, and velocity anomalies to spot likely claims.",
    icon: ActivitySquare,
    features: ["Velocity + risk scoring", "Language + geo hints", "Spam/threat filters"],
  },
  {
    number: "02",
    title: "Claimifier",
    description:
      "Normalizes the snippet into atomic claims, extracts entities/dates/numbers, and drafts smart queries.",
    icon: Brain,
    features: ["Atomic claims", "Entity + date extraction", "Multilingual parsing"],
  },
  {
    number: "03",
    title: "Retriever",
    description:
      "Runs semantic + lexical search across fact-check archives, Qdrant/FAISS embeddings, news APIs, and official datasets.",
    icon: Newspaper,
    features: ["Trusted sources first", "Recency + credibility rank", "Media dedupe"],
  },
  {
    number: "04",
    title: "Veracity Judge",
    description:
      "Performs stance/NLI reasoning over the top evidence, calculates transparent sub-scores, and handles contradiction penalties.",
    icon: BookCheck,
    features: ["0–100 score bands", "Safe Mode triggers", "Contradiction penalty"],
  },
  {
    number: "05",
    title: "Explainer",
    description:
      "Writes a bilingual summary (EN/HI) with citations, timestamped quotes, and context-check notes (e.g., Old Footage).",
    icon: MessageSquare,
    features: ["Citations w/ timestamps", "Context Check alerts", "Plain-language copy"],
  },
  {
    number: "06",
    title: "Publisher",
    description:
      "Pushes results to the web app, dashboard, Chrome extension, and share-card generator with Safe Mode banners when needed.",
    icon: Share2,
    features: ["Square / landscape / portrait cards", "QR + short links", "WCAG compliant"],
  },
  {
    number: "07",
    title: "Feedback & Memory",
    description:
      "Captures user ratings, newsroom overrides, and rumor resolutions to re-rank sources and improve future verdicts.",
    icon: Workflow,
    features: ["Helpful/not helpful signals", "Newsroom overrides", "Memory weighting"],
  },
];

export function RedesignedHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
            Agentic workflow that shows its work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From detection to delivery, TinLens uses advanced AI to verify claims and provide clear, actionable insights.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl font-bold text-primary/20 font-[family-name:var(--font-jetbrains-mono)]">
                          {step.number}
                        </span>
                        <h3 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 text-lg">
                        {step.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {step.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
