import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import UserSync from "@/components/user-sync";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TinLens - AI-Powered Misinformation Detection",
  description:
    "Detect and verify misinformation with AI. Analyze content from YouTube, Instagram, and web URLs with confidence scores, tags, and citations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}
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
