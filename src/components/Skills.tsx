import { motion } from "framer-motion";

export const Skills = () => {
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
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-glow">
            My Skills
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {/* Example Skills - Replace with your actual skills */}
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            JavaScript
          </div>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            React
          </div>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            Node.js
          </div>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            HTML/CSS
          </div>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            Tailwind CSS
          </div>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            Git
          </div>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            REST APIs
          </div>
           <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            SQL
          </div>
        </motion.div>
      </div>
    </section>
  );
};
