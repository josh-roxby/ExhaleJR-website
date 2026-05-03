import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { DisplayModeProbe } from "@/components/pwa/display-mode-probe";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

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
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh font-sans antialiased">
        <DisplayModeProbe />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
