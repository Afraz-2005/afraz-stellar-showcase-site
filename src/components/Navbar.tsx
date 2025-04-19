
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const navItems = ["About", "Projects", "Skills", "Contact"];

  useEffect(() => {
    const handleScroll = () => {
      const carousel = document.querySelector('[role="region"]');
      if (carousel) {
        const scrollPosition = carousel.scrollLeft;
        const width = carousel.clientWidth;
        const section = Math.round(scrollPosition / width);
        
        if (section === 0) setActiveSection("hero");
        else if (section < navItems.length + 1) {
          setActiveSection(navItems[section - 1].toLowerCase());
        }
      }
    };

    const carousel = document.querySelector('[role="region"]');
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [navItems]);

  return (
    <nav className="fixed w-full bg-transparent backdrop-blur-sm z-50 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a 
          href="#hero" 
          className="text-xl font-bold text-white animate-glow"
        >
          Afraz.
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-white/80 hover:text-white transition-colors animate-glow hover:animate-pulse group"
            >
              {item}
              <div 
                className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                  activeSection === item.toLowerCase() 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`}
              />
            </a>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-secondary/95 border-secondary md:hidden">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg text-white/80 hover:text-white transition-colors animate-glow hover:animate-pulse"
                >
                  {item}
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
