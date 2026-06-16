"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PATH_D =
  "M 80 470 C 300 470, 320 150, 540 240 S 860 540, 1120 200";

const NODES = [
  { t: 0.1, label: "Concept" },
  { t: 0.4, label: "Design" },
  { t: 0.68, label: "Animate" },
  { t: 0.95, label: "Deliver" },
];

export default function ScrollDraw() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    gsap.registerPlugin(ScrollTrigger);
    const len = path.getTotalLength();

    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const nodePoints = NODES.map((n) => path.getPointAtLength(len * n.t));
    nodeRefs.current.forEach((g, i) => {
      if (!g) return;
      const p = nodePoints[i];
      g.setAttribute("transform", `translate(${p.x} ${p.y})`);
      gsap.set(g, { opacity: 0.25 });
    });

    const startPt = path.getPointAtLength(0);
    gsap.set([dotRef.current, glowRef.current], {
      attr: { cx: startPt.x, cy: startPt.y },
    });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(path, { strokeDashoffset: len * (1 - p) });

        const pt = path.getPointAtLength(len * p);
        gsap.set([dotRef.current, glowRef.current], {
          attr: { cx: pt.x, cy: pt.y },
        });

        nodeRefs.current.forEach((g, i) => {
          if (!g) return;
          const active = p >= NODES[i].t - 0.005;
          gsap.to(g, {
            opacity: active ? 1 : 0.25,
            scale: active ? 1 : 0.7,
            transformOrigin: "center",
            duration: 0.3,
            overwrite: "auto",
          });
        });

        if (headingRef.current) {
          gsap.set(headingRef.current, {
            opacity: gsap.utils.clamp(0, 1, 1 - p * 1.4),
            y: -p * 40,
          });
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} id="process-flow" className="relative h-[320vh] bg-black">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">

        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[45vh] w-[55vw] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:90px_90px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />

        <div
          ref={headingRef}
          className="pointer-events-none absolute top-[14%] z-10 px-6 text-center"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/70">
            The process
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            From spark to{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              screen
            </span>
          </h2>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/40">
            scroll to follow the journey
          </p>
        </div>

        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          fill="none"
        >
          <defs>
            <linearGradient id="draw-grad" x1="0" y1="0" x2="1200" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="draw-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d={PATH_D} stroke="rgba(255,255,255,0.07)" strokeWidth={2} />

          <path
            ref={pathRef}
            d={PATH_D}
            stroke="url(#draw-grad)"
            strokeWidth={3.5}
            strokeLinecap="round"
            filter="url(#draw-glow)"
          />

          {NODES.map((n, i) => (
            <g
              key={n.label}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
            >
              <circle r={9} fill="#06080d" stroke="url(#draw-grad)" strokeWidth={2.5} />
              <circle r={3} fill="url(#draw-grad)" />
              <text
                y={-22}
                textAnchor="middle"
                className="font-display"
                fontSize={20}
                fill="#ffffff"
                fontWeight={600}
              >
                {n.label}
              </text>
            </g>
          ))}

          <circle ref={glowRef} r={16} fill="#22d3ee" opacity={0.35} filter="url(#draw-glow)" />
          <circle ref={dotRef} r={6} fill="#ffffff" filter="url(#draw-glow)" />
        </svg>
      </div>
    </section>
  );
}
