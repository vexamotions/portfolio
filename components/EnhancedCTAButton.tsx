"use client"

import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

export default function EnhancedCTAButton() {
  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-12">
      <Link
        href="/projects"
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-cyan-300/40 bg-black/40 px-7 py-4 text-base font-semibold text-cyan-100 shadow-[0_0_40px_rgba(6,182,212,0.12)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/80 hover:shadow-[0_0_55px_rgba(6,182,212,0.25)]"
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.28),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.25),transparent_40%)] opacity-80 transition duration-300 group-hover:opacity-100" />
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />

        <Sparkles className="relative z-10 h-4 w-4 text-cyan-300" />
        <span className="relative z-10">Explore Full Project Vault</span>
        <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </Link>
    </div>
  )
}
