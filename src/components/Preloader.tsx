
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
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100]">
      <motion.svg
        width="300"
        height="300"
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
        style={{ transform: 'rotate(-15deg)' }}
      >
        <motion.path
          d="M15 15 L85 15 L15 85 L85 85"
          fill="transparent"
          stroke="#8B5CF6"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
      </motion.svg>
    </div>
  );
};
