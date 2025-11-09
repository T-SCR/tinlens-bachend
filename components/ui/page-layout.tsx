import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  includeFooter?: boolean;
  variant?: "default" | "gradient" | "simple";
}

export function PageLayout({
  children,
  className,
  includeFooter = true,
  variant = "default",
}: PageLayoutProps) {
  const variants = {
    default: "min-h-screen bg-background",
    gradient:
      "min-h-screen bg-gradient-to-br from-background via-white/80 to-muted/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
    simple: "min-h-screen bg-background",
  }

  return (
    <div className={cn(variants[variant], className)}>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-6">{children}</div>
      {includeFooter && <Footer />}
    </div>
  )
}
