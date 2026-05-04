import type { Metadata, Viewport } from "next";
import { Big_Shoulders, DM_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { DisplayModeProbe } from "@/components/pwa/display-mode-probe";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { AppNav, NavProvider } from "@/components/ui";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://exhalejr.com",
  ),
  title: {
    default: "ExhaleJR",
    template: "%s · ExhaleJR",
  },
  description: "Personal site, drawing board, and rip-able projects by Josh Roxby.",
  applicationName: "ExhaleJR",
  appleWebApp: {
    capable: true,
    title: "ExhaleJR",
    statusBarStyle: "black-translucent",
  },
  // All brand assets live under /public/logo. Replacing files there cascades
  // through favicon, apple-touch-icon, OG image, and the React <Logo>.
  icons: {
    icon: [
      { url: "/logo/logo-256.png", sizes: "256x256", type: "image/png" },
      { url: "/logo/logo-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/logo/logo-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "ExhaleJR",
    title: "ExhaleJR",
    description: "Personal site, drawing board, and rip-able projects by Josh Roxby.",
    images: [{ url: "/logo/og.png", width: 1200, height: 630, alt: "ExhaleJR" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExhaleJR",
    description: "Personal site, drawing board, and rip-able projects by Josh Roxby.",
    images: ["/logo/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-dvh font-body antialiased">
        <DisplayModeProbe />
        <ServiceWorkerRegister />
        <NavProvider>
          <div className="px-4">
            <InstallPrompt />
          </div>
          <div className="pb-[calc(8rem+env(safe-area-inset-bottom))]">{children}</div>
          <AppNav />
        </NavProvider>
      </body>
    </html>
  );
}
