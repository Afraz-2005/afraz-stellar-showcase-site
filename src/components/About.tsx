import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Terminal } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-center text-white"
        >
          About Me
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="max-w-3xl mx-auto bg-black/50 backdrop-blur border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex gap-4 mt-1">
                  <Terminal className="w-6 h-6 text-primary" />
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-gray-300 leading-relaxed">
                  I'm a developer passionate about creating innovative digital solutions. With a keen eye for design and a love for clean code, I strive to build applications that make a difference. I enjoy tackling complex problems and turning them into simple, beautiful interfaces.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
