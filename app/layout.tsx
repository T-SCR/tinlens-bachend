import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import UserSync from "@/components/user-sync";
import { Toaster } from "sonner";
import { Header } from "@/components/ui/header-2";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TinLens - Verify Claims in Seconds | Know Before You Share",
  description:
    "TinLens verifies posts, links, and videos with trusted sources using AI. Get a 0-100 confidence score, citations, and shareable myth-vs-fact cards instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrains.variable} antialiased font-sans`}
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
