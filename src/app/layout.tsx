import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elite AI Trading Platform | Professional Institutional Terminal",
  description: "Ultra-professional AI-powered trading platform with real-time market data, quantitative calculators, predictive AI signals, and institutional-grade analytics. Similar to Bloomberg Terminal and TradingView Pro.",
  keywords: ["AI Trading", "Quantitative Trading", "Bloomberg Terminal", "TradingView", "Forex", "Crypto", "Stocks", "AI Signals", "Risk Management", "VaR"],
  authors: [{ name: "Elite AI Trading" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%232979ff' width='100' height='100' rx='20'/><text x='50' y='65' font-size='50' text-anchor='middle' fill='white'>⚡</text></svg>",
  },
  openGraph: {
    title: "Elite AI Trading Platform",
    description: "Professional institutional trading terminal with AI-powered analysis",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite AI Trading Platform",
    description: "Professional institutional trading terminal with AI-powered analysis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
