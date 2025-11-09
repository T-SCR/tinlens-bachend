"use client";

import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Chrome } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
            Ready to Fight Misinformation?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10">
            Join the fight against misinformation. Start fact-checking content today with AI-powered verification.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <ShinyButton onClick={() => window.location.href = '/'} className="text-lg px-8 py-6">
              <Shield className="w-5 h-5 mr-2 inline-block" />
              Verify a Claim Now
            </ShinyButton>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Chrome className="w-5 h-5 mr-2" />
              Install Chrome Extension
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-8">
            No signup required to verify content · Free for personal use · Enterprise plans available
          </p>
        </motion.div>
      </div>
    </section>
  );
}
