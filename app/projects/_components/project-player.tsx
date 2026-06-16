"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectPlayerProps {
  src?: string;
  poster: string;
  title: string;

  youtubeId?: string;
}

export function ProjectPlayer({ src, poster, title, youtubeId }: ProjectPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [started, setStarted] = useState(false);
  const [ytPlaying, setYtPlaying] = useState(true);

  useEffect(() => {
    if (youtubeId) return;
    const video = videoRef.current;
    if (!video || !src) return;
    if (!src.toLowerCase().endsWith(".m3u8")) {
      video.src = src;
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;
      return () => hls.destroy();
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [src, youtubeId]);

  const handlePlay = () => {
    if (youtubeId) {
      setStarted(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
    setStarted(true);
  };

  const postYt = (func: string) =>
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*",
    );

  const toggleYt = () => {
    postYt(ytPlaying ? "pauseVideo" : "playVideo");
    setYtPlaying((p) => !p);
  };

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black md:rounded-3xl">
      {youtubeId ? (
        started ? (
          <>

            <iframe
              ref={iframeRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />

            <button
              type="button"
              onClick={toggleYt}
              aria-label={ytPlaying ? "Pause" : "Play"}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span
                className={cn(
                  "grid h-16 w-16 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200",
                  "group-hover:opacity-100",
                )}
              >
                {ytPlaying ? <Pause className="h-7 w-7" /> : <Play className="ml-0.5 h-7 w-7" />}
              </span>
            </button>
          </>
        ) : (
          <img src={poster} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        )
      ) : (
        <video
          ref={videoRef}
          poster={poster}
          controls={started}
          playsInline
          controlsList="nodownload"
          className="h-full w-full object-contain"
        />
      )}

      {!started && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${title}`}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 transition-colors duration-300 hover:bg-black/20"
        >
          <span
            className={cn(
              "grid h-20 w-20 place-items-center rounded-full",
              "bg-gradient-to-r from-cyan-400 to-purple-500 text-black",
              "shadow-[0_0_50px_-8px_rgba(34,211,238,0.7)] transition-transform duration-300 group-hover:scale-110",
            )}
          >
            <Play className="ml-1 h-8 w-8 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
