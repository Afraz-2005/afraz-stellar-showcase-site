
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gamepad2, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/70 to-black">
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-glow flex items-center justify-center gap-4">
            <Gamepad2 className="w-8 h-8 md:w-12 md:h-12" />
            Hi, I'm Afraz
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          A passionate developer crafting digital experiences
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button asChild className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300">
            <a href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAGk9VRzt9k&#x2F;WgZEIaxgX50Zt2RkSuba5Q&#x2F;view?utm_content=DAGk9VRzt9k&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" className="group">
              View Resume
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
