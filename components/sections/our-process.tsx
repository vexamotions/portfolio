"use client"

import { useRef, useState, useEffect } from "react"
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
    const scrollTimeoutRef = useRef(null)
    const lastScrollY = useRef(0)

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
        if (window.innerWidth >= 1024) return

        const handleScroll = (e) => {
            e.preventDefault()

            clearTimeout(scrollTimeoutRef.current)

            const currentScrollY = window.scrollY
            const scrollingDown = currentScrollY > lastScrollY.current
            lastScrollY.current = currentScrollY

            scrollTimeoutRef.current = setTimeout(() => {
                if (scrollingDown && currentCard < processSteps.length - 1) {
                    setCurrentCard(prev => prev + 1)
                } else if (!scrollingDown && currentCard > 0) {
                    setCurrentCard(prev => prev - 1)
                }
            }, 100)
        }

        const mobileContainer = mobileContainerRef.current
        if (mobileContainer) {
            mobileContainer.addEventListener('wheel', handleScroll, { passive: false })
            mobileContainer.addEventListener('touchmove', handleScroll, { passive: false })
        }

        return () => {
            if (mobileContainer) {
                mobileContainer.removeEventListener('wheel', handleScroll)
                mobileContainer.removeEventListener('touchmove', handleScroll)
            }
            clearTimeout(scrollTimeoutRef.current)
        }
    }, [currentCard])

    const handleDotClick = (index) => {
        setCurrentCard(index)
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
            <div className="hidden lg:flex relative w-full max-w-7xl h-[600px] lg:h-[700px] items-start justify-center pt-4">
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

            {/* Mobile View - Card Drop Effect */}
            <div
                ref={mobileContainerRef}
                className="lg:hidden w-full max-w-md relative"
            >
                <div className="relative h-[400px] perspective-1000">
                    {processSteps.map((step, index) => {
                        const isActive = index === currentCard
                        const isPast = index < currentCard
                        const isFuture = index > currentCard

                        let transform = ''
                        let opacity = 0
                        let zIndex = 0

                        if (isActive) {
                            transform = 'translateY(0) translateZ(0) rotateX(0deg) scale(1)'
                            opacity = 1
                            zIndex = 30
                        } else if (isPast) {
                            transform = 'translateY(-150%) translateZ(-200px) rotateX(20deg) scale(0.85)'
                            opacity = 0
                            zIndex = 10
                        } else if (isFuture) {
                            transform = 'translateY(150%) translateZ(-200px) rotateX(-20deg) scale(0.85)'
                            opacity = 0.3
                            zIndex = 20
                        }

                        return (
                            <div
                                key={step.title}
                                className="absolute inset-0 transition-all duration-700 ease-out"
                                style={{
                                    transform,
                                    opacity,
                                    zIndex,
                                    transformStyle: 'preserve-3d',
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

                                    {isActive && (
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

                {/* Navigation Dots */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    {processSteps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentCard
                                ? "w-8 bg-primary shadow-lg shadow-primary/50"
                                : "w-2 bg-primary/30 hover:bg-primary/50"
                                }`}
                            aria-label={`Go to step ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Scroll Hint */}
                {currentCard < processSteps.length - 1 && (
                    <div className="text-center mt-6 text-sm text-muted-foreground animate-bounce">
                        Scroll to see next step ↓
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