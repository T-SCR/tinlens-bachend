"use client";

import { Code2, FileJson2, Webhook } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const endpoints = [
  {
    label: "POST /verify",
    description: "Submit text, URL, YouTube, or Instagram IDs; returns verdict, confidence, tags, citations.",
  },
  {
    label: "GET /trends",
    description: "Fetch rumor clusters with filters for domain, geo, language, and time window (24h/7d/30d).",
  },
  {
    label: "GET /case/:id",
    description: "Retrieve a full case file with myth-vs-fact card URLs, Safe Mode status, and timestamps.",
  },
  {
    label: "POST /feedback",
    description: "Send helpful/not helpful signals, newsroom overrides, or crisis escalation notes.",
  },
];

export function DocsPreviewSection() {
  return (
    <section className="py-24" id="docs">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-3 gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            API + Docs
          </Badge>
          <h3 className="text-3xl font-semibold tracking-tight">
            Build on TinLens with REST + webhooks
          </h3>
          <p className="mt-3 text-base text-muted-foreground">
            Next.js 15 front-end, FastAPI microservices, and Qdrant/FAISS retrieval exposed through a secure API layer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <FileJson2 className="h-5 w-5 text-primary" />
                Core endpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.label} className="rounded-2xl border border-dashed border-primary/30 p-4">
                  <p className="font-mono text-sm text-primary">{endpoint.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 bg-muted/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Webhook className="h-5 w-5 text-primary" />
                Webhooks & instrumentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Subscribe to <strong>verdict_published</strong>, <strong>trend_spike</strong>, and <strong>safe_mode_triggered</strong> events to power newsroom dashboards.
              </p>
              <p>
                Instrumented with Plausible events: <code>verify_submitted</code>, <code>verdict_shown</code>, <code>safe_mode</code>, <code>share_card_exported</code>, <code>trend_opened</code>.
              </p>
              <p>
                SDKs: REST, GraphQL (beta), and server-to-server keys for Fly.io/Render workers.
              </p>
              <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
                <p className="text-sm">
                  Docs include schema definitions, auth instructions, and shadcn/ui component guidelines so you can extend TinLens without breaking the UX.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
