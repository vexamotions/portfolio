import Hero from "@/components/sections/hero";
import Contact from "@/components/sections/contact";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { OurProcess } from "@/components/sections/our-process";
import Work from "@/components/sections/WorkSection";
import ServicesSection from "@/components/sections/ServiceSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Work />
        <ServicesSection />
        <OurProcess />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
