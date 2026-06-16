"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ITEMS = [
  "3D Animation",
  "Motion Design",
  "Video Editing",
  "2D Animation",
  "VFX & Compositing",
  "Brand Films",
  "Product Animation",
];

function Sparkle() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      className="mx-6 inline-block shrink-0 align-middle"
      aria-hidden
    >
      <path
        d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0Z"
        fill="url(#sparkle-grad)"
      />
    </svg>
  );
}

function Row({ reverse = false, duration = 26 }: { reverse?: boolean; duration?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
      );
    }, el);
    return () => ctx.revert();
  }, [reverse, duration]);

  const content = (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            {item}
          </span>
          <Sparkle />
        </span>
      ))}
    </>
  );

  return (
    <div className="flex w-max">
      <div ref={trackRef} className="flex w-max whitespace-nowrap text-5xl font-bold tracking-tight md:text-7xl">
        <div className="flex items-center">{content}</div>
        <div className="flex items-center" aria-hidden>
          {content}
        </div>
      </div>
    </div>
  );
}

export default function MarqueeBand() {
  return (
    <section className="relative overflow-hidden bg-black py-16 md:py-24">

      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="sparkle-grad" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent md:w-40" />

      <div className="flex -rotate-2 flex-col gap-6">
        <Row duration={28} />
        <div className="opacity-60">
          <Row reverse duration={34} />
        </div>
      </div>
    </section>
  );
}
