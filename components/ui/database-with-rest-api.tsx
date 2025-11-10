"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  ServerCog,
  ShieldCheck,
  Smartphone,
  SquareTerminal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const endpoints = [
  {
    method: "POST",
    path: "/verify",
    detail: "Paste text, URLs, or YouTube/Instagram IDs and get verdict + score.",
    sla: "TTV < 30s",
  },
  {
    method: "GET",
    path: "/trends",
    detail: "Returns clustered rumors with velocity, geo, and language filters.",
    sla: "Refresh 60s",
  },
  {
    method: "GET",
    path: "/case/:id",
    detail: "Full case file with citations, context check, and share-card URLs.",
    sla: "Cache 5m",
  },
  {
    method: "POST",
    path: "/feedback",
    detail: "Signal Safe Mode disagreements or send newsroom overrides.",
    sla: "Async",
  },
];

const surfaces = [
  {
    label: "Web App",
    icon: Globe,
    gradient: "from-sky-400/60 via-blue-500/60 to-cyan-400/60",
  },
  {
    label: "Chrome Extension",
    icon: SquareTerminal,
    gradient: "from-fuchsia-400/60 via-purple-500/60 to-indigo-500/60",
  },
  {
    label: "Mobile App",
    icon: Smartphone,
    gradient: "from-emerald-400/60 via-green-500/60 to-lime-400/60",
  },
];

export function DatabaseWithRestAPI() {
  return (
    <div className="rounded-[40px] border border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-50 shadow-[0_40px_120px_-60px_rgba(15,23,42,1)]">
      <div className="space-y-4">
        <Badge variant="outline" className="border-white/30 text-white">
          Shared backend
        </Badge>
        <h3 className="text-3xl font-semibold">One agentic pipeline. Three surfaces. Open APIs.</h3>
        <p className="text-sm text-white/70">
          TinLens runs Detector → Claimifier → Retriever → Veracity Judge → Explainer → Publisher on the same FastAPI
          stack. Tap the REST endpoints directly or ship bespoke dashboards with our webhooks.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-3">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.path}
              className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 shadow-inner"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                <span className="rounded-full border border-white/40 px-2 py-0.5 text-white">{endpoint.method}</span>
                <span>{endpoint.sla}</span>
              </div>
              <p className="mt-3 font-mono text-base text-white">{endpoint.path}</p>
              <p className="mt-2 text-white/70">{endpoint.detail}</p>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-3xl border border-dashed border-white/30 bg-white/5 px-4 py-3 text-sm text-white/80">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Safe Mode swaps the verdict whenever confidence &lt; 50 or trusted sources disagree.
          </div>
        </div>

        <div className="database-visual relative overflow-hidden rounded-[32px] bg-slate-950 p-8">
          <motion.div
            className="database-core mx-auto flex h-36 w-36 items-center justify-center rounded-[28px] bg-gradient-to-b from-sky-500 to-blue-800 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(46,143,255,0.35)",
                "0 0 0 25px rgba(46,143,255,0)",
              ],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeOut",
            }}
          >
            Unified
            <br />
            TinLens
            <br />
            Database
          </motion.div>

          <div className="database-orbit">
            {surfaces.map((surface, index) => {
              const Icon = surface.icon;
              return (
                <motion.div
                  key={surface.label}
                  className="database-node database-node--client"
                  style={
                    {
                      "--node-index": index,
                    } as CSSProperties
                  }
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20 + index * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className={`database-node-inner bg-gradient-to-br ${surface.gradient}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p>{surface.label}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="database-node database-node--api"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="database-node-inner bg-white/10 text-white">
              <ServerCog className="h-4 w-4" />
            </div>
            <p>REST + Webhooks</p>
          </motion.div>

          <div className="database-connections">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.span
                key={index}
                className="database-connection"
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            ))}
          </div>

          <div className="mt-10 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-sky-300" />
              <span>Publish verdicts back into chats with share-card short links.</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-sky-300" />
              <span>Cache the latest debunks offline in the mobile app for crisis zones.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
