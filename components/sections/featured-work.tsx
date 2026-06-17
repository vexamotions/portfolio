"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Hls from "hls.js";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECT_CATEGORY_TITLE_MAP, projectSlug } from "@/lib/projects-data";
import type { Project } from "@/types/types";
import { cn } from "@/lib/utils";

const FEATURED_IDS_AND_LAYOUT: { id: number; span: string }[] = [
  { id: 2, span: "lg:col-span-2 lg:row-span-2" },
  { id: 10, span: "lg:col-span-2" },
  { id: 1, span: "" },
  { id: 9, span: "" },
];

const STATS = [
  { value: "150+", label: "Projects delivered" },
  { value: "40+", label: "Brands worldwide" },
  { value: "6", label: "Years crafting motion" },
  { value: "12k+", label: "Render hours logged" },
];

function FeaturedCard({ project, span }: { project: Project; span: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const src = project.video;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;
      return () => hls.destroy();
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.preload = "none";
    }
  }, [project.video]);

  const handleEnter = () => {
    setHovered(true);
    hlsRef.current?.startLoad();
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    setHovered(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    hlsRef.current?.stopLoad();
  };

  return (
    <Link
      href={`/projects/${project.category}/${projectSlug(project)}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900",
        "transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_0_60px_-15px_rgba(34,211,238,0.45)]",
        "lg:aspect-auto lg:h-full",
        span,
      )}
    >

      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={cn(
          "object-cover transition-all duration-700",
          hovered ? "scale-105 opacity-0" : "scale-100 opacity-100",
        )}
      />

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          hovered ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/90 backdrop-blur-md">
        {PROJECT_CATEGORY_TITLE_MAP[project.category]}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white md:text-xl">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-1 max-w-md text-sm text-white/60">
            {project.description}
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-300 group-hover:border-cyan-300 group-hover:bg-cyan-300 group-hover:text-black">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  const featured = FEATURED_IDS_AND_LAYOUT
    .map(({ id, span }) => {
      const project = projects.find((p) => p.id === id);
      return project ? { project, span } : null;
    })
    .filter((entry): entry is { project: Project; span: string } => entry !== null);

  return (
    <section id="work" className="relative overflow-hidden bg-black py-24 md:py-32">

      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 left-1/4 h-[40vh] w-[40vw] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[40vh] w-[40vw] translate-x-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/70">
              Selected Work
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              Motion that makes brands{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                impossible to scroll past
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-white/60">
            A glimpse into our latest 3D, 2D, and motion design pieces — each
            crafted to turn attention into action. Hover to preview.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:h-[82vh] lg:grid-cols-4 lg:grid-rows-2 lg:gap-6"
        >
          {featured.map(({ project, span }) => (
            <FeaturedCard key={project.id} project={project} span={span} />
          ))}
        </motion.div>

        <div className="mt-16 flex flex-col gap-10 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-black px-6 py-8 text-center md:py-10">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10"
            >
              Explore the full library
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
