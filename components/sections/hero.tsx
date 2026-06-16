"use client";

import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const lineRise = {
  hidden: { y: '115%' },
  show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const Hero: React.FC = () => {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(true);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const enteredRef = useRef(false);
  const mutedRef = useRef(true);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const duration = 1700;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setReady(true);
    };
    const begin = async () => {
      if (document.fonts) await document.fonts.ready;
      raf = requestAnimationFrame(tick);
    };
    begin();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const source = '/hls-command/3d-animations-mixture/master.m3u8';
    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = heroVideoRef.current;
    if (!section || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!enteredRef.current) return;
        if (entry.isIntersecting) {
          video.muted = mutedRef.current;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleEnter = () => {
    const video = heroVideoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
    }
    mutedRef.current = false;
    enteredRef.current = true;
    setMuted(false);
    setEntered(true);
  };

  const toggleMute = () => {
    const video = heroVideoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    if (!next) video.play().catch(() => {});
    mutedRef.current = next;
    setMuted(next);
  };

  return (
    <section ref={sectionRef} id="home" className="relative h-screen w-full overflow-hidden bg-black">

      <AnimatePresence>
        {!entered && (
          <motion.div
            key="gate"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050608]"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div className="absolute left-1/3 top-1/3 h-[40vh] w-[40vw] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]"
              animate={{ opacity: [0.4, 0.75, 0.4] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.div className="absolute bottom-1/4 right-1/4 h-[40vh] w-[40vw] translate-x-1/2 rounded-full bg-purple-500/10 blur-[130px]"
              animate={{ opacity: [0.4, 0.75, 0.4] }} transition={{ duration: 4, repeat: Infinity, delay: 1.2 }} />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />

            <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="font-display text-xs font-medium uppercase tracking-[0.6em] text-white/40"
              >
                Vexamotions
              </motion.p>

              <div className="mt-8 font-display text-[24vw] font-bold leading-[0.85] tracking-tighter md:text-[11rem]">
                <span className="bg-gradient-to-b from-white via-white to-white/25 bg-clip-text tabular-nums text-transparent">
                  {count.toString().padStart(2, '0')}
                </span>
                <span className="ml-1 align-top text-2xl text-cyan-300/60 md:text-4xl">%</span>
              </div>

              <div className="mt-6 flex h-20 w-full max-w-sm items-start justify-center">
                <AnimatePresence mode="wait">
                  {!ready ? (
                    <motion.div key="bar" className="flex w-full flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="h-px w-full overflow-hidden bg-white/10">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${count}%` }} />
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.4em] text-white/30">Loading experience</p>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="enter"
                      onClick={handleEnter}
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="group flex flex-col items-center gap-3"
                    >
                      <span className="relative flex items-center gap-3 overflow-hidden rounded-full bg-white px-10 py-4 font-display text-sm font-semibold uppercase tracking-[0.25em] text-black transition-shadow duration-300 group-hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.6)]">
                        Enter
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
                        <Volume2 className="h-3.5 w-3.5" /> Best with sound on
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <video
        ref={heroVideoRef}
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_200px_70px_rgba(0,0,0,0.75)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:90px_90px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]" />

      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-[40vh] w-[40vw] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -top-10 right-1/4 h-[35vh] w-[35vw] rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.div className="max-w-3xl" variants={textContainer} initial="hidden" animate={entered ? 'show' : 'hidden'}>

            <motion.div variants={fadeUp} className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/80">
                Creative Motion Studio
              </span>
            </motion.div>

            <h1 className="mb-6 font-display text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span variants={lineRise} className="inline-block text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
                  JOIN THE
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span variants={lineRise} className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,255,255,0.3)]">
                  NEW ERA
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span variants={lineRise} className="inline-block text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
                  OF CREATIVE
                </motion.span>
              </span>
            </h1>

            <motion.p variants={fadeUp} className="mb-9 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl">
              Where imagination meets innovation. Crafting digital experiences
              that transcend boundaries.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.5)]"
              >
                View our work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10"
              >
                Start a project
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {entered && (
          <motion.button
            key="mute"
            onClick={toggleMute}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/70"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex animate-bounce flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1.5">
            <div className="h-2 w-1 rounded-full bg-cyan-400" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
};

export default Hero;
