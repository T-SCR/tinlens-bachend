"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MoveRight, PhoneCall } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0)
  const titles = useMemo(
    () => ["accurate", "auditable", "explainable", "shareable", "safe"],
    []
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1))
    }, 2200)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  return (
    <div className="w-full">
      <div className="mx-auto flex flex-col items-center justify-center gap-8 py-16 text-center lg:py-24">
        <div>
          <Button
            variant="secondary"
            size="sm"
            className="gap-3 rounded-full border border-primary/30 bg-white/20 text-primary shadow-lg backdrop-blur"
          >
            Read about Safe Mode
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="text-3xl font-light tracking-tight text-muted-foreground">
            TinLens keeps verification
          </h3>
          <p className="relative flex w-full justify-center overflow-hidden text-5xl font-semibold tracking-tight sm:text-6xl">
            {titles.map((title, index) => (
              <motion.span
                key={title}
                className="absolute text-primary"
                initial={{ opacity: 0, y: -100 }}
                transition={{ type: "spring", stiffness: 100 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : {
                        y: titleNumber > index ? -150 : 150,
                        opacity: 0,
                      }
                }
              >
                {title}
              </motion.span>
            ))}
          </p>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Automated claim detection, transparent evidence, and human-safe guard
            rails combine so your newsroom or community can move faster without
            spreading mistakes.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gap-3 rounded-full px-8">
            Talk to the trust team <PhoneCall className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-3 rounded-full border-white/40 bg-transparent px-8 text-foreground"
          >
            Explore TinLens Docs <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
