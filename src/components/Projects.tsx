import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { projectsData } from "@/data/projectsData";

export const Projects = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/70 to-black">
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center">
          <a 
            href="/#" 
            className="writing-vertical text-white text-xs tracking-widest font-mono hover:scale-110 transition-transform animate-glow"
            style={{ writingMode: 'vertical-lr', marginBottom: '2rem' }}
          >
            • BACK TO INTRO •
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-glow">
            My Projects
          </h2>
          <p className="text-lg text-gray-300 mt-4">
            A selection of projects I've worked on, showcasing my skills and experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
