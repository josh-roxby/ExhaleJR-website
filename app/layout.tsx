import type { Metadata, Viewport } from "next";
import { Big_Shoulders, DM_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { DisplayModeProbe } from "@/components/pwa/display-mode-probe";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

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
  title: {
    default: "ExhaleJR",
    template: "%s — ExhaleJR",
  },
  description: "Portfolio, thinking, and a lab of in-progress projects.",
  applicationName: "ExhaleJR",
  appleWebApp: {
    capable: true,
    title: "ExhaleJR",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
        {children}
      </body>
    </html>
  );
}
