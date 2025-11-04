"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Search, PenTool, Code2, Send } from "lucide-react"
import gsap from "gsap"
import { ProcessCard } from "../process-card"

const processSteps = [
    {
        title: "Discover",
        description:
            "We dive deep into understanding your vision, goals, and challenges to create a solid foundation.",
        icon: Search,
    },
    {
        title: "Design",
        description:
            "Crafting beautiful, intuitive experiences that resonate with your audience and bring ideas to life.",
        icon: PenTool,
    },
    {
        title: "Build",
        description:
            "Transforming designs into robust, scalable solutions with cutting-edge technology and best practices.",
        icon: Code2,
    },
    {
        title: "Deliver",
        description:
            "Launching your project with precision, ensuring seamless deployment and ongoing support.",
        icon: Send,
    },
]

export function OurProcess() {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const mobileContainerRef = useRef(null)
    const cardRefs = useRef([])
    const [currentCard, setCurrentCard] = useState(0)
    const [hasDropped, setHasDropped] = useState(false)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    useEffect(() => {
        // Header animation
        gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: -20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                immediateRender: false
            }
        )

        // Desktop card reveal animation
        const cards = cardRefs.current
        if (window.innerWidth >= 1024) {
            gsap.set(cards, { scale: 0.9, opacity: 0 })

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(cards, {
                                scale: 1,
                                opacity: 1,
                                duration: 0.6,
                                stagger: 0.15,
                                ease: "power2.out",
                                immediateRender: false,
                                overwrite: "auto"
                            })
                            observer.unobserve(entry.target)
                        }
                    })
                },
                { threshold: 0.2 }
            )

            if (containerRef.current) {
                observer.observe(containerRef.current)
            }

            return () => {
                gsap.killTweensOf(cards)
                observer.disconnect()
            }
        }
    }, [])

    useEffect(() => {
        // Mobile: Trigger drop animation on first view
        if (window.innerWidth < 1024 && !hasDropped) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setHasDropped(true)
                            observer.unobserve(entry.target)
                        }
                    })
                },
                { threshold: 0.3 }
            )

            if (mobileContainerRef.current) {
                observer.observe(mobileContainerRef.current)
            }

            return () => observer.disconnect()
        }
    }, [hasDropped])

    const nextSlide = () => {
        setCurrentCard((prev) => (prev + 1) % processSteps.length)
    }

    const prevSlide = () => {
        setCurrentCard((prev) => (prev - 1 + processSteps.length) % processSteps.length)
    }

    // Swipe detection
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe) {
            nextSlide()
        }
        if (isRightSwipe) {
            prevSlide()
        }
    }

    return (
        <section
            id="process"
            ref={containerRef}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden bg-background"
        >
            <div ref={headerRef} className="text-center mb-12 space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground text-balance">
                    How We Bring Ideas to Life
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                    From creative chaos to structured clarity — our process transforms vision into reality
                </p>
            </div>

            {/* Desktop View */}
            <div style={{ willChange: 'transform, opacity' }} className="hidden lg:flex relative w-full max-w-7xl h-[600px] lg:h-[700px] items-start justify-center pt-4">
                {processSteps.map((step, index) => (
                    <ProcessCard
                        key={step.title}
                        title={step.title}
                        description={step.description}
                        icon={step.icon}
                        index={index}
                    />
                ))}
            </div>

            {/* Mobile View - Card Drop then Swipe */}
            <div
                ref={mobileContainerRef}
                className="lg:hidden w-full max-w-md relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="relative h-[450px] perspective-1000">
                    {processSteps.map((step, index) => {
                        const isActive = index === currentCard
                        const isPrev = index === (currentCard - 1 + processSteps.length) % processSteps.length
                        const isNext = index === (currentCard + 1) % processSteps.length

                        let transform = ''
                        let opacity = 0
                        let zIndex = 0
                        let delay = 0

                        // Initial drop animation
                        if (!hasDropped) {
                            transform = 'translateY(-200%) rotateX(-25deg) scale(0.8)'
                            opacity = 0
                            delay = index * 150 // Stagger delay
                        }
                        // After drop, card stack behavior
                        else {
                            if (isActive) {
                                transform = 'translateY(0) translateZ(0) rotateX(0deg) scale(1)'
                                opacity = 1
                                zIndex = 30
                            } else if (isNext) {
                                transform = 'translateY(20px) translateZ(-100px) scale(0.92)'
                                opacity = 0.5
                                zIndex = 20
                            } else if (isPrev) {
                                transform = 'translateY(40px) translateZ(-150px) scale(0.88)'
                                opacity = 0.3
                                zIndex = 10
                            } else {
                                transform = 'translateY(60px) translateZ(-200px) scale(0.85)'
                                opacity = 0
                                zIndex = 0
                            }
                        }

                        return (
                            <div
                                key={step.title}
                                className="absolute inset-0 ease-out"
                                style={{
                                    transform,
                                    opacity: hasDropped ? opacity : 0,
                                    zIndex,
                                    transformStyle: 'preserve-3d',
                                    transition: hasDropped
                                        ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                        : `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                                    pointerEvents: isActive ? 'auto' : 'none',
                                }}
                            >
                                <div className="w-full h-full bg-gradient-to-br from-card via-card to-card/90 rounded-3xl shadow-2xl p-6 flex flex-col items-start justify-between border border-primary/20 backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

                                    <div className="space-y-6 relative z-10 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-4xl filter drop-shadow-lg">
                                                <step.icon className="w-12 h-12 text-primary" />
                                            </span>
                                            <span className="text-5xl font-bold text-primary/20">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                Step {index + 1}
                                            </span>
                                            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                                        </div>

                                        <h3 className="text-3xl font-bold text-card-foreground tracking-tight">
                                            {step.title}
                                        </h3>

                                        <p className="text-muted-foreground leading-relaxed text-base flex-1">
                                            {step.description}
                                        </p>
                                    </div>

                                    <div className="w-full h-2 bg-gradient-to-r from-primary via-accent to-primary rounded-full relative z-10 shadow-lg shadow-primary/30 mt-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full animate-shimmer" />
                                    </div>

                                    {isActive && hasDropped && (
                                        <>
                                            <div
                                                className="absolute top-10 right-10 w-2 h-2 bg-primary/30 rounded-full animate-float"
                                            />
                                            <div
                                                className="absolute bottom-20 left-10 w-3 h-3 bg-accent/20 rounded-full animate-float-delayed"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prevSlide}
                        disabled={!hasDropped}
                        className="rounded-full border-primary/30 hover:bg-primary/10 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex gap-2">
                        {processSteps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => hasDropped && setCurrentCard(index)}
                                disabled={!hasDropped}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentCard
                                    ? "w-8 bg-primary shadow-lg shadow-primary/50"
                                    : "w-2 bg-primary/30 hover:bg-primary/50"
                                    }`}
                                aria-label={`Go to step ${index + 1}`}
                            />
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextSlide}
                        disabled={!hasDropped}
                        className="rounded-full border-primary/30 hover:bg-primary/10 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* Swipe Hint */}
                {hasDropped && (
                    <div className="text-center mt-6 text-sm text-muted-foreground">
                        Swipe or use buttons to navigate
                    </div>
                )}
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                @keyframes shimmer {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float 4s ease-in-out infinite 0.5s;
                }
            `}</style>
        </section>
    )
}