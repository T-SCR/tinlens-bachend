"use client"

import Link from "next/link"
import { Github, Linkedin, Send, Twitter } from "lucide-react"

import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Verify", href: "/verify" },
      { label: "Trends", href: "/trends" },
      { label: "For Teams", href: "/teams" },
      { label: "Download", href: "/download" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Status", href: "/status" },
      { label: "Brand kit", href: "/brand" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Responsible AI", href: "/responsible-ai" },
    ],
  },
]

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/tinlens", label: "X / Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/tinlens", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/tinlens", label: "GitHub" },
  { icon: Send, href: "https://whatsapp.com/channel/tinlens", label: "WhatsApp Channel" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-background/90">
      <FooterBackgroundGradient />
      <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <p className="text-2xl font-semibold">TinLens</p>
            <p className="text-sm text-muted-foreground">
              Agentic AI that verifies posts, links, and videos with transparent citations so communities can share the truth faster.
            </p>
            <p className="text-xs text-muted-foreground">© TinLens · Built with transparency.</p>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold">Language</span>
              <button className="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary">
                EN
              </button>
              <button className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                HI
              </button>
              <span className="text-muted-foreground text-xs">More soon</span>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        className="transition hover:text-foreground"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border/40 pt-6">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              rel="noreferrer"
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>
        <div className="relative mt-10 hidden h-56 w-full lg:block">
          <TextHoverEffect text="TinLens" className="text-muted-foreground/30" />
        </div>
      </div>
    </footer>
  )
}
