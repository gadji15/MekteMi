import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import LayoutWrapper from "@/components/layout-wrapper"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "MbekteMi - Application Communautaire",
  description:
    "Application web progressive pour la communauté Mouride lors du Magal de Touba - Horaires, inscriptions, notifications et points d'intérêt",
  generator: "v0.app",
  manifest: "/manifest.json",
  keywords: ["Magal", "Touba", "Mouride", "Pèlerinage", "Sénégal", "Islam"],
  authors: [{ name: "QuantikSense" }],
  creator: "QuantikSense",
  publisher: "QuantikSense",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mbektemi.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MbekteMi - Application Communautaire",
    description: "Application web progressive pour la communauté Mouride lors du Magal de Touba",
    url: "https://mbektemi.vercel.app",
    siteName: "MbekteMi",
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MbekteMi",
    description: "Application communautaire pour le pèlerinage",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#065f46" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MbekteMi",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.jpg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
