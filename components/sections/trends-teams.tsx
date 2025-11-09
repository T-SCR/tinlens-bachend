import { ArrowUpRight, BarChart3, BellRing, Server } from "lucide-react"

const cards = [
  {
    title: "Trends hub",
    description:
      "Explore fast-rising rumor clusters by topic, language, domain, region, and time window. Crisis banner pins urgent advisories.",
    bullets: [
      "Velocity + risk badges",
      "Representative claims and verdict mix",
      "Official resources attached to alerts",
    ],
    icon: BarChart3,
    cta: { label: "View Trends", href: "/trends" },
  },
  {
    title: "TinLens for Teams",
    description:
      "Dashboards, alerts, exports, and API access for newsrooms, NGOs, and agencies that need enterprise controls.",
    bullets: [
      "CSV/API export + custom webhooks",
      "Language packs & on-prem options",
      "Workflow banner: Detect → Verify → Explain → Publish → Measure",
    ],
    icon: Server,
    cta: { label: "Talk to us", href: "/teams" },
  },
]

export function TrendsAndTeams() {
  return (
    <section className="py-20" id="trends">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Trends & Pro
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          See pattern shifts early. Equip your trust desk.
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {cards.map(({ title, description, bullets, icon: Icon, cta }) => (
          <article
            key={title}
            className="relative overflow-hidden rounded-[32px] border border-foreground/5 bg-gradient-to-br from-background via-background to-primary/5 p-8 shadow-xl shadow-primary/5"
          >
            <div className="absolute inset-0 opacity-10">
              <BellRing className="h-full w-full text-primary" />
            </div>
            <div className="relative space-y-5">
              <div className="flex items-center gap-3 text-primary">
                <Icon className="h-6 w-6" />
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                  {title}
                </p>
              </div>
              <p className="text-lg text-foreground">{description}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <ArrowUpRight className="mt-1 h-4 w-4 text-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <a
                href={cta.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
