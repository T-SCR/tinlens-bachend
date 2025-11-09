"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Vortex } from "@/components/ui/vortex"

export function CTASection() {
  return (
    <section className="py-24">
      <div className="overflow-hidden rounded-[40px] border border-primary/10">
        <Vortex
          backgroundColor="#020617"
          className="grid place-items-center px-6 py-16 text-center lg:px-20"
        >
          <div className="space-y-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Ready to fight misinformation?
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Ready to Fight Misinformation?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              Join the fight against misinformation. Start fact-checking content today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/news">
                <ShinyButton className="px-8 py-6 text-base font-semibold">
                  Start Analyzing Content
                </ShinyButton>
              </Link>
              <Link href="/download#extension">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  Install the Chrome extension
                </Button>
              </Link>
              <Link href="/download#apps">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Get the app
                </Button>
              </Link>
            </div>
          </div>
        </Vortex>
      </div>
    </section>
  )
}
