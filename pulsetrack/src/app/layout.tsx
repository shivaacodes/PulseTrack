import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Providers } from "@/providers";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "PulseTrack",
    template: "%s | PulseTrack",
  },
  description: "A modern analytics platform for tracking and visualizing your website's performance.",
  keywords: ["analytics", "dashboard", "tracking", "performance", "metrics"],
  authors: [{ name: "Shiva Sajay" }],
  creator: "PulseTrack",
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
        className={`${poppins.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
          storageKey="pulsetrack-theme"
        >
          <ThemeProvider>
            <AuthProvider>
              <Providers>
                {children}
              </Providers>
            </AuthProvider>
          </ThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
