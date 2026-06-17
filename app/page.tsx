import Hero from "@/components/sections/hero";
import ContactSection from "@/components/sections/contact-section";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { OurProcess } from "@/components/sections/our-process";
import FeaturedWork from "@/components/sections/featured-work";
import RobotJourney from "@/components/sections/robot-journey";
import MarqueeBand from "@/components/sections/marquee-band";
import Capabilities from "@/components/sections/capabilities";
import ScrollDraw from "@/components/sections/scroll-draw";
import ServicesSection from "@/components/sections/ServiceSection";
import EnhancedCTAButton from "@/components/EnhancedCTAButton";
import { getProjects } from "@/lib/sanity";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <RobotJourney />
        <EnhancedCTAButton />
        <FeaturedWork projects={projects} />
        <MarqueeBand />
        <ScrollDraw />
        <Capabilities />
        <ServicesSection />
        <OurProcess />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
