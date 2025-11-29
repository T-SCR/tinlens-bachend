import React from "react";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

function toInt(value: string | null | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : fallback;
}

function shorten(text: string, max = 90) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "TinLens Analysis";
  const verdict = searchParams.get("verdict") || "unverifiable";
  const confidence = toInt(searchParams.get("confidence"), 0);
  const creator = searchParams.get("creator") || "Unknown";
  const domain = searchParams.get("domain") || "";
  const platform = searchParams.get("platform") || "web";

  const badgeColor =
    verdict === "verified"
      ? "#16a34a"
      : verdict === "misleading" || verdict === "false"
      ? "#dc2626"
      : verdict === "unverifiable"
      ? "#f59e0b"
      : "#6b7280";

  const root = React.createElement(
    "div",
    {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 48,
        background: "linear-gradient(135deg, #0b1220 0%, #0f172a 100%)",
        color: "#e5e7eb",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell',
      },
    },
    [
      // Header
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
        },
        [
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 12 } },
            [
              React.createElement("div", {
                style: {
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background:
                    "radial-gradient(100% 100% at 30% 20%, rgba(99,102,241,0.9) 0%, rgba(20,184,166,0.9) 100%)",
                  boxShadow: "0 10px 30px rgba(99,102,241,0.35)",
                },
              }),
              React.createElement(
                "div",
                { style: { fontSize: 28, fontWeight: 700 } },
                "TinLens"
              ),
            ]
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: badgeColor,
                fontSize: 18,
                fontWeight: 700,
                textTransform: "capitalize",
              },
            },
            verdict
          ),
        ]
      ),
      // Body
      React.createElement(
        "div",
        { style: { display: "flex", gap: 36, alignItems: "center" } },
        [
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flex: 1,
              },
            },
            [
              React.createElement(
                "div",
                {
                  style: {
                    fontSize: 20,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  },
                },
                `${platform} · ${domain}`
              ),
              React.createElement(
                "div",
                {
                  style: {
                    fontSize: 54,
                    lineHeight: 1.1,
                    fontWeight: 800,
                    color: "#f8fafc",
                  },
                },
                shorten(title, 120)
              ),
              React.createElement(
                "div",
                { style: { fontSize: 20, color: "#94a3b8" } },
                `By ${creator}`
              ),
            ]
          ),
          React.createElement(
            "div",
            {
              style: {
                width: 260,
                height: 260,
                borderRadius: 24,
                background: "rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              },
            },
            [
              React.createElement(
                "div",
                { style: { fontSize: 18, color: "#cbd5e1", marginBottom: 8 } },
                "Confidence"
              ),
              React.createElement(
                "div",
                {
                  style: {
                    fontSize: 88,
                    fontWeight: 900,
                    color: "#e2e8f0",
                    lineHeight: 1,
                  },
                },
                `${confidence}%`
              ),
            ]
          ),
        ]
      ),
      // Footer
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#94a3b8",
            fontSize: 18,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 18,
          },
        },
        [
          React.createElement("div", null, "tinlens.vercel.app"),
          React.createElement(
            "div",
            null,
            "Evidence-backed analysis · Share responsibly"
          ),
        ]
      ),
    ]
  );

  return new ImageResponse(root, { width: 1200, height: 630 });
}
