"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";

type Props = {
    src: string; // .m3u8 or .mp4
    poster?: string;
    title?: string;
    eyebrow?: string;
    kicker?: string;
    className?: string;
};

export default function FullBleedVideo({
    src,
    poster,
    title,
    eyebrow,
    kicker,
    className,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
    const [showPoster, setShowPoster] = useState(!!poster);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHls, setIsHls] = useState(false);

    // --------------------------------------------------------------
    // 1. Viewport detection – load *once*, pause/resume later
    // --------------------------------------------------------------
    const isInView = useInView(containerRef, {
        once: true,               // load only the first time it appears
        amount: 0.3,
        margin: "-300px 0px -100px 0px",
    });

    // --------------------------------------------------------------
    // 2. Scroll-based Y movement
    // --------------------------------------------------------------
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

    // --------------------------------------------------------------
    // 3. Mouse-tilt 3-D effect
    // --------------------------------------------------------------
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateY = ((x - midX) / midX) * 10;
        const rotateX = ((midY - y) / midY) * 10;
        setTransform({ rotateX, rotateY });
    };
    const handleMouseLeave = () => setTransform({ rotateX: 0, rotateY: 0 });

    // --------------------------------------------------------------
    // 4. HLS / native init – **once**
    // --------------------------------------------------------------
    const initHls = useCallback(() => {
        if (!videoRef.current || hlsRef.current) return;
        const video = videoRef.current;

        const hls = new Hls({
            startLevel: -1,
            capLevelToPlayerSize: true,
            enableWorker: true,
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
        });
        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setShowPoster(false);
            if (isInView) video.play().catch(() => { });
        });

        // ---- error recovery (network hiccups) ----
        hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
                console.error("HLS fatal", data);
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        setTimeout(() => hls.startLoad(), 1000);
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        hls.destroy();
                        hlsRef.current = null;
                }
            }
        });
    }, [src, isInView]);

    const initNative = useCallback(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        video.src = src;
        video.load();
        video.addEventListener(
            "loadedmetadata",
            () => {
                setShowPoster(false);
                if (isInView) video.play().catch(() => { });
            },
            { once: true }
        );
    }, [src, isInView]);

    // --------------------------------------------------------------
    // 5. Load **once** when first in view
    // --------------------------------------------------------------
    useEffect(() => {
        const isHlsFile = src.toLowerCase().endsWith(".m3u8");
        setIsHls(isHlsFile);

        if (!isInView) return;

        if (isHlsFile && Hls.isSupported()) {
            initHls();
        } else if (isHlsFile && videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari native HLS
            videoRef.current.src = src;
            videoRef.current.addEventListener(
                "loadedmetadata",
                () => {
                    setShowPoster(false);
                    videoRef.current?.play().catch(() => { });
                },
                { once: true }
            );
        } else {
            initNative();
        }
    }, [isInView, src, initHls, initNative]);

    // --------------------------------------------------------------
    // 6. Pause / resume on scroll in/out (no destroy)
    // --------------------------------------------------------------
    const visibilityRef = useRef<boolean>(true);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const nowVisible = entry.isIntersecting;
                if (nowVisible === visibilityRef.current) return;
                visibilityRef.current = nowVisible;

                const video = videoRef.current;
                if (!video) return;

                if (nowVisible) {
                    // Resume
                    if (hlsRef.current) hlsRef.current.startLoad();
                    video.play().catch(() => { });
                } else {
                    // Pause + stop network
                    video.pause();
                    if (hlsRef.current) hlsRef.current.stopLoad();
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // --------------------------------------------------------------
    // 7. Mark video as loaded
    // --------------------------------------------------------------
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const onCanPlay = () => setIsLoaded(true);
        video.addEventListener("canplay", onCanPlay);
        return () => video.removeEventListener("canplay", onCanPlay);
    }, []);

    // --------------------------------------------------------------
    // Render
    // --------------------------------------------------------------
    return (
        <motion.div
            ref={containerRef}
            className={`relative h-full w-full ${className ?? ""}`}
            style={{ perspective: 1000, y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* 3-D card */}
            <motion.div
                className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl transition-shadow duration-300"
                animate={{
                    rotateX: transform.rotateX,
                    rotateY: transform.rotateY,
                    scale: transform.rotateX === 0 && transform.rotateY === 0 ? 1 : 1.03,
                    boxShadow:
                        transform.rotateX === 0 && transform.rotateY === 0
                            ? "0 0 40px rgba(0,0,0,0.3)"
                            : "0 0 50px rgba(0,255,255,0.25)",
                }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Poster */}
                {showPoster && poster && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${poster})` }}
                    />
                )}

                {/* Video */}
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover transition-opacity duration-500"
                    muted
                    loop
                    playsInline
                    style={{ opacity: isLoaded ? 1 : 0 }}
                />

                {/* Loading spinner (only while buffering) */}
                {!isLoaded && isInView && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                        <motion.div
                            className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                )}

                {/* Gradient overlay, glow, vignette … (unchanged) */}
                <motion.div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay"
                    style={{
                        opacity: transform.rotateX === 0 && transform.rotateY === 0 ? 0 : 0.5,
                    }}
                />
                <motion.div
                    className="pointer-events-none absolute inset-0 rounded-2xl md:rounded-3xl"
                    animate={{
                        boxShadow:
                            transform.rotateX === 0 && transform.rotateY === 0
                                ? "0 0 0px rgba(0,255,255,0)"
                                : "0 0 40px rgba(0,255,255,0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.4)" }}
                />

                {/* Text overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-end p-8 md:p-12">
                    <div className="max-w-2xl space-y-2">
                        {eyebrow && (
                            <motion.p
                                className="text-xs md:text-sm font-medium text-cyan-400 uppercase tracking-widest"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                {eyebrow}
                            </motion.p>
                        )}
                        {title && (
                            <motion.h3
                                className="text-3xl md:text-5xl font-bold text-white"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                {title}
                            </motion.h3>
                        )}
                        {kicker && (
                            <motion.p
                                className="mt-2 text-sm md:text-base text-gray-300 max-w-xl"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                {kicker}
                            </motion.p>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}