"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

export default function SimpleCTAButton() {
    const [isClicked, setIsClicked] = useState(false)

    const handleClick = () => {
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 600)
    }

    return (
        <div className="flex items-center justify-center">
            <Link href="/projects" onClick={handleClick}>
                <button
                    className={`
            relative border-2 border-cyan-400 text-cyan-300 
            hover:bg-cyan-400/10 hover:text-cyan-100 
            px-6 py-4 text-lg font-medium tracking-wide rounded-full 
            overflow-hidden shadow-lg shadow-cyan-400/20 
            hover:shadow-cyan-400/40 hover:shadow-2xl
            hover:scale-105 active:scale-95
            transition-all duration-300
            ${isClicked ? 'animate-shake' : ''}
          `}
                >
                    {/* Animated gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />

                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-3">
                        <Sparkles className="w-5 h-2" />
                        <span>View All Our Works</span>
                        <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isClicked ? 'translate-x-2' : ''}`} />
                    </span>
                </button>
            </Link>

            <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) scale(1); }
          25% { transform: translateX(-5px) scale(0.98); }
          50% { transform: translateX(5px) scale(0.98); }
          75% { transform: translateX(-3px) scale(0.98); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
        </div>
    )
}