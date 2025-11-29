"use client";

import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  FileText,
  History,
  Home,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type SidebarLinkConfig = {
  label: string;
  href: string;
  icon: typeof Home;
};

const NAV_LINKS: SidebarLinkConfig[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Verify Content", href: "/verify", icon: ShieldCheck },
  { label: "Saved Analyses", href: "/analyses", icon: FileText },
  { label: "History", href: "/history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const highlightedLinks = useMemo(() => {
    return NAV_LINKS.map((link) => {
      const Icon = link.icon;
      const isActive =
        pathname === link.href || pathname?.startsWith(`${link.href}/`);

      return {
        ...link,
        icon: (
          <Icon
            className={cn(
              "h-6 w-6 flex-shrink-0 transition-colors",
              isActive
                ? "text-primary"
                : "text-neutral-700 dark:text-neutral-200"
            )}
          />
        ),
        className: cn(
          "rounded-xl px-3 py-2 text-base font-semibold transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-neutral-600 dark:text-neutral-300 hover:text-foreground"
        ),
      };
    });
  }, [pathname]);

  return (
    <div className="flex h-screen flex-col border border-neutral-200 bg-background dark:border-neutral-700 md:flex-row">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-8">
          <div className="flex flex-1 flex-col overflow-hidden">
            {sidebarOpen ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-1.5">
              {highlightedLinks.map((link) => (
                <SidebarLink
                  key={link.href}
                  link={{ label: link.label, href: link.href, icon: link.icon }}
                  className={link.className}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                  userButtonTrigger: "focus:shadow-none",
                },
              }}
            />
            {sidebarOpen && user && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user.firstName || user.username || "TinLens Analyst"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background via-background to-background/95">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

const EXPANDED_LOGO_PATH = "/Untitled (200 x 50 mm) (4).png";
const COLLAPSED_LOGO_PATH = "/Untitled design (18).png";

const Logo = () => (
  <Link
    href="/dashboard"
    className="flex items-center space-x-2 py-1 text-sm font-normal"
  >
    <Image
      src={EXPANDED_LOGO_PATH}
      alt="TinLens"
      width={150}
      height={40}
      className="flex-shrink-0"
      priority
    />
  </Link>
);

const LogoIcon = () => (
  <Link
    href="/dashboard"
    className="flex items-center space-x-2 py-1 text-sm font-normal"
  >
    <Image
      src={COLLAPSED_LOGO_PATH}
      alt="TinLens"
      width={44}
      height={44}
      className="rounded"
      priority
    />
  </Link>
);
