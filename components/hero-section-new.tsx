"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vortex } from "@/components/ui/vortex";
import { TextRotate } from "@/components/ui/text-rotate";
import { Card, CardContent } from "@/components/ui/card";
import { PlayIcon, SparklesIcon, TrendingUpIcon, ShieldCheckIcon, Share2Icon } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsLoading(true);
    // Navigate to verify page with the URL
    router.push(`/verify?url=${encodeURIComponent(url)}`);
  };

  const features = [
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: "Confidence Score (0–100)",
      description: "See how strong the evidence is with sub-scores and a color band.",
    },
    {
      icon: <SparklesIcon className="h-6 w-6" />,
      title: "AI-Powered Tags",
      description: "Veracity, modality, domain, and source type — all auto-tagged.",
    },
    {
      icon: <TrendingUpIcon className="h-6 w-6" />,
      title: "Misinformation Trends",
      description: "Live clusters by topic/region with velocity tracking and crisis alerts.",
    },
    {
      icon: <Share2Icon className="h-6 w-6" />,
      title: "One-tap Share Cards",
      description: "Platform-ready PNGs for X/WhatsApp/Telegram — light/dark, WCAG-compliant.",
    },
  ];

  return (
    <section className="w-full relative min-h-screen overflow-hidden">
      {/* Vortex Background */}
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-24 w-full h-full"
      >
        <div className="container mx-auto px-4 py-20">
          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Main Headline with TextRotate */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight">
              <span className="block mb-4">Verify claims in</span>
              <TextRotate
                texts={["seconds", "real-time", "confidence", "clarity"]}
                mainClassName="text-primary inline-flex bg-clip-text text-transparent bg-gradient-to-r from-[#2E8FFF] to-[#00C2FF]"
                rotationInterval={2500}
                staggerDuration={0.025}
                staggerFrom="first"
              />
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              TinLens checks posts, links, and videos against trusted sources and explains the result with a <span className="font-semibold text-foreground">0–100 confidence score</span>.
            </p>

            {/* CTA Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-12">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="Paste a URL or post to verify..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 h-14 text-lg px-6 bg-background/80 backdrop-blur-sm border-2"
                  disabled={isLoading}
                />
                <ShinyButton
                  onClick={() => {
                    const fakeEvent = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>;
                    handleSubmit(fakeEvent);
                  }}
                  disabled={isLoading || !url.trim()}
                  className="px-8 h-14 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <PlayIcon className="h-5 w-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Verify Claim
                    </>
                  )}
                </ShinyButton>
              </div>
            </form>

            {/* Secondary CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Link href="/trends">
                <Button variant="outline" size="lg" className="font-semibold">
                  <TrendingUpIcon className="h-5 w-5 mr-2" />
                  View Trends
                </Button>
              </Link>
              <Link href="/download">
                <Button variant="outline" size="lg" className="font-semibold">
                  Install Chrome Extension
                </Button>
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="pt-12 text-sm text-muted-foreground">
              <p className="mb-4">Trusted by journalists, fact-checkers, and civic organizations</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background/40 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 space-y-3">
                  <div className="text-primary">{feature.icon}</div>
                  <h3 className="font-display font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto mt-32 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="text-4xl font-bold text-primary font-display">1</div>
                <h3 className="text-xl font-semibold font-display">Paste or highlight</h3>
                <p className="text-muted-foreground">
                  Submit a post, link, or video caption for verification.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-bold text-primary font-display">2</div>
                <h3 className="text-xl font-semibold font-display">AI verifies</h3>
                <p className="text-muted-foreground">
                  Semantic retrieval + trusted sources, then assigns a verdict and confidence score.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-bold text-primary font-display">3</div>
                <h3 className="text-xl font-semibold font-display">Share the truth</h3>
                <p className="text-muted-foreground">
                  Get clear explanations with citations or track trends in your region.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-6xl mx-auto mt-32">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-12">
              Why TinLens matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background/40 backdrop-blur-sm border-2">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="text-5xl font-bold text-primary font-display">6×</div>
                  <p className="text-lg font-semibold">Faster spread</p>
                  <p className="text-sm text-muted-foreground">
                    False posts spread faster and farther than true ones
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/40 backdrop-blur-sm border-2">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="text-5xl font-bold text-primary font-display">70%</div>
                  <p className="text-lg font-semibold">Crisis misinformation</p>
                  <p className="text-sm text-muted-foreground">
                    Misleading or out-of-context claims during crises
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/40 backdrop-blur-sm border-2">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="text-5xl font-bold text-primary font-display">80%</div>
                  <p className="text-lg font-semibold">Share before checking</p>
                  <p className="text-sm text-muted-foreground">
                    Most users don&apos;t verify sources before sharing
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Final CTA */}
          <div className="max-w-4xl mx-auto mt-32 text-center space-y-8 pb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-display">
              Know before you share
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TinLens gives you clarity, fast. Start verifying claims in seconds with AI-powered fact-checking.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <ShinyButton
                onClick={() => document.querySelector('input[type="url"]')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 h-14 text-lg font-semibold"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Verify a Claim
              </ShinyButton>
              <Link href="/teams">
                <Button variant="outline" size="lg" className="font-semibold h-14 px-8 text-lg">
                  For Teams
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Vortex>
    </section>
  );
}
