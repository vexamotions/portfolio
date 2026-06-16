"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface Craft {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const stroke = {
  fill: "none",
  stroke: "url(#craft-grad)",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const CRAFT: Craft[] = [
  {
    title: "Cinematic 3D",
    desc: "Photoreal product films, environments, and characters with film-grade lighting and materials.",
    icon: (
      <>
        <circle className="draw" cx="24" cy="24" r="14" {...stroke} />
        <ellipse className="draw" cx="24" cy="24" rx="14" ry="5.5" {...stroke} />
        <ellipse className="draw" cx="24" cy="24" rx="5.5" ry="14" {...stroke} />
      </>
    ),
  },
  {
    title: "Fluid Motion",
    desc: "Kinetic typography, UI motion, and branded graphics choreographed down to the beat.",
    icon: (
      <>
        <path className="draw" d="M5 24c6-15 13-15 19 0s13 15 19 0" {...stroke} />
        <path className="draw" d="M5 32c6-9 13-9 19 0s13 9 19 0" {...stroke} opacity={0.6} />
      </>
    ),
  },
  {
    title: "Story-first Edits",
    desc: "Short-form and promo edits cut for retention, rhythm, and conversion-focused storytelling.",
    icon: (
      <>
        <rect className="draw" x="7" y="9" width="34" height="30" rx="8" {...stroke} />
        <path className="draw" d="M21 19l11 5-11 5z" {...stroke} />
      </>
    ),
  },
  {
    title: "Brand Systems",
    desc: "Cohesive visual languages and motion guidelines that scale across every format and channel.",
    icon: (
      <>
        <path className="draw" d="M24 7l16 8-16 8-16-8z" {...stroke} />
        <path className="draw" d="M8 23l16 8 16-8" {...stroke} opacity={0.7} />
        <path className="draw" d="M8 31l16 8 16-8" {...stroke} opacity={0.45} />
      </>
    ),
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.to(".motion-line", {
        strokeDashoffset: -60,
        duration: 2.4,
        ease: "none",
        repeat: -1,
        stagger: 0.25,
      });
    }, sectionRef);

    const ios: IntersectionObserver[] = [];
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const shapes = card.querySelectorAll<SVGGeometryElement>(".draw");
      shapes.forEach((s) => {
        const len = s.getTotalLength();
        gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
      });
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(shapes, {
              strokeDashoffset: 0,
              duration: 1.3,
              ease: "power2.out",
              stagger: 0.12,
            });
            io.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(card);
      ios.push(io);
    });

    return () => {
      ctx.revert();
      ios.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative overflow-hidden bg-black py-24 md:py-32"
    >

      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="craft-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="none">
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            className="motion-line"
            x1="-5%"
            x2="105%"
            y1={`${12 + i * 13}%`}
            y2={`${12 + i * 13}%`}
            stroke="url(#craft-grad)"
            strokeWidth={1}
            strokeDasharray="16 22"
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[50vw] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl md:mb-20">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/70">
            What we craft
          </p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            Every discipline,{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              in motion
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {CRAFT.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.06]"
            >
              <div className="mb-6 inline-grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-black/40">
                <svg
                  viewBox="0 0 48 48"
                  className="h-9 w-9 transition-transform duration-500 group-hover:scale-110"
                >
                  {c.icon}
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{c.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{c.desc}</p>

              <span className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
