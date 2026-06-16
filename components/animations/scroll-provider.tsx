"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import "lenis/dist/lenis.css";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setActiveLenis } from "@/lib/smooth-scroll";

export default function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let detach = () => {};

    const init = async () => {
      gsap.registerPlugin(ScrollTrigger);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        ScrollTrigger.refresh();
        return;
      }

      const LenisCtor = (await import("lenis")).default;
      const instance = new LenisCtor({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      lenis = instance;
      setActiveLenis(instance);

      instance.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const handleAnchor = (e: Event) => {
        const target = e.currentTarget as HTMLAnchorElement;
        if (target.hash) {
          e.preventDefault();
          const el = document.querySelector(target.hash);
          if (el) instance.scrollTo(el as HTMLElement, { duration: 1.5 });
        }
      };
      const links = Array.from(document.querySelectorAll('a[href^="#"]'));
      links.forEach((link) => link.addEventListener("click", handleAnchor));

      detach = () => {
        links.forEach((link) => link.removeEventListener("click", handleAnchor));
        gsap.ticker.remove(raf);
      };

      ScrollTrigger.refresh();
    };

    init();

    return () => {
      detach();
      lenis?.destroy();
      setActiveLenis(null);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
