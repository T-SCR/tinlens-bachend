import { ArrowRight, Chrome, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Download TinLens surfaces",
  description: "Grab the Chrome extension and mobile app links for TinLens.",
};

export default function DownloadPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Download</p>
        <h1 className="mt-4 text-4xl font-bold">TinLens surfaces</h1>
        <p className="mt-3 text-muted-foreground">
          Install the Chrome extension for inline verdicts or get the mobile app for offline crisis alerts.
          Both connect to the same secure backend you access on the web.
        </p>
      </div>

      <div className="mx-auto mt-12 grid gap-6 max-w-3xl">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Chrome className="h-4 w-4" />
              Chrome extension
            </div>
            <p className="text-base text-muted-foreground">
              Highlight a claim on any site, see the verdict popover, and open the full case in the dashboard.
            </p>
            <Button className="w-fit gap-2" asChild>
              <a href="https://chromewebstore.google.com" target="_blank" rel="noreferrer">
                Install from Chrome Web Store
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Download className="h-4 w-4" />
              Mobile app (beta)
            </div>
            <p className="text-base text-muted-foreground">
              Receive crisis alerts, verify on the go, and cache the latest myth-vs-fact cards for offline forwarding.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2" asChild>
                <a href="https://apps.apple.com" target="_blank" rel="noreferrer">
                  iOS TestFlight
                </a>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <a href="https://play.google.com" target="_blank" rel="noreferrer">
                  Android (coming soon)
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
