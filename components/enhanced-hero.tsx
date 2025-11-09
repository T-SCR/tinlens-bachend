"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlayIcon, LoaderIcon, Megaphone } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";
import Link from "next/link";
import { TextRotate } from "@/components/ui/text-rotate";
import { Vortex } from "@/components/ui/vortex";
import { useLanguage } from "@/components/language-provider";

export function EnhancedHero() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error(t.enterUrl || "Please enter a URL");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to verify content");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    router.push(`/?link=${encodeURIComponent(url.trim())}`);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex items-center justify-center px-4 py-24 w-full h-full"
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Fact Checking
          </Badge>
          
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
            <Megaphone className="h-4 w-4" />
            <span>Launch promo: all new signups unlock TinLens Pro (unlimited) for free.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl flex flex-wrap items-center justify-center gap-4">
            <span>Detect</span>
            <TextRotate
              texts={["Misinformation", "Fake News", "Deepfakes", "Propaganda"]}
              mainClassName="text-primary inline-flex"
              rotationInterval={2500}
              staggerDuration={0.025}
              staggerFrom="last"
            />
            <span>with AI</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t.heroSubtitle || "Detect and verify misinformation with AI. Paste text, Instagram Reels, YouTube videos, or article links to get instant fact-checking with confidence scores and citations."}
          </p>

          <form onSubmit={handleAnalyze} className="mx-auto max-w-2xl space-y-4">
            <div className="flex gap-3 items-center justify-center">
              <Input
                placeholder={t.urlPlaceholder || "Enter a URL (e.g., https://www.instagram.com/reel/...)"}
                className="flex-1 h-12 text-base min-w-0"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <ShinyButton
                onClick={() => {
                  const fakeEvent = new Event('submit') as unknown as React.FormEvent;
                  handleAnalyze(fakeEvent);
                }}
                className="px-6 h-12 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="h-4 w-4 mr-2 animate-spin inline-block" />
                    {t.analyzing || "Analyzing"}
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2 inline-block" />
                    {t.analyzeButton || "Verify Content"}
                  </>
                )}
              </ShinyButton>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Use any live Instagram Reel, YouTube video, or public article link. TinLens runs the full verification—no demo or synthetic responses.
            </p>

            {!isAuthenticated && (
              <p className="text-sm text-center">
                <Link href="/sign-in" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
                {" or "}
                <Link href="/sign-up" className="text-primary hover:underline font-medium">
                  create an account
                </Link>
                {" "}to start verifying content
              </p>
            )}
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background/50">Instagram</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background/50">YouTube</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background/50">Web Articles</Badge>
            </div>
          </div>
        </div>
      </Vortex>
    </section>
  );
}
