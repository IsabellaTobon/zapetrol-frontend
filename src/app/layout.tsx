import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Zapetrol",
  description: "Zapetrol es creada para ayudarte a ahorrar tiempo y dinero en tus viajes por carretera.",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: "favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/icons/favicon.ico" />
      </head>
      <body>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <div className="sticky bottom-0 z-50">
          <Footer />
        </div>
      </body>
    </html>
  )
}