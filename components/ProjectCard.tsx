"use client";

import { Project } from '@/types/types';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hls from 'hls.js';
import { projectSlug, projectThumbnail } from '@/lib/projects-data';

interface ProjectCardProps {
    project: Project;
    index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [videoLoading, setVideoLoading] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLAnchorElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const videoSrc = project.video;

        if (!videoSrc) return;

        if (!videoSrc.toLowerCase().endsWith('.m3u8')) {
            video.src = videoSrc;
            video.preload = 'none';
            return;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                autoStartLoad: false,
            });
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hlsRef.current = hls;

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.preload = 'none';
        }
    }, [project.video]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setIsVisible(true);
                        }, index * 20);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [index]);

    const handleMouseEnter = (): void => {
        setIsHovered(true);
        if (project.youtubeId) return;
        setVideoLoading(true);

        if (videoRef.current) {
            if (hlsRef.current) {
                hlsRef.current.startLoad();
            }

            videoRef.current.play()
                .then(() => {
                    setVideoLoading(false);
                })
                .catch(e => {
                    console.log('Video play failed:', e);
                    setVideoLoading(false);
                });
        }
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
        setVideoLoading(false);

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;

            if (hlsRef.current) {
                hlsRef.current.stopLoad();
            }
        }
    };

    const handleImageLoad = (): void => {
        setImageLoaded(true);
    };

    return (
        <Link
            href={`/projects/${project.category}/${projectSlug(project)}`}
            ref={cardRef}
            className={`group block cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 aspect-video mb-6">
                <div className={`absolute inset-0 w-full h-full transition-all duration-700 ${isHovered && !project.youtubeId ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                    }`}>
                    <Image
                        src={projectThumbnail(project)}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        onLoad={handleImageLoad}
                        priority={index < 3}
                    />
                </div>

                {project.youtubeId ? (
                    isHovered && (
                        <iframe
                            key={project.youtubeId}
                            className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2"
                            src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${project.youtubeId}&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`}
                            allow="autoplay; encrypted-media"
                            tabIndex={-1}
                            title={project.title}
                        />
                    )
                ) : (
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-100 scale-103' : 'opacity-0 scale-100'
                            }`}
                    />
                )}

                {videoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}

                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-10'
                        }`}
                />

                <div
                    className={`absolute inset-0 rounded-2xl border transition-all duration-500 ${isHovered ? 'border-white/20 shadow-2xl shadow-white/10' : 'border-transparent'
                        }`}
                />
            </div>

            <div className="px-2">
                <h3
                    className={`text-white text-2xl font-semibold mb-3 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-90'
                        }`}
                >
                    {project.title}
                </h3>
                <p
                    className={`text-zinc-400 text-base leading-relaxed transition-all duration-500 delay-75 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-75'
                        }`}
                >
                    {project.description}
                </p>
            </div>
        </Link>
    );
};