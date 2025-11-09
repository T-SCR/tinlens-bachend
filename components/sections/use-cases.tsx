/* eslint-disable @next/next/no-img-element */

const useCases = [
  {
    title: "Everyday users",
    description:
      "Paste a forward, get a clear verdict in under a minute with citations and Safe Mode guidance.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    tags: ["Myth vs Fact", "Confidence score"],
  },
  {
    title: "Community admins",
    description:
      "Keep WhatsApp and Telegram groups factual. TinLens replies inline with bilingual myth-vs-fact cards.",
    image:
      "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=900&q=80",
    tags: ["Inline bot", "Auto-share"],
  },
  {
    title: "Journalists & NGOs",
    description:
      "Monitor the Trends hub, download a share card, and publish counter-messaging with timestamps.",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    tags: ["Trends hub", "Crisis alerts"],
  },
  {
    title: "Health & disaster responders",
    description:
      "Crisis alerts consolidate official resources, rumor escalation, and Safe Mode advisories.",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80",
    tags: ["Official links", "Velocity risk"],
  },
  {
    title: "Public agencies (Pro)",
    description:
      "Dashboards with exports, language packs, and on-prem deployments for regulated missions.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    tags: ["Dashboards", "API"],
  },
]

export function UseCasesSection() {
  return (
    <section className="py-20" id="use-cases">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Use cases
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Built for citizens, newsrooms, and institutions.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map(({ title, description, image, tags }) => (
          <article
            key={title}
            className="group overflow-hidden rounded-[28px] border border-foreground/5 bg-card shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-4 left-4 text-sm font-semibold text-white">
                {title}
              </p>
            </div>
            <div className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">{description}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
