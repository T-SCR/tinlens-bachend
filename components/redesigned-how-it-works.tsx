"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Search, 
  FileText, 
  Database, 
  Scale, 
  MessageSquare 
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Paste Content Link",
    description: "Paste any public X (Twitter), YouTube, Instagram post, or article URL into our secure analyzer.",
    icon: Search,
    features: ["Works with X (Twitter) & more", "Secure URL processing", "Multi-platform support"]
  },
  {
    number: "02",
    title: "AI Transcription & Extraction",
    description: "AI extracts text from posts and transcribes video/audio using OpenAI Whisper.",
    icon: FileText,
    features: ["OpenAI Whisper for audio", "Extracts post text", "Multi-language support"]
  },
  {
    number: "03",
    title: "News & Claim Detection",
    description: "Detects news, opinions, and factual claims in the content for verification.",
    icon: Database,
    features: ["AI claim extraction", "News vs opinion detection", "Context analysis"]
  },
  {
    number: "04",
    title: "Fact-Checking & Analysis",
    description: "Verifies claims using web search, databases, and evaluates source credibility.",
    icon: Scale,
    features: ["Web & database verification", "Credibility checks", "Source reliability analysis"]
  },
  {
    number: "05",
    title: "Credibility Report",
    description: "Get a detailed report with verdicts, confidence scores, sources, and creator ratings.",
    icon: MessageSquare,
    features: ["Truth/Misleading/Unverifiable", "0-100 Confidence Score", "Cited sources"]
  }
];

export function RedesignedHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
            Our 5-step process ensures comprehensive fact-checking
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From detection to delivery, TinLens uses advanced AI to verify claims and provide clear, actionable insights.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl font-bold text-primary/20 font-[family-name:var(--font-jetbrains-mono)]">
                          {step.number}
                        </span>
                        <h3 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 text-lg">
                        {step.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {step.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
