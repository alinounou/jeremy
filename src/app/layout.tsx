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
  title: "FXIFY Futures | Trusted Futures Prop Firm for Traders Worldwide",
  description: "Join FXIFY Futures – a trusted and valued futures prop firm by traders around the world. Get funded, trade with confidence and unlock your full potential today.",
  keywords: ["Prop Trading", "Futures Trading", "Funded Trading", "Prop Firm", "Futures Prop Firm", "Get Funded", "Trading Capital"],
  authors: [{ name: "FXIFY Futures" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%232979ff' width='100' height='100' rx='20'/><text x='50' y='65' font-size='50' text-anchor='middle' fill='white'>📈</text></svg>",
  },
  openGraph: {
    title: "FXIFY Futures | Trusted Futures Prop Firm",
    description: "Get funded up to $200,000 and keep up to 90% of profits. Trade futures with professional capital.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FXIFY Futures | Trusted Futures Prop Firm",
    description: "Get funded up to $200,000 and keep up to 90% of profits.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
