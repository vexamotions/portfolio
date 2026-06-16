import type Lenis from "lenis";

let activeLenis: Lenis | null = null;

export function setActiveLenis(instance: Lenis | null): void {
  activeLenis = instance;
}

export function scrollToHash(hash: string): void {
  const el = document.querySelector(hash);
  if (!el) return;
  if (activeLenis) {
    activeLenis.scrollTo(el as HTMLElement, { duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
