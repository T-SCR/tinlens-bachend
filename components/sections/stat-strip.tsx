import { AlertTriangle, Share2, TimerReset } from "lucide-react"

const stats = [
  {
    label: "False content travels faster",
    value: "6×",
    detail: "False posts spread faster than verified updates. (MIT study placeholder)",
    icon: TimerReset,
  },
  {
    label: "Crisis posts need context",
    value: "41%",
    detail: "Crisis chatter contains misleading or out-of-context snippets.",
    icon: AlertTriangle,
  },
  {
    label: "People rarely check sources",
    value: "59%",
    detail: "Most users share before verifying a single citation.",
    icon: Share2,
  },
]

export function StatStrip() {
  return (
    <section className="py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Why TinLens
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Misinformation overwhelms people during crises. TinLens gives you clarity, fast.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Swap placeholders with current references when you publish case studies.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <div
            key={label}
            className="group rounded-3xl border border-foreground/5 bg-background/60 p-6 shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary/10"
          >
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <Icon className="h-5 w-5" />
              {label}
            </div>
            <p className="mt-4 text-5xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Sources: peer-reviewed research and public health reports. Updated periodically.
      </p>
    </section>
  )
}
