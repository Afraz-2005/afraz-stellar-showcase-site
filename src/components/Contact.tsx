
import { Card, CardContent } from "@/components/ui/card";
import { Github, Instagram, Mail, ExternalLink } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 min-h-screen flex items-center justify-center bg-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-white animate-glow">Get In Touch</h2>
        <Card className="max-w-xl mx-auto bg-black/50 backdrop-blur">
          <CardContent className="p-6">
            <p className="text-white/80 text-center mb-8">
              I'm currently open for new opportunities. Feel free to reach out!
            </p>
            <div className="flex justify-center gap-8">
              <a
                href="mailto:your.mahbirafraz2007@gmail.com"
                target="_blank"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="h-8 w-8" />
              </a>
              <a
                href="https://github.com/Afraz-2005"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Github className="h-8 w-8" />
              </a>
              <a
                href="https://instagram.com/afr.z.x_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Instagram className="h-8 w-8" />
              </a>
              <a
                href="https://discord.com/users/your_username"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-8 w-8" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
