"use client";

import React, { Suspense, useRef, useEffect } from "react";
import type { Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  PerspectiveCamera,
  ContactShadows,
  Html,
} from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";

useGLTF.preload("/assets/3d/robot.glb");

const ARRIVE_AT = 0.9;

function RobotModel({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<Group>(null);
  const smooth = useRef(0);
  const phase = useRef<"walk" | "arrived">("walk");
  const { scene, animations } = useGLTF("/assets/3d/robot.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const walk = actions["Walking"] ?? Object.values(actions)[0];
    if (!walk) return;
    walk.reset().play();
    walk.paused = true;
    return () => {
      Object.values(actions).forEach((a) => a?.stop());
    };
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    smooth.current += (progress.current - smooth.current) * 0.09;
    const p = smooth.current;

    const walk = actions["Walking"] ?? Object.values(actions)[0];
    const arriveClip =
      actions["Wave"] ?? actions["ThumbsUp"] ?? actions["Idle"] ?? null;

    if (p >= ARRIVE_AT && phase.current === "walk") {
      phase.current = "arrived";
      walk?.fadeOut(0.4);
      if (arriveClip) {
        arriveClip.reset().fadeIn(0.4).play();
        arriveClip.paused = false;
      }
    } else if (p < ARRIVE_AT && phase.current === "arrived") {
      phase.current = "walk";
      arriveClip?.fadeOut(0.3);
      if (walk) {
        walk.reset().fadeIn(0.3).play();
        walk.paused = true;
      }
    }

    if (phase.current === "walk" && walk) {
      const dur = walk.getClip().duration;
      const travel = Math.min(p / ARRIVE_AT, 1);
      const time = t * 0.25 + travel * dur * 5;
      walk.time = ((time % dur) + dur) % dur;
    }

    const ease = 1 - Math.pow(1 - Math.min(p / ARRIVE_AT, 1), 2);
    group.current.position.x = 3.4 - ease * 3.4;
    group.current.position.z = -2 + ease * 2.6;
    group.current.position.y = -1.4 + Math.sin(t * 1.4) * 0.02;

    group.current.rotation.y = -0.7 + ease * 0.7 + Math.sin(t * 0.5) * 0.04;
  });

  return (
    <group ref={group} scale={0.85} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
    </Html>
  );
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.4, 7]} fov={45} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={1.3} />
      <spotLight position={[6, 6, 6]} angle={0.4} penumbra={1} intensity={2} color="#22d3ee" />
      <spotLight position={[-6, 4, -4]} angle={0.4} penumbra={1} intensity={1.6} color="#a855f7" />
      <Suspense fallback={<Loader />}>
        <RobotModel progress={progress} />
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.5}
          scale={10}
          blur={2.6}
          far={4}
          color="#000000"
        />
      </Suspense>
    </>
  );
}

function Caption({
  style,
  className,
  eyebrow,
  children,
}: {
  style: { opacity: MotionValue<number>; y?: MotionValue<number> };
  className: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div style={style} className={`pointer-events-none absolute max-w-md ${className}`}>
      {eyebrow && (
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">{eyebrow}</p>
      )}
      <p className="text-2xl font-semibold leading-snug text-white md:text-3xl">{children}</p>
    </motion.div>
  );
}

export default function RobotJourney() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => scrollYProgress.on("change", (v) => (progress.current = v)), [scrollYProgress]);

  const cap1 = useTransform(scrollYProgress, [0.02, 0.12, 0.28, 0.36], [0, 1, 1, 0]);
  const cap1y = useTransform(scrollYProgress, [0.02, 0.12], [30, 0]);
  const cap2 = useTransform(scrollYProgress, [0.42, 0.52, 0.66, 0.74], [0, 1, 1, 0]);
  const cap2y = useTransform(scrollYProgress, [0.42, 0.52], [30, 0]);
  const eyebrow = useTransform(scrollYProgress, [0.8, 0.88], [0, 1]);
  const eyebrowY = useTransform(scrollYProgress, [0.8, 0.88], [20, 0]);
  const tagline = useTransform(scrollYProgress, [0.84, 0.95], [0, 1]);
  const taglineY = useTransform(scrollYProgress, [0.84, 0.97], [40, 0]);
  const taglineBlurPx = useTransform(scrollYProgress, [0.84, 0.96], [16, 0]);
  const taglineFilter = useMotionTemplate`blur(${taglineBlurPx}px)`;
  const scrollHint = useTransform(scrollYProgress, [0, 0.08, 0.9, 1], [1, 1, 1, 0]);

  return (
    <section
      ref={wrapperRef}
      id="journey"
      className="relative h-[320vh] bg-black"
    >

      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-[45vh] w-[45vw] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[45vh] w-[45vw] translate-x-1/2 rounded-full bg-purple-600/10 blur-[130px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:90px_90px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />

        <Canvas
          className="absolute inset-0"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene progress={progress} />
        </Canvas>

        <Caption
          style={{ opacity: cap1, y: cap1y }}
          className="left-6 top-1/4 md:left-16 lg:left-24"
          eyebrow="Built in motion"
        >
          Our work doesn&apos;t sit still — and neither do we.
        </Caption>

        <Caption
          style={{ opacity: cap2, y: cap2y }}
          className="right-6 top-1/3 text-right md:right-16 lg:right-24"
          eyebrow="Frame by frame"
        >
          Every move is choreographed down to the last pixel.
        </Caption>

        <div className="pointer-events-none absolute inset-x-0 bottom-[14%] z-10 px-6 text-center">
          <motion.p
            style={{ opacity: eyebrow, y: eyebrowY }}
            className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/70"
          >
            Vexamotions
          </motion.p>
          <motion.h2
            style={{ opacity: tagline, y: taglineY, filter: taglineFilter }}
            className="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Where imagination{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              learns to move
            </span>
          </motion.h2>
        </div>

        <motion.div
          style={{ opacity: scrollHint }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex animate-bounce flex-col items-center gap-2">
            <span className="text-xs tracking-[0.3em] text-white/40">KEEP SCROLLING</span>
            <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1.5">
              <div className="h-2.5 w-1 rounded-full bg-cyan-400" />
            </div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>
    </section>
  );
}
