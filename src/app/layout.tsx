import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteNav } from "@/components/site-nav";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  applicationName: "MedPharma",
  title: {
    default: "MedPharma — Inteligência Farmacêutica",
    template: "%s · MedPharma",
  },
  description:
    "Apoio à decisão clínica farmacêutica: consulta de medicamentos, checagem de interações, intervenções e calculadoras clínicas.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MedPharma",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0eb4be" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <SiteNav />
          <main className="container py-6">{children}</main>
        </Providers>
        <PwaRegister />
      </body>
    </html>
  );
}
