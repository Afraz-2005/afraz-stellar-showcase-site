
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { link } from "fs";  
import { ExternalLink, Github, Link } from "lucide-react";

export const Projects = () => {
  const projects = [
    {
      title: "Covid Cross",
      description: "A full-stack application to track COVID-19 cases",
      tech: ["React", "Node.js", "SQL"],
    },
    {
      title: "Speechie",
      description: "Translator with voice integration, Chat bot under development",
      tech: ["React", "Tailwind CSS", "Firebase"],
    },
    {
      title: "A Random Game",
      description: "Real-time data visualization dashboard",
      tech: ["HTML5", "JS", "CSS"],
    },
  ];

  return (
    <section id="projects" className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-white animate-glow">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-white animate-glow">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4 animate-glow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary/70 rounded-full text-sm text-white/80 animate-glow"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors animate-glow hover:animate-pulse"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors animate-glow hover:animate-pulse"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
