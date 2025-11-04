"use client"

import { memo, useEffect, useRef } from "react"
import { type LucideIcon } from "lucide-react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ProcessCardProps {
    title: string
    description: string
    icon: LucideIcon
    index: number
}

export const ProcessCard = memo(function ProcessCard({
    title,
    description,
    icon: Icon,
    index
}: ProcessCardProps) {
    const cardRef = useRef(null)
    const shineRef = useRef(null)

    useEffect(() => {
        const initialX = (index - 1.5) * 20
        const initialY = 0
        const initialRotate = (index % 2 === 0 ? 1 : -1) * (12 + index * 5)
        const finalX = (index - 1.5) * 350
        const finalY = 320
        const finalRotate = 0

        // Optimize scroll animation
        gsap.fromTo(
            cardRef.current,
            {
                x: initialX,
                y: initialY,
                rotate: initialRotate,
                opacity: 0.7,
                scale: 0.9
            },
            {
                x: finalX,
                y: finalY,
                rotate: finalRotate,
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 0.5,
                    immediateRender: false,
                    pinSpacing: false
                },
                ease: "power2.out"
            }
        )

        // Optimize shine effect
        gsap.to(shineRef.current, {
            xPercent: ["-100%", "100%"],
            duration: 2.5,
            repeat: -1,
            ease: "none",
            immediateRender: false
        })

        // Handle low-performance devices
        const isLowPerformance = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (isLowPerformance) {
            gsap.set(cardRef.current, { opacity: 1, scale: 1 })
            gsap.killTweensOf(shineRef.current)
        }

        // Handle window resize
        let resizeTimeout
        const handleResize = () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh()
            }, 100)
        }
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
            gsap.killTweensOf([cardRef.current, shineRef.current])
        }
    }, [index])

    return (
        <div ref={cardRef} className="absolute">
            <div className="w-56 h-80 md:w-64 md:h-[22rem] lg:w-72 lg:h-96 bg-gradient-to-br from-card via-card to-card/90 rounded-3xl shadow-2xl hover:shadow-primary/20 transition-all duration-300 p-6 lg:p-8 flex flex-col items-start justify-between border border-primary/20 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="space-y-4 lg:space-y-6 relative z-10">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shadow-lg border border-primary/30 backdrop-blur-sm">
                        <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary drop-shadow-lg" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {index + 1}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-card-foreground tracking-tight">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-xs lg:text-sm">{description}</p>
                </div>
                <div className="w-full h-2 bg-gradient-to-r from-primary via-accent to-primary rounded-full relative z-10 shadow-lg shadow-primary/30">
                    <div ref={shineRef} className="shine absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full" />
                </div>
            </div>
        </div>
    )
})