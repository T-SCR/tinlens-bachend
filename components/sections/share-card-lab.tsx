"use client";

import { Sparkles } from "lucide-react";

import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { Badge } from "@/components/ui/badge";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { XCard } from "@/components/ui/x-gradient-card";

const shareCardData = {
  authorName: "TinLens Alerts",
  authorHandle: "tinlens",
  authorImage:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  content: [
    "Verdict: Misleading",
    "Confidence: 78/100 | Tags: Old Footage · Health",
    "Use the myth-vs-fact card below before forwarding this clip.",
  ],
  isVerified: true,
  timestamp: "2 min ago",
  reply: {
    authorName: "Health Desk",
    authorHandle: "healthdesk",
    authorImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    content: "Context: This footage is from 2021. Official resources below.",
    isVerified: true,
    timestamp: "Just now",
  },
};

export function ShareCardLab() {
  return (
    <section className="py-24" id="share-cards">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge variant="outline" className="mb-3 gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Share-ready outputs
          </Badge>
          <GradientHeading size="xl" className="mb-3">
            Myth-vs-fact cards export in three presets
          </GradientHeading>
          <p className="text-base text-muted-foreground">
            Every verdict ships with a bilingual explanation, citations, and a
            WCAG-compliant share card (square, landscape, portrait) plus a
            QR-ready short link for WhatsApp, Telegram, and broadcast lists.
          </p>
        </div>

        <CardCanvas className="mx-auto max-w-4xl bg-gradient-to-r from-slate-900 to-slate-950">
          <Card className="bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex-1 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Share cards
                </p>
                <h3 className="text-3xl font-semibold tracking-tight text-white">
                  Tap once to broadcast a myth-vs-fact card with citations.
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Square 1080×1080, Landscape 1920×1080, Portrait 1080×1920</li>
                  <li>• Dark + light themes, bilingual captions (EN/HI)</li>
                  <li>• Disclaimer & QR short link baked in for WhatsApp forwarding</li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-2">
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-4 shadow-2xl">
                    <div className="dark">
                      <XCard {...shareCardData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </CardCanvas>
      </div>
    </section>
  );
}
