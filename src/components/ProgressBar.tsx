
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
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-secondary/20">
      <div
        className="h-full bg-primary/50 backdrop-blur transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
