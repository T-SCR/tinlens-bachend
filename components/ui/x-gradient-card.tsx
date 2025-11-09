'use client'
/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { VerifiedIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface ReplyProps {
  authorName: string
  authorHandle: string
  authorImage: string
  content: string
  isVerified?: boolean
  timestamp: string
}

interface XCardProps {
  link?: string
  authorName: string
  authorHandle: string
  authorImage: string
  content: string[]
  isVerified?: boolean
  timestamp: string
  reply?: ReplyProps
}

function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/30 dark:ring-white/10">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

export function XCard({
  link = "https://x.com/tinlens/status/demo",
  authorName,
  authorHandle,
  authorImage,
  content,
  isVerified = true,
  timestamp,
  reply,
}: XCardProps) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noreferrer"
      className="group block focus-visible:outline-none"
    >
      <div
        className={cn(
          "relative isolate w-full max-w-xl rounded-2xl p-1.5 shadow-2xl transition duration-300",
          "bg-gradient-to-br from-white/60 via-white to-white/60 dark:from-slate-900 dark:via-slate-900 dark:to-black",
          "before:absolute before:inset-0 before:-z-10 before:rounded-[22px] before:bg-gradient-to-r before:from-[#2E8FFF] before:to-[#00C2FF] before:opacity-60 before:blur-xl before:transition-all group-hover:before:opacity-100",
          "border border-black/10 dark:border-white/10 backdrop-blur-xl"
        )}
      >
        <div className="rounded-[18px] border border-black/10 bg-gradient-to-br from-white/70 to-white/30 p-5 shadow-inner dark:border-white/10 dark:from-slate-900/70 dark:to-slate-900/30">
          <div className="flex gap-3">
            <Avatar src={authorImage} alt={authorName} />
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold">{authorName}</span>
                {isVerified && (
                  <VerifiedIcon className="h-4 w-4 text-sky-400 dark:text-sky-300" />
                )}
                <span className="text-muted-foreground">@{authorHandle}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{timestamp}</span>
              </div>
              <div className="mt-2 space-y-2 text-sm text-foreground/90 dark:text-white/90">
                {content.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-muted-foreground transition hover:text-foreground"
              aria-label="Open on X"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1200"
                height="1227"
                fill="none"
                viewBox="0 0 1200 1227"
                className="h-4 w-4"
              >
                <path
                  fill="currentColor"
                  d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                />
              </svg>
            </button>
          </div>

          {reply && (
            <div className="mt-4 space-y-3 rounded-xl border border-white/30 bg-white/30 p-3 text-sm shadow-inner dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <Avatar src={reply.authorImage} alt={reply.authorName} />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{reply.authorName}</span>
                    {reply.isVerified && (
                      <VerifiedIcon className="h-4 w-4 text-sky-400 dark:text-sky-300" />
                    )}
                    <span className="text-muted-foreground">
                      @{reply.authorHandle}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {reply.timestamp}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{reply.content}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export type { XCardProps }
