import { motion } from "framer-motion";

export const Contact = () => {
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
            Contact Me
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Feel free to reach out for collaborations or just a friendly hello!
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Contact Form or Contact Details */}
          <p className="text-gray-300">
            Email: <a href="mailto:afraz98khan@gmail.com" className="text-primary hover:underline">afraz98khan@gmail.com</a>
          </p>
          <p className="text-gray-300">
            LinkedIn: <a href="https://www.linkedin.com/in/afraz-khan-54bb49162/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Afraz Khan</a>
          </p>
          <p className="text-gray-300">
            GitHub: <a href="https://github.com/Afraz-Khan" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Afraz-Khan</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
