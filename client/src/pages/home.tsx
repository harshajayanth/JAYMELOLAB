import { motion } from "framer-motion";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import BrandsSection from "@/components/brands-section";
import ServicesSection from "@/components/services-section";
import PortfolioSection from "@/components/portfolio-section";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import BookingForm from "@/components/booking-form";
import Footer from "@/components/footer";
import WaveDivider from "@/components/wave-divider";
import { useAudio } from "@/hooks/use-audio";
import { useEffect } from "react";

export default function Home() {
  const { startBackgroundMusic } = useAudio();

  useEffect(() => {
    // Start background music on component mount (requires user interaction)
    const handleFirstInteraction = () => {
      startBackgroundMusic();
      // Remove listeners after first interaction
      ["click", "scroll", "keydown"].forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };

    ["click", "scroll", "keydown"].forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    return () => {
      ["click", "scroll", "keydown"].forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [startBackgroundMusic]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white"
    >
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <BrandsSection />
      <TestimonialsSection />
      <BookingForm />
      <Footer />
    </motion.div>
  );
}
