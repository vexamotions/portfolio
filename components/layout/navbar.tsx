"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import { gsap } from "gsap"
import { usePathname, useRouter } from "next/navigation"

interface NavItem {
  label: string
  href: string
}

const NAVIGATION: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" }
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [lastScrollY, setLastScrollY] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [activeSection, setActiveSection] = useState<string>("#home")

  // For routing
  const router = useRouter()
  const pathname = usePathname()

  const navRef = useRef<HTMLElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Initial navbar reveal animation
    const tl = gsap.timeline()
    tl.fromTo(navRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    )

    // Logo entrance with split animation
    gsap.fromTo(logoRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power3.out", delay: 0.5 }
    )

    // Button hover animation setup
    if (buttonRef.current) {
      const btn = buttonRef.current
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(2)"
        })
      })
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      })
    }
  }, [])

  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (currentScrollY / docHeight) * 100

      // Update progress bar
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          width: `${scrollPercent}%`,
          duration: 0.2,
          ease: "none"
        })
      }

      setIsScrolled(currentScrollY > 50)

      // Hide/show navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      // Track active section
      const sections = NAVIGATION.map(item => item.href)
      for (const section of sections) {
        const element = document.querySelector(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    gsap.to(navRef.current, {
      y: isVisible ? 0 : -100,
      duration: 0.4,
      ease: "power3.out"
    })
  }, [isVisible])

  useEffect(() => {
    if (isOpen && mobileMenuRef.current) {
      // Mobile menu entrance
      gsap.fromTo(mobileMenuRef.current,
        { clipPath: "circle(0% at 100% 0%)" },
        { clipPath: "circle(150% at 100% 0%)", duration: 0.6, ease: "power3.inOut" }
      )

      // Stagger links
      gsap.fromTo(mobileLinksRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.2
        }
      )
    }
  }, [isOpen])

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean): void => {
    if (isEntering) {
      gsap.to(e.currentTarget, {
        y: -2,
        duration: 0.3,
        ease: "power2.out"
      })
    } else {
      gsap.to(e.currentTarget, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleNavClick = (href: string): void => {
    setIsOpen(false)

    if (pathname !== "/") {
      // Navigate to home with hash (so it scrolls after navigation)
      router.push(`/${href}`)
      return
    }

    // Already on home page — scroll smoothly
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        {/* Background with blur */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-2xl' : 'bg-transparent'
            }`}
        />

        {/* Animated progress bar */}
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
          style={{ width: '0%' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick("#home")
              }}
              className="relative cursor-pointer group"
            >
              <div
                ref={logoRef}
                className="text-2xl font-bold tracking-tight"
              >
                <span className="text-white">VEXA</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">MOTIONS</span>
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {NAVIGATION.map((item, index) => {
                const isActive = activeSection === item.href
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    ref={el => linksRef.current[index] = el}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }}
                    onMouseEnter={(e) => handleLinkHover(e, true)}
                    onMouseLeave={(e) => handleLinkHover(e, false)}
                    className={`relative px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 hover:text-white'
                      }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
                    )}
                  </a>
                )
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => handleNavClick("#contact")}
                className=" px-8 py-2 text-lg font-medium text-white rounded-full cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))',
                  border: '2px solid rgba(139, 92, 246, 0.6)',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
                }}
              >
                Get In Touch
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-50 text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-2xl"
        >
          <div className="flex flex-col items-end justify-center h-full pr-8 space-y-6">
            {NAVIGATION.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                ref={el => mobileLinksRef.current[index] = el}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.href)
                }}
                className="text-4xl font-bold text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => handleNavClick("#contact")}
              className="mt-8 px-8 py-3 text-lg font-medium text-white rounded-full cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))',
                border: '2px solid rgba(139, 92, 246, 0.6)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
              }}
            >
              Get In Touch
            </button>
          </div>
        </div>
      )}

      {/* Demo Content */}
      {/* <div>
        <section id="home" className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 tracking-tighter">
              Creative<br />Agency
            </h1>
            <p className="text-lg text-white/60">3D • Video • Web Development</p>
          </div>
        </section>

        <section id="work" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950/20 to-black">
          <h2 className="text-6xl font-bold text-white">Our Work</h2>
        </section>

        <section id="services" className="min-h-screen flex items-center justify-center bg-black">
          <h2 className="text-6xl font-bold text-white">Services</h2>
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-cyan-950/20 to-black">
          <h2 className="text-6xl font-bold text-white">About Us</h2>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center bg-black">
          <h2 className="text-6xl font-bold text-white">Get In Touch</h2>
        </section>
      </div> */}
    </>
  )
}