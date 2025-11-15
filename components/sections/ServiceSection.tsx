'use client'
import CircularGallery from "../animations/CircularGallery"

const ServicesSection = () => {
    // Define services with images and descriptions
    const services = [
        {
            image: "/images/3d-animation.jpg",
            text: "3D Animation",
            subtitle: "Immersive 3D storytelling for brands and games",
        },
        {
            image: "/videos/work/character/Astro/2.png",
            text: "3D Modeling",
            subtitle: "High-quality 3D assets for films, games, and visualization",
        },
        {
            image: "/images/website-ui-updated.jpg",
            text: "Website UI/UX Design",
            subtitle: "Modern and responsive website designs for impactful user experiences",
        },
        {
            image: "/videos/work/2d-music-preivew.png",
            text: "2D Animation",
            subtitle: "Engaging 2D visuals and explainer animations",
        },
        {
            image: "/videos/work/motion-design-preivew.png",
            text: "Motion Design",
            subtitle: "Fluid motion graphics for marketing and branding",
        },
        {
            image: "/images/video-editing.jpg",
            text: "Video Editing",
            subtitle: "Professional video edits for storytelling and content creation",
        },
        {
            image: "/images/mobile-app.jpg",
            text: "Mobile App Design",
            subtitle: "Beautiful Figma UI designs for iOS and Android apps",
        },
    ];
    return (
        <div id="services" className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
            <div className="relative z-10 pt-16 pb-8">
                <div className="text-center">
                    <h1 className="font-playfair text-6xl md:text-8xl font-bold text-foreground mb-4 tracking-tight">
                        Our Services
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto px-4 font-light">
                        Explore the creative and technical expertise of Creative Fusion Agency
                    </p>
                </div>
            </div>

            <div className="h-[70vh] relative">
                <CircularGallery
                    items={services}
                    bend={1.2} // Slightly reduced for smoother curvature
                    textColor="#ffffff"
                    borderRadius={0.1} // Modern, subtle rounded edges
                    font="bold 28px Geist Sans" // Consistent with professional look
                    scrollEase={0.04} // Smooth scrolling
                    scrollSpeed={1.8} // Controlled speed for better UX
                />
            </div>

            <div className="relative z-10 pb-16 pt-8">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm md:text-base">
                        Scroll or drag to explore our services
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ServicesSection