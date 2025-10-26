"use client"

import type React from "react"
import { useEffect, useRef } from "react"
// In ScrollProvider.tsx, at the top
import 'lenis/dist/lenis.css'; // Add this import

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    const initLenis = async () => {
      const Lenis = (await import("lenis")).default

      // Initialize Lenis with optimized settings for performance
      const lenis = new Lenis({
        duration: 1.2, // Smooth but not too slow
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for natural feel
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      })

      lenisRef.current = lenis

      // Animation loop
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      // Handle anchor links with Lenis
      const handleSmoothScroll = (e: Event) => {
        const target = e.target as HTMLAnchorElement
        if (target.hash) {
          e.preventDefault()
          const element = document.querySelector(target.hash)
          if (element) {
            lenis.scrollTo(element, { duration: 1.5 })
          }
        }
      }

      // Add event listeners for smooth scrolling
      const links = document.querySelectorAll('a[href^="#"]')
      links.forEach((link) => {
        link.addEventListener("click", handleSmoothScroll)
      })

      return () => {
        links.forEach((link) => {
          link.removeEventListener("click", handleSmoothScroll)
        })
        lenis.destroy()
      }
    }

    const cleanup = initLenis()

    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.())
    }
  }, [])

  return <>{children}</>
}
