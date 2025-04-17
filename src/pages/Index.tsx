
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useEffect } from "react";

const Index = () => {
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

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">
      <BackgroundAnimation />
      <Navbar />
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center">
          <a 
            href="/#" 
            className="writing-vertical text-white text-xs tracking-widest font-mono hover:scale-110 transition-transform animate-glow"
            style={{ writingMode: 'vertical-lr', marginBottom: '2rem' }}  // Two fingers above the arrow (margin added)
          >
            • BACK TO INTRO •
          </a>
        </div>
      </div>
      <Carousel className="w-screen">
        <CarouselContent className="-ml-0">
          <CarouselItem className="pl-0 basis-full">
            <Hero />
          </CarouselItem>
          <CarouselItem className="pl-0 basis-full">
            <About />
          </CarouselItem>
          <CarouselItem className="pl-0 basis-full">
            <Projects />
          </CarouselItem>
          <CarouselItem className="pl-0 basis-full">
            <Skills />
          </CarouselItem>
          <CarouselItem className="pl-0 basis-full">
            <Contact />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="fixed left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-primary/20 hover:bg-primary/40 backdrop-blur border-2 border-primary/50" />
        <CarouselNext className="fixed right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-primary/20 hover:bg-primary/40 backdrop-blur border-2 border-primary/50" />
      </Carousel>
    </div>
  );
};

export default Index;
