'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button, buttonVariants } from '@/components/ui/button'
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon'
import { useScroll } from '@/components/ui/use-scroll'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Verify', href: '/verify' },
  { label: 'Trends', href: '/trends' },
  { label: 'For Teams', href: '/teams' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Docs', href: '/docs' },
  { label: 'About', href: '/about' },
  { label: 'Download', href: '/download' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(10)

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-6xl border-b border-transparent md:rounded-3xl md:border md:transition-all md:ease-out',
        {
          'bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border backdrop-blur-lg md:top-4 md:max-w-5xl md:shadow-md':
            scrolled && !open,
          'bg-background/90': open,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-20 w-full items-center justify-between px-6 md:h-16 md:px-8 md:transition-all md:ease-out',
          {
            'md:px-6': scrolled,
          },
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Untitled (200 x 50 mm) (5).png"
            alt="TinLens"
            width={140}
            height={36}
            className="h-10 w-auto dark:hidden"
            priority
          />
          <Image
            src="/Untitled (200 x 50 mm) (4).png"
            alt="TinLens"
            width={140}
            height={36}
            className="hidden h-10 w-auto dark:block"
            priority
          />
        </Link>
        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              className={buttonVariants({
                variant: 'ghost',
                className: 'text-sm font-semibold',
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Button variant="outline" asChild className="rounded-full px-5">
            <Link href="/download#extension">Install Extension</Link>
          </Button>
          <Button asChild className="rounded-full px-6">
            <Link href="/download#apps">Get the App</Link>
          </Button>
        </div>
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div
        className={cn(
          'bg-background/95 fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-4 p-6',
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => (
              <Link
                key={link.label}
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start text-base',
                })}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/download#apps">Get the App</Link>
            </Button>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/download#extension">Install Extension</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
