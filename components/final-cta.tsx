'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Chrome, Download, Mail, Shield, TrendingUp } from "lucide-react";

import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden py-24" id="contact">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold md:text-6xl">
            Ready to fight misinformation with TinLens?
          </h2>

          <p className="mt-4 text-xl text-muted-foreground">
            Verify a claim, install the Chrome extension, monitor Trends, or get mobile alerts.
            Everything else lives inside the dashboard once you sign in.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ShinyButton onClick={() => router.push("/verify")} className="px-8 py-6 text-lg">
              <Shield className="mr-2 inline-block h-5 w-5" />
              Verify a claim
            </ShinyButton>
            <Button variant="outline" size="lg" className="gap-2 px-8 py-6" asChild>
              <Link href="/download">
                <Chrome className="h-5 w-5" />
                Install Extension
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="gap-2 px-6" asChild>
              <Link href="/trends">
                <TrendingUp className="h-5 w-5" />
                View Trends
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="gap-2 px-6" asChild>
              <a href="https://apps.apple.com" target="_blank" rel="noreferrer">
                <Download className="h-5 w-5" />
                Get the app
              </a>
            </Button>
          </div>

          <div className="mt-10 rounded-3xl border border-dashed border-primary/40 bg-primary/5 px-6 py-5 text-sm text-muted-foreground">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <span className="flex items-center gap-2 font-medium text-primary">
                <Mail className="h-4 w-4" />
                hello@tinlens.ai
              </span>
              <span className="hidden text-muted-foreground sm:inline">|</span>
              <span>Enterprise plans, language packs, and on-prem deployments available on request.</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Safe Mode protects audiences when confidence &lt; 50. TinLens never shares personal data - only URLs, snippets, and telemetry to improve accuracy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
