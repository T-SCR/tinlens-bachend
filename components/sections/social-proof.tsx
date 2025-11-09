const quotes = [
  {
    quote:
      "TinLens helped our newsroom verify posts in under a minute during monsoon alerts. Safe Mode kept us honest when evidence was thin.",
    author: "MetroLine News Desk",
    role: "Breaking editor",
  },
  {
    quote:
      "Community admins finally have receipts. Myth-vs-fact cards stopped rumor spirals in our WhatsApp groups.",
    author: "Mahila Civic Collective",
    role: "Community program lead",
  },
]

export function SocialProof() {
  return (
    <section className="py-16">
      <div className="grid gap-6 md:grid-cols-2">
        {quotes.map(({ quote, author, role }) => (
          <figure
            key={author}
            className="rounded-3xl border border-foreground/5 bg-muted/40 p-6 shadow-lg"
          >
            <p className="text-lg font-medium text-foreground">{quote}</p>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              {author} · {role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
