import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";

export const runtime = "nodejs";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(id));
}

async function checkOpenAI(): Promise<{ configured: boolean; reachable?: boolean; error?: string }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return { configured: false };
  try {
    const res = await withTimeout(
      fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
      }),
      8000
    );
    return { configured: true, reachable: res.ok };
  } catch (e) {
    return { configured: true, reachable: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function checkExa(): Promise<{ configured: boolean; reachable?: boolean; error?: string }> {
  const key = process.env.EXA_API_KEY;
  if (!key) return { configured: false };
  try {
    const res = await withTimeout(
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "x-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ query: "tinlens health check", numResults: 1 }),
      }),
      8000
    );
    return { configured: true, reachable: res.ok };
  } catch (e) {
    return { configured: true, reachable: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function checkFirecrawl(probe: boolean): Promise<{ configured: boolean; reachable?: boolean; error?: string }> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return { configured: false };
  if (!probe) return { configured: true };
  try {
    const app = new FirecrawlApp({ apiKey: key });
    const result = await app.scrapeUrl("https://example.com", { formats: ["markdown"], waitFor: 250 });
    return { configured: true, reachable: !!result?.success };
  } catch (e) {
    return { configured: true, reachable: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const probe = url.searchParams.get("probe") === "true";
  const strict = process.env.STRICT_REAL_MODE === "true" || process.env.STRICT_REAL_MODE === "1";

  const [openai, exa, firecrawl] = await Promise.all([
    checkOpenAI(),
    checkExa(),
    checkFirecrawl(probe),
  ]);

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    strictRealMode: strict,
    probe,
    integrations: {
      openai,
      exa,
      firecrawl,
    },
  });
}
