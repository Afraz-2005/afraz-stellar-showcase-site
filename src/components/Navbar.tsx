import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

interface NavbarProps {
  api?: CarouselApi;
  current: number;
}

export const Navbar = ({ api, current }: NavbarProps) => {
  const [activeSection, setActiveSection] = useState("hero");
  const navItems = ["About", "Projects", "Skills", "Contact", "Blog"];

  useEffect(() => {
    if (current === 0) {
      setActiveSection("hero");
    } else if (current <= navItems.length) {
      setActiveSection(navItems[current - 1].toLowerCase());
    }
  }, [current, navItems]);

  // Handle clicking on links to navigate to sections
  const handleNavClick = (section: string) => {
    setActiveSection(section);
    
    if (!api) return;
    
    // Explicit mapping to ensure correct navigation
    const sectionMap: { [key: string]: number } = {
      "hero": 0,
      "about": 1,
      "projects": 2,
      "skills": 3,
      "contact": 4,
      "blog": 5
    };
    
    const targetIndex = sectionMap[section];
    if (targetIndex !== undefined) {
      api.scrollTo(targetIndex);
    }
  };

  return (
    <nav className="fixed w-full bg-transparent backdrop-blur-sm z-50 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a 
          href="#hero" 
          className="text-xl font-bold text-white animate-glow"
          onClick={() => handleNavClick("hero")}
        >
          Afraz.
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`relative text-white transition-colors animate-glow group ${
                activeSection === item.toLowerCase() ? "text-white" : "text-white/80 hover:text-white"
              }`}
              onClick={() => handleNavClick(item.toLowerCase())}
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
                  className={`relative text-lg transition-colors animate-glow group ${
                    activeSection === item.toLowerCase() ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => handleNavClick(item.toLowerCase())}
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
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
