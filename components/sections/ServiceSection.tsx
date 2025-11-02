'use client'
import CircularGallery from "../animations/CircularGallery"

const ServicesSection = () => {
    // Define services with images and descriptions
    const services = [
        {
            image: "/videos/work/3d-home-tour-preview.jpg",
            text: "3D Animation",
            subtitle: "Immersive animations for storytelling and branding",
        },
        {
            image: "/videos/work/character/Astro/2.png",
            text: "Modeling",
            subtitle: "High-quality 3D models for games and visuals",
        },
        {
            image: "/videos/work/2d-music-preivew.png",
            text: "2D Animation",
            subtitle: "Dynamic 2D visuals for engaging content",
        },
        {
            image: "/videos/work/motion-design-preivew.png",
            text: "Motion Design",
            subtitle: "Fluid motion graphics for ads and media",
        },
        {
            image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&h=600",
            text: "Video Editing",
            subtitle: "Professional edits for compelling videos",
        },
        {
            image: "/images/design.webp",
            text: "Designing",
            subtitle: "Creative designs for branding and marketing",
        },
        {
            image: "/images/web-design.jpg",
            text: "Web Designing",
            subtitle: "Stunning UI/UX for modern websites",
        },
        // {
        //     image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=600",
        //     text: "Web Development",
        //     subtitle: "Robust, scalable web solutions",
        // },
    ]

    return (
        <div id="services" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
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