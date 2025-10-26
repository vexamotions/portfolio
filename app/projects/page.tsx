"use client"
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { MorphingBlob } from '@/components/MorphingBlob';
import { ProjectCard } from '@/components/ProjectCard';
import { Project } from '@/types/types';
import React from 'react';


const AllProjects: React.FC = () => {
    const projects: Project[] = [
        {
            id: 1,
            title: '3D Virtual Tour of Apartment',
            description: 'A fully interactive 3D virtual tour of a modern apartment, designed to provide an immersive walkthrough experience for potential buyers or renters. This project allows users to explore the apartment in detail from any angle, offering realistic navigation, smooth transitions, and high-quality visuals. Ideal for real estate marketing, it enhances property presentations and helps clients visualize the space remotely.',
            thumbnail: '/videos/work/3d-home-tour-preview.jpg',
            video: '/videos/work/3d-home-tour.mp4'
        },
        {
            id: 2,
            title: 'Sagittarius A* Watch Animation',
            description: 'A high-end, cinematic watch animation designed and rendered in Blender. Inspired by the elegance of space and time, this piece showcases detailed modeling, realistic materials, and smooth motion — perfect for luxury product marketing and brand visuals.',
            thumbnail: '/videos/work/3d-watch-preview.jpg',
            video: '/videos/work/3d-watch-animation.mp4'
        },
        {
            id: 3,
            title: 'Smart EV Charger Animation',
            description: 'This animation brings the EV Smart Charger to life, showing just how easy and smart charging your electric vehicle can be. It highlights the charger\'s sleek design, its smart features, and how it makes the charging process seamless and efficient—perfect for a greener, more connected future.',
            thumbnail: '/videos/work/3d-ev-charger-preview.png',
            video: '/videos/work/3d-ev-charger.mp4'
        },
        {
            id: 4,
            title: 'Smart Remote Control Animation',
            description: 'A sleek and modern smart remote control animation showcasing intuitive user interface and ergonomic design. This animation demonstrates the remote\'s features, button interactions, and seamless connectivity with smart home devices. Perfect for product launches and marketing campaigns.',
            thumbnail: '/videos/work/3d-smart-remote-preivew.png',
            video: '/videos/work/3d-smart-remote.mp4'
        },
        {
            id: 5,
            title: 'Smart Switches Collection',
            description: 'A comprehensive animation series featuring modern smart switches for home automation. This collection highlights different switch designs, touch interfaces, and integration with smart home ecosystems. Each animation demonstrates the seamless user experience and elegant aesthetics of next-generation home controls.',
            thumbnail: '/videos/work/3d-smart-switches-preview.png',
            video: '/videos/work/3d-smart-switches.mp4'
        },
        {
            id: 6,
            title: '3D Animation Mixture Reel',
            description: 'A dynamic showcase reel featuring various 3D animation projects including product visualizations, motion graphics, and character animations. This compilation demonstrates versatility in animation styles, technical proficiency, and creative storytelling across different industries and applications.',
            thumbnail: '/videos/work/3d-mixture-preivew.png',
            video: '/videos/work/3d-animations-mixture.mp4'
        },
        {
            id: 7,
            title: 'Robot Landing Sequence',
            description: 'A cinematic robot landing animation featuring advanced mech design and atmospheric entry effects. This project showcases realistic physics, dynamic lighting, and detailed robotic mechanisms. Perfect for sci-fi productions, game cinematics, or tech product demonstrations.',
            thumbnail: '/videos/work/3d-robot-preview.png',
            video: '/videos/work/3d-robot-landing.mp4'
        },
        {
            id: 8,
            title: '2D Construction Explanation',
            description: 'An educational 2D animation explaining complex construction processes in an engaging and easy-to-understand manner. Using clear visuals and step-by-step demonstrations, this animation breaks down construction methodologies for training, client presentations, and educational purposes.',
            thumbnail: '/videos/work/2d-construction-preivew.png',
            video: '/videos/work/2d-construction-explanation.mp4'
        },
        {
            id: 9,
            title: '2D Music Video Animation',
            description: 'A vibrant 2D animated music video combining artistic expression with rhythmic storytelling. This project features custom character designs, fluid motion, and synchronized visual elements that enhance the musical experience. Ideal for artists, bands, and creative marketing campaigns.',
            thumbnail: '/videos/work/2d-music-preivew.png',
            video: '/videos/work/2d-copy-of-music-video.mp4'
        },
        {
            id: 10,
            title: 'Neura Flow - Motion Design Dashboard',
            description: 'A sleek, futuristic motion design showcase for the Neura Flow dashboard interface. This animation brings to life an advanced analytics dashboard with fluid transitions, dynamic data visualizations, and intuitive user interactions.',
            thumbnail: '/videos/work/motion-design-preivew.png',
            video: '/videos/work/motion-design.mp4'
        }

    ];

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-black">
                <MorphingBlob />

                <div className="pb-24">
                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                            {projects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProjects;