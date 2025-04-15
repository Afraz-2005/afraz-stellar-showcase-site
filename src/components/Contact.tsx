
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-6">
            <p className="text-gray-600 text-center mb-8">
              I'm currently open for new opportunities. Feel free to reach out!
            </p>
            <div className="flex justify-center gap-8">
              <a
                href="mailto:your.email@example.com"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
