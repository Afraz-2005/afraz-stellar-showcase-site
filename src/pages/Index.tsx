import { useState, useEffect, useRef } from 'react';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Blog } from "@/components/Blog";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { ProgressBar } from "@/components/ProgressBar";
import { Preloader } from "@/components/Preloader";
import { Chatbot } from "@/components/Chatbot";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If we're on the Blog page (index 5), allow vertical scrolling
      if (current === 5) {
        // Don't prevent default - allow normal vertical scrolling
        return;
      }
      
      // For all other pages, prevent default and handle horizontal scrolling
      e.preventDefault();
      
      if (e.deltaY > 0) {
        api?.scrollNext();
      } else {
        api?.scrollPrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [api, current]);

  // Control body overflow based on current page
  useEffect(() => {
    if (current === 5) {
      // Blog page - allow vertical scrolling
      document.body.style.overflow = 'auto';
    } else {
      // All other pages - disable vertical scrolling
      document.body.style.overflow = 'hidden';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [current]);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  // Carousel options for instant navigation (no transitions)
  const carouselOptions = {
    align: "start" as const,
    loop: false,
    skipSnaps: false,
    duration: 0, // Instant transition - no animation
    dragFree: false,
    containScroll: "trimSnaps" as const,
  };

  return (
    <div className={`min-h-screen bg-transparent ${current === 5 ? 'overflow-auto' : 'overflow-hidden'}`}>
      <BackgroundAnimation />
      <Navbar api={api} current={current} />
      
              {/* Back to intro button */}
        {!isMobile && (
          <div className="fixed left-8 z-50" style={{ 
            top: '40%',
            transform: 'translateY(-100%)',
            marginBottom: '20px'
          }}>
            <button 
              onClick={() => api?.scrollTo(0)}
              className="writing-vertical text-white text-xs tracking-widest font-mono hover:scale-110 transition-transform animate-glow cursor-pointer"
              style={{ writingMode: 'vertical-lr' }}
            >
              • BACK TO INTRO •
            </button>
          </div>
        )}
      
      <Carousel 
        className="w-screen" 
        opts={carouselOptions}
        setApi={setApi}
      >
        <CarouselContent className="-ml-0">
          {[Hero, About, Projects, Skills, Contact, Blog].map((Component, index) => (
            <CarouselItem key={index} className="pl-0 basis-full">
              <Component />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {!isMobile && (
          <>
            <CarouselPrevious className="fixed left-8 rounded-full border-2 border-primary/20 backdrop-blur text-white top-1/2 -translate-y-1/2 h-12 w-12 bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110" />
            <CarouselNext className="fixed right-8 rounded-full border-2 border-primary/20 backdrop-blur text-white top-1/2 -translate-y-1/2 h-12 w-12 bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110" />
          </>
        )}
      </Carousel>

      {isMobile && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-white/70 font-['Space_Mono'] text-sm tracking-widest animate-pulse">
          slide →
        </div>
      )}

      <ProgressBar api={api} />
      <Chatbot />
    </div>
  );
};

export default Index;
