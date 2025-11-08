import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import UserSync from "@/components/user-sync";
import { Toaster } from "sonner";
import { Header } from "@/components/ui/header-2";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TinLens — Verify claims in seconds",
  description:
    "TinLens is an agentic AI that verifies posts, links, and videos with trusted sources and a 0–100 confidence score, then lets you share myth‑vs‑fact cards.",
  openGraph: {
    title: "TinLens — Verify claims in seconds",
    description: "Know before you share. TinLens checks claims against trusted sources and explains the result with confidence scores.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <Providers>
          {/* User sync is used to sync the user to the database */}
          <UserSync />
          <Header />
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
