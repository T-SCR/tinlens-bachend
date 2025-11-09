"use client";

import { ShieldCheck, TrendingUp, Clock, Share2, AlertTriangle, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GradientHeading } from "@/components/ui/gradient-heading";

export function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Confidence Score (0-100)",
      description: "See how strong the evidence is with transparent sub-scores and color bands.",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      title: "Misinformation Trends",
      description: "Live clusters by topic/region with velocity, risk tracking, and crisis alerts.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Clock,
      title: "Context Check",
      description: "Detects recycled content and auto-tags 'Old Footage' with original date/source.",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      icon: Share2,
      title: "One-tap Share Cards",
      description: "Platform-ready PNGs for X/WhatsApp/Telegram; light/dark, WCAG-compliant.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: AlertTriangle,
      title: "Safe Mode",
      description: "If confidence <50, shows caution banner and official links instead of hard verdict.",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: Globe,
      title: "Cross-platform",
      description: "Web app, Chrome extension, and mobile app share one secure backend.",
      gradient: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <GradientHeading size="xl" className="mb-4">
            What You Get
          </GradientHeading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive fact-checking with transparent methodology and shareable results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
