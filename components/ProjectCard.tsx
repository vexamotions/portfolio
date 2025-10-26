import { Project } from '@/types/types';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ProjectCardProps {
    project: Project;
    index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setIsVisible(true);
                        }, index * 150);
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
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Video play failed:', e));
        }
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleImageLoad = (): void => {
        setImageLoaded(true);
    };

    return (
        <div
            ref={cardRef}
            className={`group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 aspect-video mb-6">
                <div className={`absolute inset-0 w-full h-full transition-all duration-700 ${isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                    }`}>
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        onLoad={handleImageLoad}
                        priority={index < 3} // Prioritize loading first 3 images
                    />
                </div>

                <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-100 scale-103' : 'opacity-0 scale-100'
                        }`}
                >
                    <source src={project.video} type="video/mp4" />
                </video>

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
        </div>
    );
};