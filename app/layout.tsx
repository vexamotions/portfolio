import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { plusJakarta } from "@/lib/fonts"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import ScrollProvider from "@/components/animations/scroll-provider"

export const metadata: Metadata = {
  title: "Vexamotions - Creative Digital Experiences",
  description:
    "Premium digital experiences and creative solutions crafted with innovative design and cutting-edge technology.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${plusJakarta.variable}  antialiased`}>
        <ScrollProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </ScrollProvider>
        <Analytics />
      </body>
    </html>
  )
}
