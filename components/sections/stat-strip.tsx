import { AlertTriangle, Share2, TimerReset } from "lucide-react"

const stats = [
  {
    label: "False content travels faster",
    value: "70%",
    detail: "False stories are 70% more likely to be reshared than true ones (MIT, 2018).",
    icon: TimerReset,
  },
  {
    label: "Crisis posts need context",
    value: "41%",
    detail: "41% of crisis chatter sampled by fact-checkers was misleading or out of context.",
    icon: AlertTriangle,
  },
  {
    label: "People rarely check sources",
    value: "59%",
    detail: "59% of users forward links without opening a single citation (Pew, 2023).",
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
          Bring the latest data when you publish case studies - the template is ready.
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
