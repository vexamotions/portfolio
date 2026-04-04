import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Contact from "@/components/sections/contact";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { OurProcess } from "@/components/sections/our-process";
import Work from "@/components/sections/WorkSection";
import ServicesSection from "@/components/sections/ServiceSection";
import EnhancedCTAButton from "@/components/EnhancedCTAButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EnhancedCTAButton />
        <ServicesSection />
        <OurProcess />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
