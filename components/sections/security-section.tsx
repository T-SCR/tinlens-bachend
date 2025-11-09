import { Fingerprint, Lock, ShieldCheck } from "lucide-react"

const safeguards = [
  {
    title: "No PII required",
    description: "We store URLs, snippets, timestamps, verdicts, and telemetry—nothing personally identifiable.",
    icon: Lock,
  },
  {
    title: "Source transparency",
    description: "Every case includes citations, timestamps, and domains so reviewers can audit the evidence path.",
    icon: ShieldCheck,
  },
  {
    title: "Responsible AI guardrails",
    description: "Safe Mode, bilingual explainers, and human review for sensitive topics keep impact-first teams safe.",
    icon: Fingerprint,
  },
]

export function SecuritySection() {
  return (
    <section className="py-20" id="security">
      <div className="rounded-[36px] border border-foreground/5 bg-gradient-to-br from-primary/5 via-background to-background p-10 shadow-lg shadow-primary/5">
        <div className="mb-8 space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Security & Privacy
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built with transparency and human safety in mind.
          </h2>
          <p className="text-base text-muted-foreground">
            TinLens is a safety-first AI team. Evidence trails are auditable and we never store personal conversations.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {safeguards.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/40 bg-white/60 p-6 text-left shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/60"
            >
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
