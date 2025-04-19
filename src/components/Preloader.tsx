
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const pathVariants = {
    hidden: { 
      pathLength: 0, 
      opacity: 0,
      filter: "drop-shadow(0 0 0 rgba(255, 255, 255, 0))"
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      }
    },
    glowing: {
      filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))",
      transition: {
        delay: 2,
        duration: 0.5,
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100]">
      <motion.svg
        width="80vw"
        height="80vh"
        viewBox="0 0 100 100"
        initial="hidden"
        animate={["visible", "glowing"]}
        style={{ transform: 'rotate(-15deg)' }}
      >
        <motion.path
          d="M15 15 L85 15 L15 85 L85 85"
          fill="transparent"
          stroke="#8B5CF6"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
      </motion.svg>
    </div>
  );
};
