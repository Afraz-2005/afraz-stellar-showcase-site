
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const navItems = ["About", "Projects", "Skills", "Contact"];

  return (
    <nav className="fixed w-full bg-transparent backdrop-blur-sm z-50 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <a 
              href="#"
              className="writing-vertical text-white text-xs tracking-widest font-mono hover:scale-110 transition-transform animate-glow"
              style={{ writingMode: 'vertical-lr' }}
            >
              • BACK TO INTRO •
            </a>
          </div>
          <a 
            href="#" 
            className="text-xl font-bold text-white animate-glow"
          >
            Afraz
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/80 hover:text-white transition-colors animate-glow hover:animate-pulse"
            >
              {item}
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
          <SheetContent>
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
