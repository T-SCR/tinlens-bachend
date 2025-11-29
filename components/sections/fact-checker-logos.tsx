"use client"

const factCheckers = [
  {
    name: "AP",
    logo: "/logos/ap.svg",
    alt: "Associated Press",
  },
  {
    name: "FactCheck.org",
    logo: "/logos/factcheck.svg",
    alt: "FactCheck.org",
  },
  {
    name: "Snopes",
    logo: "/logos/snopes.svg",
    alt: "Snopes",
  },
]

export function FactCheckerLogos() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Trusted by fact-checkers worldwide
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          We verify against the most credible sources
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          {factCheckers.map((checker) => (
            <div
              key={checker.name}
              className="group flex items-center justify-center transition-opacity hover:opacity-80"
            >
              {checker.name === "AP" && (
                <div className="flex items-center gap-2 rounded-lg bg-white px-8 py-4 shadow-md">
                  <span className="text-4xl font-bold text-red-600">AP</span>
                  <span className="h-1 w-8 bg-red-600" />
                </div>
              )}
              {checker.name === "FactCheck.org" && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-900/10 px-8 py-4 shadow-md dark:bg-emerald-500/10">
                  <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                    FactCheck.org
                  </span>
                </div>
              )}
              {checker.name === "Snopes" && (
                <div className="flex items-center gap-2 rounded-lg bg-yellow-500 px-8 py-4 shadow-md">
                  <span className="text-3xl font-bold text-black">$nopes</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
