"use client";

import { useState } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield, Search, Sparkles } from "lucide-react";
import { TextRotate } from "@/components/ui/text-rotate";
import { motion } from "framer-motion";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";

interface NewHeroSectionProps {
  initialUrl?: string;
}

export function NewHeroSection({ initialUrl = "" }: NewHeroSectionProps) {
  const [url, setUrl] = useState(initialUrl);

  const handleAnalyze = () => {
    // Redirect to verify page
    if (url.trim()) {
      window.location.href = `/?link=${encodeURIComponent(url.trim())}`;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <AnimatedGradientBackground
        startingGap={120}
        Breathing={true}
        gradientColors={[
          "#0A0A0A",
          "#2E8FFF",
          "#00C2FF",
          "#2E8FFF",
          "#0A0A0A"
        ]}
        gradientStops={[0, 40, 50, 60, 100]}
        breathingRange={8}
        animationSpeed={0.015}
        topOffset={20}
      />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-2 inline" />
            AI-Powered Fact Checking
          </Badge>

          {/* Main Headline with Rotating Text */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 font-[family-name:var(--font-space-grotesk)]">
            <span className="block mb-2">Verify claims in</span>
            <TextRotate
              texts={["seconds", "real-time", "one click", "moments"]}
              mainClassName="text-primary inline-flex"
              rotationInterval={2500}
              staggerDuration={0.025}
              staggerFrom="last"
            />
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Know before you share. TinLens checks posts, links, and videos against trusted sources.
          </p>

          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-12">
            Get a <span className="font-semibold text-primary">0-100 confidence score</span>, veracity tags, and clear explanations with citations.
          </p>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Paste a post, X/Twitter link, YouTube URL, or article..."
                  className="h-14 pl-12 pr-4 text-base w-full"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' && url.trim()) {
                      handleAnalyze();
                    }
                  }}
                />
              </div>
              <ShinyButton
                onClick={handleAnalyze}
                className="h-14 px-8 w-full sm:w-auto"
              >
                <Shield className="w-4 h-4 mr-2 inline-block" />
                Verify Now
              </ShinyButton>
            </div>

            <p className="text-sm text-muted-foreground mt-3">
              Supports X (Twitter), YouTube, Instagram, and web articles
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Confidence Scores</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Trusted Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Real-time Trends</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Shareable Cards</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20"
        >
          <Card className="bg-background/50 backdrop-blur-sm border-2">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-[family-name:var(--font-space-grotesk)]">
                Confidence Score (0–100)
              </h3>
              <p className="text-muted-foreground text-sm">
                See how strong the evidence is with color-coded scoring and detailed sub-scores.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-2">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-[family-name:var(--font-space-grotesk)]">
                Misinformation Trends
              </h3>
              <p className="text-muted-foreground text-sm">
                Live clusters by topic and region with velocity tracking and crisis alerts.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-2">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-[family-name:var(--font-space-grotesk)]">
                One-tap Share Cards
              </h3>
              <p className="text-muted-foreground text-sm">
                Platform-ready myth-vs-fact cards for X, WhatsApp, and Telegram.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
