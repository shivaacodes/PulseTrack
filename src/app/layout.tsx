// Polyfill/stub global.localStorage on the server to prevent crash on Node.js v25+
if (typeof globalThis !== 'undefined' && typeof window === 'undefined') {
  const safeStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
  try {
    Object.defineProperty(globalThis, 'localStorage', {
      value: safeStorage,
      writable: true,
      configurable: true,
    });
  } catch (e) {
    // Ignore
  }
}

import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Oswald } from "next/font/google";
import ClientProviders from "./ClientProviders";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Apex Insights",
    template: "%s | Apex Insights",
  },
  description: "Monitor and optimize your web performance in real time with Apex Insights - a premium developer performance dashboard.",
  keywords: ["analytics", "dashboard", "tracking", "performance", "metrics", "monitoring", "real-time"],
  authors: [{ name: "Apex Analytics" }],
  creator: "Apex Analytics",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} ${oswald.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
