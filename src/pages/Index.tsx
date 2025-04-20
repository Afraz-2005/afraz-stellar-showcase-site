import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { ProgressBar } from "@/components/ProgressBar";
import { Preloader } from "@/components/Preloader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { ChatBot } from "@/components/chat/ChatBot";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const carousel = document.querySelector('[role="region"]');
      if (carousel) {
        if (e.deltaY > 0) {
          carousel.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">
      <BackgroundAnimation />
      <Navbar />
      
      {/* Back to intro button */}
      {!isMobile && (
        <div className="fixed left-8 z-50" style={{ 
          top: '40%',
          transform: 'translateY(-100%)',
          marginBottom: '20px'
        }}>
          <a 
            href="#" 
            className="writing-vertical text-white text-xs tracking-widest font-mono hover:scale-110 transition-transform animate-glow"
            style={{ writingMode: 'vertical-lr' }}
          >
            • BACK TO INTRO •
          </a>
        </div>
      )}
      
      <Carousel className="w-screen">
        <CarouselContent className="-ml-0">
          {[Hero, About, Projects, Skills, Contact].map((Component, index) => (
            <CarouselItem key={index} className="pl-0 basis-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Component />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {!isMobile && (
          <>
            <CarouselPrevious className="fixed left-8 rounded-full border-2 border-primary/20 backdrop-blur text-white top-1/2 -translate-y-1/2 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
            <CarouselNext className="fixed right-8 rounded-full border-2 border-primary/20 backdrop-blur text-white top-1/2 -translate-y-1/2 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
          </>
        )}
      </Carousel>

      {isMobile && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-white/70 font-['Space_Mono'] text-sm tracking-widest animate-pulse">
          slide →
        </div>
      )}

      <ProgressBar />
      <ChatBot />
    </div>
  );
};

export default Index;
