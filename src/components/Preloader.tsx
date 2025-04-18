
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

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
        onComplete: () => setIsAnimationComplete(true)
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
        animate="visible"
        style={{ transform: 'rotate(-15deg)' }}
      >
        <motion.path
          d="M10 10 L90 10 L10 90 L90 90"
          fill="transparent"
          stroke="#8B5CF6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          className={isAnimationComplete ? 'animate-glow' : ''}
          style={{
            filter: isAnimationComplete ? 'drop-shadow(0 0 20px #8B5CF6)' : 'none',
            transition: 'filter 0.5s ease-in-out'
          }}
        />
      </motion.svg>
    </div>
  );
};
