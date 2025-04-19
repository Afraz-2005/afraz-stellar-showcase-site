
import { useEffect, useState } from 'react';

export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const carouselElement = document.querySelector('[role="region"]');
      if (carouselElement) {
        const scrollPosition = carouselElement.scrollLeft;
        const maxScroll = carouselElement.scrollWidth - carouselElement.clientWidth;
        const percentage = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
        setProgress(percentage);
      }
    };

    const carousel = document.querySelector('[role="region"]');
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      // Initialize progress
      handleScroll();

      // Handle button clicks
      const observer = new MutationObserver(handleScroll);
      observer.observe(carousel, { attributes: true, attributeFilter: ['style'] });

      return () => {
        carousel.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-black/30 z-50">
      <div
        className="h-full bg-primary transition-transform duration-300 ease-out origin-left"
        style={{ 
          transform: `scaleX(${progress / 100})`,
        }}
      />
    </div>
  );
};
