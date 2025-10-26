"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import React, { useRef, useState, useEffect } from "react"

type Props = {
    src: string
    // poster: string // Remove this, as we don't want to show posters
    label?: string
    className?: string
}

export default function FullBleedVideo({ src, label, className }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
    const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined)
    const [isLoaded, setIsLoaded] = useState(false)

    // Adjust useInView to trigger earlier for preloading (e.g., 500px before entering viewport)
    const isInView = useInView(ref, {
        once: false,
        amount: 0.2,
        margin: "-500px 0px 0px 0px" // Start observing 500px before top of viewport
    })

    const { scrollYProgress } = useScroll({ target: ref })
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"])

    useEffect(() => {
        if (isInView && !videoSrc) {
            setVideoSrc(src)
        }
        if (videoRef.current) {
            if (isInView) {
                videoRef.current.play().catch(() => { })
            } else {
                videoRef.current.pause()
            }
        }
    }, [isInView, src, videoSrc])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const midX = rect.width / 2
        const midY = rect.height / 2
        const rotateY = ((x - midX) / midX) * 10
        const rotateX = ((midY - y) / midY) * 10
        setTransform({ rotateX, rotateY })
    }

    const handleMouseLeave = () => setTransform({ rotateX: 0, rotateY: 0 })

    return (
        <motion.div
            ref={ref}
            className={`relative h-full w-full ${className || ""}`}
            style={{ perspective: 1000, y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
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
                transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 12,
                }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Remove poster <Image> entirely */}

                {videoSrc && (
                    <video
                        ref={videoRef}
                        className="h-full w-full object-cover transition-opacity duration-500"
                        src={videoSrc}
                        preload="auto" // Changed to "auto" to encourage full preloading when src is set
                        autoPlay={false}
                        muted
                        loop
                        playsInline
                        onLoadedData={() => setIsLoaded(true)}
                        style={{ opacity: isLoaded ? 1 : 0 }}
                    />
                )}

                {/* Keep spinner for loading feedback (shows black or spinner until loaded) */}
                {!isLoaded && videoSrc && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black"> {/* Added bg-black for blank screen */}
                        <motion.div
                            className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                )}

                {/* Lighting gradient overlay */}
                <motion.div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay"
                    style={{
                        opacity: transform.rotateX === 0 && transform.rotateY === 0 ? 0 : 0.5,
                    }}
                />

                {/* Subtle glow ring */}
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

                {/* Inner vignette */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.4)" }}
                />

                {/* Floating label */}
                {label && (
                    <motion.div
                        className="absolute bottom-6 left-6 rounded-lg border border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 text-sm font-medium text-white"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {label}
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    )
}