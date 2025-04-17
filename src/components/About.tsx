import { motion } from "framer-motion";

export const About = () => {
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
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-glow">
            About Me
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        >
          <p className="mb-4">
            I am a passionate and creative software developer with a strong foundation in creating engaging and user-friendly web applications.
          </p>
          <p className="mb-4">
            With expertise in front-end technologies like React and back-end technologies like Node.js, I strive to deliver high-quality solutions that exceed expectations.
          </p>
          <p>
            I am always eager to learn new technologies and apply them to solve real-world problems.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
