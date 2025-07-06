import { useEffect, useState } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

interface ProgressBarProps {
  api?: CarouselApi;
}

export const ProgressBar = ({ api }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateProgress = () => {
      const selectedIndex = api.selectedScrollSnap();
      const totalSlides = api.scrollSnapList().length;
      const percentage = totalSlides > 1 ? (selectedIndex / (totalSlides - 1)) * 100 : 0;
      setProgress(percentage);
    };

    // Update on selection change
    api.on("select", updateProgress);
    
    // Initial update
    updateProgress();

    return () => {
      api.off("select", updateProgress);
    };
  }, [api]);

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
