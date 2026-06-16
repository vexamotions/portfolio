# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vexamotions — a marketing/portfolio site for a creative studio (2D/3D animation, motion design, video editing). Next.js 14 App Router, statically exported. Originally scaffolded with v0 (`package.json` name is still `my-v0-project`).

## Commands

```bash
npm run dev      # local dev server (Next.js)
npm run build    # production build → static export into ./out (output: "export")
npm run start    # serve a non-export production build
npm run lint     # next lint
npx knip         # find unused files/exports/dependencies
```

There is no test suite. `wrangler` is a devDependency, implying the exported `out/` is deployed to Cloudflare Pages, but no `wrangler.toml` is checked in.

## Critical build configuration

`next.config.mjs` makes the build very permissive — be careful, because mistakes won't fail the build:
- `output: "export"` — fully static. **No server-side features work**: no API routes, no server actions, no runtime SSR, no Next.js image optimization (`images.unoptimized: true`). All dynamic routes must be enumerated via `generateStaticParams`.
- `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` — type and lint errors do **not** break the build. Run `lint` and check types manually; don't assume a green build means clean code.

## Architecture

**Routing** (`app/`):
- `app/page.tsx` — single-page home: composes section components (Hero → EnhancedCTAButton → ServicesSection → OurProcess → Contact) between Navbar/Footer. Navigation is anchor-based (`#home`, `#projects`, etc.).
- `app/projects/page.tsx` — category index, cards link to `/projects/[slug]`.
- `app/projects/[category]/page.tsx` — per-category project grid. Uses `generateStaticParams()` over `PROJECT_CATEGORIES` (required for static export). The static `2d/`, `3d/`, `motion-design/`, `video-editing/` route folders also exist alongside the dynamic `[category]` route.
- `app/layout.tsx` — wraps everything in `ScrollProvider`; loads Plus Jakarta + Geist Mono fonts and Vercel Analytics.

**Data is hardcoded, not fetched.** `lib/projects-data.ts` is the single source of truth: `PROJECT_CATEGORIES`, `ALL_PROJECTS` (typed by `types/types.ts`), the `ProjectCategorySlug` union, and lookup maps. To add/change a project or category, edit this file — pages filter `ALL_PROJECTS` by `category`. `lib/constants.ts` holds site/nav/hero/services copy.

**Video pipeline (HLS).** Project videos are HLS streams under `public/hls-command/<slug>/master.m3u8` (with `480p/` renditions and a `poster.jpg`). `components/ProjectCard.tsx` is the canonical pattern: it sets up `hls.js` with `autoStartLoad: false`, shows a static thumbnail by default, and only calls `hls.startLoad()` + `video.play()` on hover (falling back to native `application/vnd.apple.mpegurl` on Safari). Preview stills live in `public/videos/work/`. Reuse this lazy-load-on-hover approach for any new video surface to avoid loading every stream up front.

**Smooth scrolling.** `components/animations/scroll-provider.tsx` (client) dynamically imports Lenis, runs the rAF loop, and intercepts `a[href^="#"]` clicks for smooth anchor scrolling. It wraps the whole app in the root layout — anchor nav depends on it.

**Contact form.** `components/sections/contact.tsx` is a scripted chatbot-style intake flow (the `FLOW` array drives the steps/validation), submitting to **Web3Forms** via `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. hCaptcha/reCAPTCHA libs are installed for spam protection.

**Components:**
- `components/ui/` — shadcn/ui ("new-york" style, see `components.json`), lucide icons.
- `components/sections/` — home-page sections; `components/layout/` — navbar/footer; `components/animations/` & `components/videolevitating/` — scroll/3D/GSAP/framer-motion effects.
- 3D/WebGL work uses `@react-three/fiber` + `drei` + `three` and `ogl`.

## Conventions

- Path alias `@/*` maps to repo root (e.g. `@/lib/utils`, `@/components/ui`). `cn()` helper lives in `lib/utils.ts`.
- Tailwind **v4** — config is CSS-first in `app/globals.css` (`@import "tailwindcss"`, `@custom-variant`, CSS variables for the dark theme); there is no `tailwind.config.js`. PostCSS uses `@tailwindcss/postcss`.
- Components doing browser work (refs, hls.js, IntersectionObserver, Lenis) must be `"use client"`.
- The site is dark-themed by default (`--background: #000000`); category/project pages hardcode `bg-black text-white`.
