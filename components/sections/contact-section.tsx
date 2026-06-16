"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Clock,
  Check,
  Loader2,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email us", value: "business@vexamotions.com", href: "mailto:business@vexamotions.com" },
  { icon: MapPin, label: "Based in", value: "Remote · Working worldwide", href: null },
  { icon: Clock, label: "Response time", value: "Within 24 hours", href: null },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
];

const PROJECT_TYPES = [
  "3D Animation",
  "2D Animation",
  "Motion Design",
  "Video Editing",
  "Something else",
];

const BUDGETS = ["< $2k", "$2k – $5k", "$5k – $10k", "$10k +"];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState<string>(BUDGETS[1]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New project enquiry · ${projectType}`,
      from_name: "Vexamotions Website",
      name: formData.get("name"),
      email: formData.get("email"),
      project_type: projectType,
      budget,
      message: formData.get("message"),
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-black py-24 md:py-32">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 left-1/2 h-[50vh] w-[60vw] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute -top-20 right-0 h-[40vh] w-[35vw] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:90px_90px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/70">
              Let&apos;s talk
            </p>
            <h2 className="max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              Have a vision?{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Let&apos;s bring it to life.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
              Tell us about your project and we&apos;ll get back to you with ideas,
              a timeline, and a quote — usually within a day.
            </p>

            <div className="mt-10 space-y-5">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                        {label}
                      </div>
                      <div className="text-base font-medium text-white">{value}</div>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} className="block transition-opacity hover:opacity-80">
                    {inner}
                  </a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-cyan-400/50 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm md:p-8"
          >
            {status === "success" ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">
                  Message sent!
                </h3>
                <p className="mt-2 max-w-sm text-white/60">
                  Thanks for reaching out. We&apos;ll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Project type">
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((type) => (
                      <Chip
                        key={type}
                        active={projectType === type}
                        onClick={() => setProjectType(type)}
                      >
                        {type}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <Field label="Budget">
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <Chip key={b} active={budget === b} onClick={() => setBudget(b)}>
                        {b}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <Field label="Tell us about it">
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="A few words about your project, goals, and timeline…"
                    className={cn(inputCls, "resize-none")}
                  />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors duration-300 focus:border-cyan-400/60 focus:bg-white/[0.07]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-all duration-200",
        active
          ? "border-cyan-400/60 bg-cyan-400/10 text-white"
          : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
