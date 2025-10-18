"use client"


import { motion } from "framer-motion"
import Scroll3DTitle from "../videolevitating/scroll-3d-title"
import FullBleedVideo from "../videolevitating/full-bleed-video"
import { Button } from "../ui/button"
import Link from "next/link"
import EnhancedCTAButton from "../EnhancedCTAButton"

const SECTIONS = [
    {
        id: "3d-designing",
        title: "3D Designing",
        eyebrow: "Immersive • Materials • Lighting",
        kicker:
            "We craft atmospheres and mood with realistic lighting, shadows, and cinematic composition.",
        video: "/videos/portfolio/3d-work.mp4", // your 3D work video
        layout: "text-left",
    },
    {
        id: "2d-designing",
        title: "2D Designing",
        eyebrow: "Creativity • Layout • Visuals",
        kicker:
            "Bringing ideas to life with stunning 2D compositions, balance, and artistic precision.",
        video: "/videos/portfolio/2d-work.mp4", // your 2D work video
        layout: "text-right",
    },
    {
        id: "model-designing",
        title: "Model Designing",
        eyebrow: "Topology • Detail • Precision",
        kicker:
            "Clean meshes and striking silhouettes built for performance and visual fidelity.",
        video: "/videos/portfolio/modeling.mp4", // your modeling video
        layout: "text-left",
    },

] as const;


export default function Work() {
    return (
        <main id="work" className="bg-black text-white">
            {/* Global background accent */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-40 left-1/2 h-[60vh] w-[60vw] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            {SECTIONS.map((s, i) => {
                const isRightText = s.layout === "text-right"
                return (
                    <section
                        key={s.id}
                        className="relative flex min-h-screen w-full items-center"
                        aria-labelledby={`${s.id}-title`}
                    >
                        <div className="container mx-auto h-screen max-w-[1920px] px-4 md:px-8 lg:px-12">
                            <div className="flex h-full flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
                                {/* Text Half */}
                                <motion.div
                                    className={`flex items-center justify-center w-full lg:w-[42%]
                        ${isRightText ? "lg:order-2" : "lg:order-1"}
                    `}
                                    initial={{ opacity: 0, x: isRightText ? 60 : -60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div id={`${s.id}-title`} className="w-full">
                                        <Scroll3DTitle
                                            title={s.title}
                                            eyebrow={s.eyebrow}
                                            kicker={s.kicker}
                                            align={isRightText ? "right" : "left"}
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className={`relative w-full lg:w-[58%] h-[50vh] sm:h-[60vh] lg:h-[75vh] xl:h-[80vh]
                        ${isRightText ? "lg:order-1" : "lg:order-2"}
                    `}
                                    initial={{ opacity: 0, x: isRightText ? -60 : 60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <FullBleedVideo src={s.video} label={s.title} className="h-full" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Cinematic transition gradient between sections */}
                        {i < SECTIONS.length - 1 ? (
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/50 to-black" />
                        ) : null}


                    </section>
                )
            })}
            <EnhancedCTAButton />
        </main>
    )
}
