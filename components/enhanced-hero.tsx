"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon, Megaphone, ShieldCheck } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";

import { useLanguage } from "@/components/language-provider";
import { Vortex } from "@/components/ui/vortex";
import { TextRotate } from "@/components/ui/text-rotate";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
      toast.error("Create an account to verify content");
      router.push("/sign-up");
      return;
    }

    setIsLoading(true);
    router.push(`/?link=${encodeURIComponent(url.trim())}`);
  };

  return (
    <section id="verify" className="relative min-h-screen w-full overflow-hidden">
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex h-full w-full items-center justify-center px-4 py-24"
      >
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex flex-col sm:flex-row items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-6 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-amber-200">
              🎉 Limited Time
            </span>
            <div className="flex items-center gap-2 text-white/90">
              <Megaphone className="h-4 w-4 text-amber-300 animate-pulse" />
              <span className="font-medium">TinLens <span className="font-bold text-primary">Pro Plan</span> FREE for Mumbai Hacks participants!</span>
            </div>
          </div>

          <h1 className="mb-6 flex flex-wrap items-center justify-center gap-3 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span>Verify</span>
            <TextRotate
              texts={["claims", "links", "shorts", "forwarded posts", "videos"]}
              mainClassName="text-primary inline-flex"
              rotationInterval={2500}
              staggerDuration={0.025}
              staggerFrom="last"
            />
            <span>in seconds</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Agentic AI turns messy posts into atomic claims, checks trusted sources, and
            returns a verdict (True/False/Misleading/Unverifiable) with a 0–100 confidence
            score, tags, citations, and a myth-vs-fact card.
          </p>

          {isAuthenticated ? (
            <form onSubmit={handleAnalyze} className="mx-auto max-w-2xl space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Input
                  placeholder={
                    t.urlPlaceholder ||
                    "Paste a URL or caption (Instagram Reels, YouTube, WhatsApp text…)"
                  }
                  className="h-12 flex-1 min-w-0 text-base"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
                <ShinyButton
                  type="submit"
                  disabled={isLoading}
                  className="h-12 shrink-0 px-6 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="mr-2 inline-block h-4 w-4 animate-spin" />
                      {t.analyzing || "Analyzing"}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 inline-block h-4 w-4" />
                      {t.analyzeButton || "Analyze content"}
                    </>
                  )}
                </ShinyButton>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                TinLens ingests Instagram Reels, YouTube videos, and raw text. Safe Mode takes over automatically when confidence
                drops below 50.
              </p>
            </form>
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Create a TinLens account to run verifications inside your dashboard. The landing page stays public so you can explore first.
              </p>
              <ShinyButton
                onClick={() => router.push("/sign-up")}
                className="px-8 py-6 text-base font-semibold"
              >
                Get Started
              </ShinyButton>
            </div>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="bg-background/70">
              Instagram Reels
            </Badge>
            <Badge variant="outline" className="bg-background/70">
              YouTube
            </Badge>
            <Badge variant="outline" className="bg-background/70">
              Web articles
            </Badge>
            <Badge variant="outline" className="bg-background/70">
              Plain text / WhatsApp
            </Badge>
          </div>
        </div>
      </Vortex>
    </section>
  );
}
