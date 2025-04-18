
import { useEffect, useState } from 'react';

export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const carouselElement = document.querySelector('[role="region"]');
      if (carouselElement) {
        const scrollPosition = carouselElement.scrollLeft;
        const maxScroll = carouselElement.scrollWidth - carouselElement.clientWidth;
        const percentage = (scrollPosition / maxScroll) * 100;
        setProgress(percentage);
      }
    };

    const carousel = document.querySelector('[role="region"]');
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      // Trigger once to initialize
      handleScroll();
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-black/30 z-50">
      <div
        className="h-full bg-primary"
        style={{ 
          width: `${progress}%`,
          transition: 'width 0.3s ease-out'
        }}
      />
    </div>
  );
};
