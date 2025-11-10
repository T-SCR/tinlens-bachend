"use client";

import { motion } from "framer-motion";
import {
  BellRing,
  Gauge,
  History,
  Share2,
  Shield,
  Smartphone,
  Tags,
  Waves,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const featureList = [
  {
    title: "Confidence Score (0–100)",
    description:
      "Transparent blend of source credibility, evidence coverage, semantic fit, freshness, stance agreement, and model agreement.",
    icon: Gauge,
  },
  {
    title: "Structured Tags",
    description:
      "Veracity, modality (Old Footage, Manipulated Media), domain, and source type tags keep verdicts scannable.",
    icon: Tags,
  },
  {
    title: "Misinformation Trends",
    description:
      "Cluster rumors by topic, language, and region with velocity + risk so teams can prioritize responses.",
    icon: Waves,
  },
  {
    title: "Context Check",
    description:
      "Detects recycled media, mismatched dates, and screenshot re-use, then auto-links the original source.",
    icon: History,
  },
  {
    title: "Safe Mode",
    description:
      "If confidence < 50 or high-cred sources conflict, TinLens pauses verdicts, shows a caution banner, and routes to official links.",
    icon: Shield,
  },
  {
    title: "One-tap Share Cards",
    description:
      "Export WCAG-compliant PNGs (1080 square, landscape, portrait) with QR/short links and bilingual captions.",
    icon: Share2,
  },
  {
    title: "Cross-platform surfaces",
    description:
      "Web app, Chrome extension, and mobile app share one backend with unified analytics and offline cache.",
    icon: Smartphone,
  },
  {
    title: "Alerts & Feedback",
    description:
      "Trigger crisis alerts, send newsroom overrides, and feed community feedback back into the pipeline.",
    icon: BellRing,
  },
];

export function Features8() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {featureList.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="h-full border-border/60 bg-card/80 shadow-sm shadow-primary/10">
              <CardContent className="flex gap-4 pt-6">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{feature.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
